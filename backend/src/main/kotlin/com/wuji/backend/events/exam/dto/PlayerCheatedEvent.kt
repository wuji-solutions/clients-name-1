package com.wuji.backend.events.exam.dto

import com.wuji.backend.events.common.dto.SSEEvent

class PlayerCheatedEvent(override val data: PlayerCheatedDto) : SSEEvent {
    override val name: String
        get() = PLAYER_CHEATED_EVENT
}
