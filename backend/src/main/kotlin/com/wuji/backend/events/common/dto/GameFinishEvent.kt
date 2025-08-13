package com.wuji.backend.events.common.dto

class GameFinishEvent() : SSEEvent {
    override val name: String
        get() = GAME_FINISH_EVENT

    override val data: Any = Unit
}
