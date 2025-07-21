package com.wuji.backend.question.quiz

import com.wuji.backend.game.GameRegistry
import com.wuji.backend.game.quiz.QuizGame
import com.wuji.backend.game.quiz.exception.QuestionNotFoundException
import com.wuji.backend.player.state.QuizPlayer
import com.wuji.backend.question.common.PlayerAnswer
import com.wuji.backend.question.common.QuestionService
import com.wuji.backend.question.common.exception.QuestionAlreadyAnsweredException
import com.wuji.backend.reports.QuizGameReport
import com.wuji.backend.reports.common.QuizReportRow
import com.wuji.backend.util.ext.toQuestionDto
import org.springframework.stereotype.Service

@Service
class QuizQuestionService(val gameRegistry: GameRegistry) : QuestionService {

    private val game: QuizGame
        get() = gameRegistry.getAs(QuizGame::class.java)

    override fun getAnswers(playerIndex: Int): List<PlayerAnswer> {
        return game.players
            .find { player -> player.index == playerIndex }
            ?.details
            ?.answers ?: emptyList()
    }

    fun getQuestion(questionId: Int) =
        getQuestionById(questionId).toQuestionDto()

    override fun answerQuestion(
        playerIndex: Int,
        questionId: Int,
        answerId: Int
    ): Boolean {
        val question = getQuestionById(questionId)
        val player = game.findPlayerByIndex(playerIndex)

        if (player.alreadyAnswered(questionId)) {
            throw QuestionAlreadyAnsweredException(questionId)
        }

        val playerAnswer = PlayerAnswer(question, answerId)
        player.details.answers.add(playerAnswer)

        updateReport(player, playerAnswer)

        return question.isCorrectAnswerId(answerId)
    }

    private fun QuizPlayer.alreadyAnswered(questionId: Int) =
        details.answers.find { answer -> answer.question.id == questionId } !=
            null

    private fun getQuestionById(n: Int) =
        game.questions.find { question -> question.id == n }
            ?: throw QuestionNotFoundException(n)

    private fun updateReport(player: QuizPlayer, playerAnswer: PlayerAnswer) {
        // TODO update answerTimeInMilliseconds according to internal game timer, when it's built
        val row = QuizReportRow(player, playerAnswer, 0)
        val report = gameRegistry.gameReport as QuizGameReport
        report.addRow(row)
    }
}
