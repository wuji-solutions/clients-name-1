package com.wuji.backend.events.common

import com.wuji.backend.events.common.dto.PlayerKickedEvent
import com.wuji.backend.player.dto.PlayerDto
import org.springframework.stereotype.Service
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter

@Service
class SSEEventService() : SSEService() {
    fun addEventsEmitter(): SseEmitter {
        return addEmitter(EVENTS_CHANNEL)
    }

    fun sendPlayerKickedEvent(player: PlayerDto) {
        sendEvent(EVENTS_CHANNEL, PlayerKickedEvent(player))
    }
}
