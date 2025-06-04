package com.wuji.backend.player.state

import com.wuji.backend.question.PlayerAnswer

data class PlayerState<PlayerStateDetailsT>(
    val index: Int,
    val nickname: String,
    var details: PlayerStateDetailsT
)

open class PlayerStateDetails

data class QuizPlayerStateDetails(
    val answers: MutableList<PlayerAnswer> = mutableListOf()
) : PlayerStateDetails()

