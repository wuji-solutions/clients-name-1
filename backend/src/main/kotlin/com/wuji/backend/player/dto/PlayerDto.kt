package com.wuji.backend.player.dto

import com.wuji.backend.player.state.Player
import com.wuji.backend.player.state.PlayerDetails

data class PlayerDto(
    override val index: Int,
    override val nickname: String,
) : IPlayerDto {
    companion object {
        fun Player<out PlayerDetails>.toDto(): PlayerDto {
            return PlayerDto(index = index, nickname = nickname)
        }
    }
}
