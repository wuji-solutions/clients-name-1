package com.wuji.backend.player.state

import com.wuji.backend.question.common.PlayerAnswer

data class Player<PlayerDetailsT : PlayerDetails>(
    val index: Int,
    val nickname: String,
    var details: PlayerDetailsT
) {
    fun alreadyAnswered(questionId: Int) =
        details.answers.any { answer -> answer.question.id == questionId }
}

open class PlayerDetails(
    val answers: MutableList<PlayerAnswer> = mutableListOf()
)

typealias QuizPlayerDetails = PlayerDetails

typealias QuizPlayer = Player<QuizPlayerDetails>
