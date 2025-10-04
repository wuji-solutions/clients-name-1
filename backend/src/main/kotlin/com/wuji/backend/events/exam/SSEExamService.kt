package com.wuji.backend.events.exam

import com.wuji.backend.events.common.ADMIN_EXAM_CHANNEL
import com.wuji.backend.events.common.SSEService
import com.wuji.backend.events.exam.dto.PlayerCheatedDto
import com.wuji.backend.events.exam.dto.PlayerCheatedEvent
import com.wuji.backend.player.state.Player
import com.wuji.backend.player.state.PlayerDetails
import org.springframework.stereotype.Service
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter

@Service
class SSEExamService : SSEService() {
    fun addAdminEventsEmitter(): SseEmitter = addEmitter(ADMIN_EXAM_CHANNEL)

    fun sendPlayerCheatedEvent(
        player: Player<out PlayerDetails>,
        questionId: Int
    ) {
        sendEvent(
            ADMIN_EXAM_CHANNEL,
            PlayerCheatedEvent(
                PlayerCheatedDto(player.nickname, player.index, questionId)))
    }
}
