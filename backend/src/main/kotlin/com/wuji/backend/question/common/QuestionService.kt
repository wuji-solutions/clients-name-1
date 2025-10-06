package com.wuji.backend.question.common

import com.wuji.backend.player.state.Player
import com.wuji.backend.player.state.PlayerDetails
import com.wuji.backend.question.common.exception.InvalidAnswerIdException
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
        val invalidAnswerId =
            answerIds.find { answerId ->
                question.answers.none { it.id == answerId }
            }
        if (invalidAnswerId != null) {
            throw InvalidAnswerIdException(invalidAnswerId)
        }

        val playerAnswer =
            PlayerAnswer(
                question, answerIds, answerTimeInMilliseconds, playerCheated)
        player.details.answers.add(playerAnswer)
        return question.areCorrectAnswerIds(answerIds)
    }

    fun answerQuestionWithOverwrite(
        player: Player<out PlayerDetails>,
        question: Question,
        answerIds: Set<Int>,
        answerTimeInMilliseconds: Long = 0,
        playerCheated: Boolean = false
    ): Boolean {
        val invalidAnswerId =
            answerIds.find { answerId ->
                question.answers.none { it.id == answerId }
            }
        if (invalidAnswerId != null) {
            throw InvalidAnswerIdException(invalidAnswerId)
        }

        check(
            !player.alreadyAnswered(question.id) ||
                player.details.answers.removeIf {
                    it.question.id == question.id
                }) {
                "Coś poszło nie tak z odpowiadaniem na pytanie wiele razy"
            }

        val playerAnswer =
            PlayerAnswer(
                question, answerIds, answerTimeInMilliseconds, playerCheated)
        player.details.answers.add(playerAnswer)
        return question.areCorrectAnswerIds(answerIds)
    }
}
