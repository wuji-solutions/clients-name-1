package com.wuji.backend.events.board.dto

import com.wuji.backend.events.common.dto.LeaderboardPlayerDto
import com.wuji.backend.events.common.dto.SSEEvent

class NewLeaderboardStateEvent(override val data: List<LeaderboardPlayerDto>) :
    SSEEvent {
    override val name: String
        get() = NEW_LEADERBOARD_STATE_EVENT
}
