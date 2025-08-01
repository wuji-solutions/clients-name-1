package com.wuji.backend.events.quiz

import com.wuji.backend.events.common.SSEService
import org.springframework.stereotype.Service
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter

@Service
class SSEQuizService : SSEService() {

    fun addAnswerCounterEmitter(): SseEmitter {
        return addEmitter("answer-counter")
    }

    fun addNextQuestionEmitter(): SseEmitter {
        return addEmitter("next-question")
    }

    fun sendPlayersAnsweredCounter(count: Int) {
        sendEvent("answer-counter", count)
    }

    fun sendNextQuestion() {
        sendEvent("next-question", true)
    }
}
