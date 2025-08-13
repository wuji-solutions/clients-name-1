package com.wuji.backend.events.common.dto

import com.wuji.backend.player.dto.PlayerDto

class PlayerKickedEvent(override val data: PlayerDto) : SSEEvent {
    override val name: String
        get() = PLAYER_KICKED_EVENT
}
