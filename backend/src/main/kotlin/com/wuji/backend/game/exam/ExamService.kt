package com.wuji.backend.game.exam

import com.wuji.backend.config.ExamConfig
import com.wuji.backend.events.common.SSEEventService
import com.wuji.backend.events.common.SSEUsersService
import com.wuji.backend.game.GameRegistry
import com.wuji.backend.game.common.GameService
import com.wuji.backend.game.common.GameState
import com.wuji.backend.game.common.exception.GameInIncorrectStateException
import com.wuji.backend.game.exam.dto.CompleteExamResponseDto
import com.wuji.backend.game.exam.dto.TimeUntilGameFinishDto
import com.wuji.backend.parser.MoodleXmlParser
import com.wuji.backend.player.dto.PlayerDto
import com.wuji.backend.player.dto.PlayerDto.Companion.toDto
import com.wuji.backend.player.state.ExamPlayer
import com.wuji.backend.player.state.ExamPlayerDetails
import com.wuji.backend.player.state.PlayerIndex
import com.wuji.backend.player.state.PlayerService
import com.wuji.backend.player.state.exception.PlayerAlreadyJoinedException
import com.wuji.backend.player.state.exception.PlayerNotFoundException
import com.wuji.backend.question.common.dto.DetailedPlayerAnswerDto
import com.wuji.backend.question.common.dto.toQuestionDto
import com.wuji.backend.question.common.points
import com.wuji.backend.question.exam.ExamQuestionService
import java.io.File
import java.io.FileNotFoundException
import kotlin.concurrent.thread
import org.springframework.stereotype.Service

@Service
class ExamService(
    private val gameRegistry: GameRegistry,
    private val playerService: PlayerService,
    private val sseUsersService: SSEUsersService,
    private val sseEventService: SSEEventService,
    private val examQuestionService: ExamQuestionService,
) : GameService {
    private val game: ExamGame
        get() = gameRegistry.getAs(ExamGame::class.java)

    override fun joinGame(index: Int, nickname: String): ExamPlayer {
        if (hasJoined(index))
            throw PlayerAlreadyJoinedException(index, nickname)

        return playerService
            .createPlayer(index, nickname, ExamPlayerDetails())
            .also { player -> game.players.add(player) }
            .also { sseUsersService.sendPlayers(listPlayers()) }
    }

    override fun listPlayers(): List<PlayerDto> =
        game.players.map { player -> player.toDto() }

    fun createGame(
        name: String,
        config: ExamConfig,
        questionsFilePath: String,
    ) {
        val questionsFile = File(questionsFilePath)
        if (!questionsFile.exists())
            throw FileNotFoundException(
                "Nie można znaleźć pliku $questionsFilePath")
        if (!questionsFile.isFile)
            throw FileNotFoundException("$questionsFilePath to nie plik")

        val questions = MoodleXmlParser.parse(questionsFile.inputStream())

        check(config.requiredQuestionCount <= questions.size) {
            "Wymagana liczba pytań musi być mniejsza lub równa liczbie pytań w zestawie"
        }
        if (gameRegistry.getState() !in setOf(GameState.FINISHED, null))
            throw GameInIncorrectStateException(
                "${GameState.FINISHED.polish} lub null",
                gameRegistry.getState()?.polish ?: "null")
        gameRegistry.register(ExamGame(name, config, questions))
    }

    override fun startGame() {
        game.start()
        sseEventService.sendGameStart()
    }

    override fun pauseGame() {
        game.pause()
    }

    override fun resumeGame() {
        game.resume()
    }

    override fun finishGame() {
        when (game.gameState) {
            GameState.RUNNING -> {
                game.gameState = GameState.FINISHING
                thread(start = true) {
                    Thread.sleep(
                        game.config.additionalTimeToAnswerAfterFinishInSeconds *
                            1000L)
                    game.gameState = GameState.FINISHED
                    sseEventService.sendGameFinish()
                }
            }
            GameState.FINISHING -> return
            else -> {
                game.finish()
                sseEventService.sendGameFinish()
            }
        }
    }

    override fun kickPlayer(index: Int) {
        val player = game.findPlayerByIndex(index)
        game.players.remove(player)
        sseEventService.sendPlayerKickedEvent(player.toDto())
    }

    override fun hasJoined(index: Int): Boolean =
        try {
            game.findPlayerByIndex(index)
            true
        } catch (_: PlayerNotFoundException) {
            false
        }

    override fun getPlayer(index: Int): ExamPlayer {
        return game.findPlayerByIndex(index)
    }

    override fun getConfig(): ExamConfig = game.config

    fun getTimeUntilFinish(): TimeUntilGameFinishDto {
        val diff = game.plannedFinishTimeEpoch - System.currentTimeMillis()

        val minutes = diff / 60_000
        val seconds = (diff % 60_000) / 1000

        return TimeUntilGameFinishDto(minutes, seconds)
    }

    fun completeAttempt(playerIndex: PlayerIndex): CompleteExamResponseDto {
        val player = game.findPlayerByIndex(playerIndex)
        val totalPoints =
            player.details.points(
                game.config.pointsPerDifficulty,
                game.config.zeroPointsOnCheating)
        var questionsFeedback: List<DetailedPlayerAnswerDto>? = null

        if (game.config.showDetailedFinishFeedback) {
            questionsFeedback =
                player.details.answers.map { playerAnswer ->
                    DetailedPlayerAnswerDto(
                        playerAnswer.question.toQuestionDto(),
                        playerAnswer.selectedIds,
                        playerAnswer.isCorrect,
                        playerAnswer.points(
                            game.config.pointsPerDifficulty,
                            game.config.zeroPointsOnCheating))
                }
        }

        // go to additional questions
        examQuestionService.getNextQuestion(playerIndex)
        return CompleteExamResponseDto(totalPoints, questionsFeedback)
    }
}
