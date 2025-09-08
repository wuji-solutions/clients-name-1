package com.wuji.backend.player.state

import com.wuji.backend.question.common.PlayerAnswer
import com.wuji.backend.question.common.exception.QuestionNotYetAnsweredException

data class Player<PlayerDetailsT : PlayerDetails>(
    val index: PlayerIndex,
    val nickname: String,
    var details: PlayerDetailsT
) {
    fun alreadyAnswered(questionId: Int) =
        details.answers.any { answer -> answer.question.id == questionId }

    fun answerForQuestion(questionId: Int): PlayerAnswer {
        if (!alreadyAnswered(questionId)) {
            throw QuestionNotYetAnsweredException(questionId)
        }
        return details.answers.first { answer ->
            answer.question.id == questionId
        }
    }
}

open class PlayerDetails(
    val answers: MutableList<PlayerAnswer> = mutableListOf(),
    val timeTookInSeconds: Long = 0
)

typealias QuizPlayerDetails = PlayerDetails

typealias QuizPlayer = Player<QuizPlayerDetails>

typealias PlayerIndex = Int
