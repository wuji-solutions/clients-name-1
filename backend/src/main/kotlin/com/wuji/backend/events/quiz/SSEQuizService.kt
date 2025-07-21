package com.wuji.backend.events.quiz

import com.wuji.backend.events.common.SSEService
import org.springframework.stereotype.Service

@Service
class SSEQuizAnswerCounterService : SSEService() {
    fun updateCounter(playersAnsweredCount: Int) {
        sendEvent(playersAnsweredCount)
    }
}
