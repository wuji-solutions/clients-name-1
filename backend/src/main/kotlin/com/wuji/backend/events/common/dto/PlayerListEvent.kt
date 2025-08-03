package com.wuji.backend.events.common.dto

import com.wuji.backend.player.state.Player
import com.wuji.backend.player.state.PlayerDetails

class PlayerListEvent(override val data: Collection<Player<PlayerDetails>>) :
    SSEEvent {
    override val name: String
        get() = PLAYER_LIST_EVENT
}
