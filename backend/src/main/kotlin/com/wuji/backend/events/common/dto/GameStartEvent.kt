package com.wuji.backend.events.common.dto

class GameStartEvent() : SSEEvent {
    override val name: String
        get() = GAME_START_EVENT

    override val data: Any = Unit
}
