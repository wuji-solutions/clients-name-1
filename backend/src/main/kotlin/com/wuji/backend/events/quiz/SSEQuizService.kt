package com.wuji.backend.events.quiz

import com.wuji.backend.events.common.SSEService
import org.springframework.stereotype.Service

@Service
class SSEQuizService : SSEService() {
    fun sendPlayersAnsweredCounter(playersAnsweredCount: Int) {
        sendEvent(playersAnsweredCount)
    }
}
