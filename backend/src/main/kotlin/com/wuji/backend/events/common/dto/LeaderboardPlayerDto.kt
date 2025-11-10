package com.wuji.backend.events.common.dto

import com.wuji.backend.player.state.BoardPlayer

data class LeaderboardPlayerDto(
    val index: Int,
    val nickname: String,
    val points: Int
)

fun BoardPlayer.toLeaderboardPlayerDto() =
    LeaderboardPlayerDto(
        index = index, nickname = nickname, points = details.points())
