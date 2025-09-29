package com.wuji.backend.events.board

import com.wuji.backend.events.board.dto.NewBoardStateEvent
import com.wuji.backend.events.board.dto.NewLeaderboardStateEvent
import com.wuji.backend.events.common.EVENTS_CHANNEL
import com.wuji.backend.events.common.NEW_BOARD_STATE_CHANNEL
import com.wuji.backend.events.common.SSEService
import com.wuji.backend.game.board.dto.SimpleBoardStateDto
import com.wuji.backend.player.dto.PlayerDto
import org.springframework.stereotype.Service
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter

@Service
class SSEBoardService : SSEService() {
    fun addNewBoardStateEmitter(): SseEmitter =
        addEmitter(NEW_BOARD_STATE_CHANNEL)

    fun sendNewBoardStateEvent(state: SimpleBoardStateDto) {
        sendEvent(NEW_BOARD_STATE_CHANNEL, NewBoardStateEvent(state))
    }

    fun sendNewLeaderboardStateEvent(
        players: List<PlayerDto>,
        showLeaderboardConfig: Boolean
    ) {
        if (showLeaderboardConfig) {
            println("sendNewLeaderboardStateEvent, players: $players")
            sendEvent(EVENTS_CHANNEL, NewLeaderboardStateEvent(players))
        }
    }
}
