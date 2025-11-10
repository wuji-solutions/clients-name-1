package com.wuji.backend.player.dto

import com.wuji.backend.player.state.BoardPlayer
import com.wuji.backend.player.state.PlayerState

data class BoardPlayerDto(
    override val index: Int,
    override val nickname: String,
    val points: Int,
    val state: PlayerState,
    val currentPosition: Int,
) : IPlayerDto {
    companion object {
        fun BoardPlayer.toBoardPlayerDto(): BoardPlayerDto {
            return BoardPlayerDto(
                index = index,
                nickname = nickname,
                points = details.points(),
                state = details.playerState,
                currentPosition = details.currentTileIndex)
        }
    }
}
