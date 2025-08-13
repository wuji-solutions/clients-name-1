package com.wuji.backend.events.common.dto

import com.wuji.backend.player.dto.PlayerDto

class PlayerListEvent(override val data: Collection<PlayerDto>) : SSEEvent {
    override val name: String
        get() = PLAYER_LIST_EVENT
}
