package com.wuji.backend.events.quiz

import com.wuji.backend.events.common.ANSWER_COUNTER_CHANNEL
import com.wuji.backend.events.common.NEXT_QUESTION_CHANNEL
import com.wuji.backend.events.common.SSEService
import org.springframework.stereotype.Service
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter

@Service
class SSEQuizService : SSEService() {

    fun addAnswerCounterEmitter(): SseEmitter {
        return addEmitter(ANSWER_COUNTER_CHANNEL)
    }

    fun addNextQuestionEmitter(): SseEmitter {
        return addEmitter(NEXT_QUESTION_CHANNEL)
    }

    fun sendPlayersAnsweredCounter(count: Int) {
        sendEvent(ANSWER_COUNTER_CHANNEL, count)
    }

    fun sendNextQuestion() {
        sendEvent(NEXT_QUESTION_CHANNEL, true)
    }
}
