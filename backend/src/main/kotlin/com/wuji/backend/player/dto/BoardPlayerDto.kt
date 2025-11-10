package com.wuji.backend.player.dto

import com.wuji.backend.config.DifficultyLevel
import com.wuji.backend.player.state.BoardPlayer
import com.wuji.backend.player.state.Category
import com.wuji.backend.player.state.PlayerState

data class BoardPlayerDto(
    override val index: Int,
    override val nickname: String,
    val points: Int,
    val state: PlayerState,
    val currentPosition: Int,
    val categoryToDifficulty: Map<Category, DifficultyLevel>,
) : IPlayerDto {
    companion object {
        fun BoardPlayer.toBoardPlayerDto(): BoardPlayerDto {
            return BoardPlayerDto(
                index = index,
                nickname = nickname,
                points = details.points(),
                state = details.playerState,
                currentPosition = details.currentTileIndex,
                categoryToDifficulty = details.categoryToDifficulty)
        }
    }
}
