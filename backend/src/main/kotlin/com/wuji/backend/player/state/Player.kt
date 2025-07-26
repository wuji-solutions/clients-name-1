package com.wuji.backend.player.state

import com.wuji.backend.question.common.PlayerAnswer

data class Player<PlayerDetailsT>(
    val index: Int,
    val nickname: String,
    var details: PlayerDetailsT
)

open class PlayerDetails(
    val answers: MutableList<PlayerAnswer> = mutableListOf()
)

typealias QuizPlayerDetails = PlayerDetails

typealias QuizPlayer = Player<QuizPlayerDetails>
