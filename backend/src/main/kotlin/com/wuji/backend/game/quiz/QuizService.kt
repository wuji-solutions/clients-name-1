package com.wuji.backend.game.quiz

import com.wuji.backend.config.QuizConfig
import com.wuji.backend.events.common.SSEUsersService
import com.wuji.backend.events.quiz.SSEQuizService
import com.wuji.backend.game.GameRegistry
import com.wuji.backend.game.common.GameService
import com.wuji.backend.game.quiz.dto.QuestionWithSummaryDto
import com.wuji.backend.game.quiz.dto.QuizSummaryResponseDto
import com.wuji.backend.player.dto.PlayerDto
import com.wuji.backend.player.dto.PlayerDto.Companion.toDto
import com.wuji.backend.player.state.PlayerService
import com.wuji.backend.player.state.QuizPlayer
import com.wuji.backend.player.state.QuizPlayerDetails
import com.wuji.backend.question.common.Question
import com.wuji.backend.question.common.dto.toQuestionDto
import com.wuji.backend.reports.common.GameStats.Companion.countCorrectIncorrectAnswersForQuestion
import org.springframework.stereotype.Service

@Service
class QuizService(
    private val gameRegistry: GameRegistry,
    private val playerService: PlayerService,
    private val sseService: SSEUsersService,
    private val sseQuizService: SSEQuizService,
) : GameService {

    private val quizGame: QuizGame
        get() = gameRegistry.getAs(QuizGame::class.java)

    override fun joinGame(index: Any, nickname: Any): QuizPlayer {
        return playerService
            .createPlayer(index, nickname, QuizPlayerDetails())
            .also { player -> quizGame.players.add(player) }
            .also { sseService.sendPlayers(quizGame.players) }
    }

    override fun listPlayers(): List<PlayerDto> =
        gameRegistry.game.players.map { player -> player.toDto() }

    fun createGame(
        name: String,
        config: QuizConfig,
        questions: List<Question>
    ) {
        gameRegistry.register(QuizGame(name, config, questions))
    }

    override fun startGame() {
        quizGame.start()
        sseQuizService.sendQuizStart()
    }

    override fun pauseGame() {
        quizGame.pause()
    }

    override fun resumeGame() {
        quizGame.resume()
    }

    override fun finishGame() {
        quizGame.finish()
        sseQuizService.sendQuizFinish()
    }

    fun getGameSummary(): QuizSummaryResponseDto {
        val questionsWithSummary: List<QuestionWithSummaryDto> =
            quizGame.askedQuestions
                .map { question ->
                    val (correct, incorrect) =
                        countCorrectIncorrectAnswersForQuestion(
                            quizGame, question.id)
                    QuestionWithSummaryDto(
                        question.toQuestionDto(), correct, incorrect)
                }
                .toList()

        return QuizSummaryResponseDto(questionsWithSummary)
    }

    override fun getReport(): String {
        TODO("Not yet implemented")
    }
}
