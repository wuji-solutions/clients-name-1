package com.wuji.backend.events.board.dto

import com.wuji.backend.events.common.dto.SSEEvent
import com.wuji.backend.player.dto.PlayerDto

class NewRankingStateEvent(override val data: List<PlayerDto>) : SSEEvent {
    override val name: String
        get() = NEW_RANKING_STATE_EVENT
}
