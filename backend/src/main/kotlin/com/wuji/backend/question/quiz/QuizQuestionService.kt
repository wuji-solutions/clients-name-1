package com.wuji.backend.question.quiz

import com.wuji.backend.game.GameRegistry
import com.wuji.backend.game.quiz.QuizGame
import com.wuji.backend.game.quiz.exception.QuestionNotFoundException
import com.wuji.backend.player.state.QuizPlayer
import com.wuji.backend.question.common.PlayerAnswer
import com.wuji.backend.question.common.Question
import com.wuji.backend.question.common.QuestionService
import com.wuji.backend.question.common.exception.QuestionAlreadyAnsweredException
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

        updatePlayerState(player, question, answerId)

        return question.isCorrectAnswerId(answerId)
    }

    private fun QuizPlayer.alreadyAnswered(questionId: Int) =
        details.answers.find { answer -> answer.question.id == questionId } !=
            null

    private fun getQuestionById(n: Int) =
        game.questionDispenser.getQuestionByIndex(n)

    private fun updatePlayerState(
        player: QuizPlayer,
        question: Question,
        answerId: Int
    ) {
        // Should it actually be there? Maybe move it somewhere else
        val playerAnswer = PlayerAnswer(question, answerId)

        player.details.answers.add(playerAnswer)
    }
}
