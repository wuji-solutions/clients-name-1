package com.wuji.backend.events.board.dto

import com.wuji.backend.events.common.dto.SSEEvent
import com.wuji.backend.game.board.dto.SimpleBoardStateDto

class NewBoardStateEvent(override val data: SimpleBoardStateDto) : SSEEvent {
    override val name: String
        get() = NEW_BOARD_STATE_EVENT
}
