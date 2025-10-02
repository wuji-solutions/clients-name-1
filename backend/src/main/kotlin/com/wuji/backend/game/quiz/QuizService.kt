package com.wuji.backend.game.quiz

import com.wuji.backend.config.QuizConfig
import com.wuji.backend.events.common.SSEEventService
import com.wuji.backend.events.common.SSEUsersService
import com.wuji.backend.game.GameRegistry
import com.wuji.backend.game.common.GameService
import com.wuji.backend.game.quiz.dto.QuestionWithSummaryDto
import com.wuji.backend.game.quiz.dto.QuizSummaryResponseDto
import com.wuji.backend.player.dto.PlayerDto
import com.wuji.backend.player.dto.PlayerDto.Companion.toDto
import com.wuji.backend.player.state.Player
import com.wuji.backend.player.state.PlayerDetails
import com.wuji.backend.player.state.PlayerService
import com.wuji.backend.player.state.QuizPlayer
import com.wuji.backend.player.state.QuizPlayerDetails
import com.wuji.backend.player.state.exception.PlayerAlreadyJoinedException
import com.wuji.backend.player.state.exception.PlayerNotFoundException
import com.wuji.backend.question.common.Question
import com.wuji.backend.question.common.dto.toQuestionDto
import com.wuji.backend.reports.common.GameStats.Companion.countCorrectIncorrectAnswers
import org.springframework.stereotype.Service

@Service
class QuizService(
    private val gameRegistry: GameRegistry,
    private val playerService: PlayerService,
    private val sseService: SSEUsersService,
    private val sseEventService: SSEEventService
) : GameService {

    private val quizGame: QuizGame
        get() = gameRegistry.getAs(QuizGame::class.java)

    override fun joinGame(index: Int, nickname: String): QuizPlayer {
        if (hasJoined(index, nickname))
            throw PlayerAlreadyJoinedException(index, nickname)

        return playerService
            .createPlayer(index, nickname, QuizPlayerDetails())
            .also { player -> quizGame.players.add(player) }
            .also { sseService.sendPlayers(listPlayers()) }
    }

    override fun listPlayers(): List<PlayerDto> =
        quizGame.players.map { player -> player.toDto() }

    fun createGame(
        name: String,
        config: QuizConfig,
        questions: List<Question>
    ) {
        gameRegistry.register(QuizGame(name, config, questions))
    }

    override fun startGame() {
        quizGame.start()
        sseEventService.sendGameStart()
    }

    override fun pauseGame() {
        quizGame.pause()
    }

    override fun resumeGame() {
        quizGame.resume()
    }

    override fun finishGame() {
        quizGame.finish()
        sseEventService.sendGameFinish()
    }

    fun getGameSummary(): QuizSummaryResponseDto {
        val questionsWithSummary: List<QuestionWithSummaryDto> =
            quizGame.askedQuestions
                .map { question ->
                    val (correct, incorrect) =
                        countCorrectIncorrectAnswers(quizGame, question.id)
                    QuestionWithSummaryDto(
                        question.toQuestionDto(), correct, incorrect)
                }
                .toList()

        return QuizSummaryResponseDto(questionsWithSummary)
    }

    override fun kickPlayer(index: Int, nickname: String) {
        val player = quizGame.findPlayerByIndexAndNickname(index, nickname)
        quizGame.players.remove(player)
        sseEventService.sendPlayerKickedEvent(player.toDto())
    }

    override fun hasJoined(index: Int, nickname: String): Boolean =
        try {
            quizGame.findPlayerByIndexAndNickname(index, nickname)
            true
        } catch (_: PlayerNotFoundException) {
            false
        }

    override fun getPlayer(index: Int): Player<out PlayerDetails> {
        return quizGame.findPlayerByIndex(index)
    }

    override fun getConfig(): QuizConfig = quizGame.config
}
