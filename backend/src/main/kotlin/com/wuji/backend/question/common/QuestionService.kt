package com.wuji.backend.question.common

import com.wuji.backend.player.state.Player
import com.wuji.backend.player.state.PlayerDetails
import com.wuji.backend.question.common.exception.InvalidQuestionIdException
import com.wuji.backend.question.common.exception.QuestionAlreadyAnsweredException

abstract class QuestionService {
    abstract fun getAnswers(playerIndex: Int): List<PlayerAnswer>

    fun answerQuestion(
        player: Player<out PlayerDetails>,
        question: Question,
        answerIds: Set<Int>,
        answerTimeInMilliseconds: Long = 0,
        playerCheated: Boolean = false
    ): Boolean {
        if (player.alreadyAnswered(question.id)) {
            throw QuestionAlreadyAnsweredException(question.id)
        }
        val invalidQuestionId =
            answerIds.find { answerId ->
                question.answers.none { it.id == answerId }
            }
        if (invalidQuestionId != null) {
            throw InvalidQuestionIdException(invalidQuestionId)
        }

        val playerAnswer =
            PlayerAnswer(
                question, answerIds, answerTimeInMilliseconds, playerCheated)
        player.details.answers.add(playerAnswer)
        return question.areCorrectAnswerIds(answerIds)
    }
}
