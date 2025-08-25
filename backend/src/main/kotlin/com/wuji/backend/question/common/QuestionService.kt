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
        answerIds: Set<Int>
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
        // TODO update answerTimeInMilliseconds according to internal game timer, when it's built
        val playerAnswer = PlayerAnswer(question, answerIds, 0)
        player.details.answers.add(playerAnswer)
        return question.areCorrectAnswerIds(answerIds)
    }
}
