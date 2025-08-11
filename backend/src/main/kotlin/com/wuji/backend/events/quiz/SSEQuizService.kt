package com.wuji.backend.events.quiz

import com.wuji.backend.events.common.ANSWER_COUNTER_CHANNEL
import com.wuji.backend.events.common.QUIZ_EVENTS_CHANNEL
import com.wuji.backend.events.common.SSEService
import com.wuji.backend.events.common.dto.GameFinishEvent
import com.wuji.backend.events.common.dto.GameStartEvent
import com.wuji.backend.events.quiz.dto.AnswerCounterEvent
import com.wuji.backend.events.quiz.dto.NextQuestionEvent
import org.springframework.stereotype.Service
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter

@Service
class SSEQuizService : SSEService() {

    fun addAnswerCounterEmitter(): SseEmitter {
        return addEmitter(ANSWER_COUNTER_CHANNEL)
    }

    fun addEventsEmitter(): SseEmitter {
        return addEmitter(QUIZ_EVENTS_CHANNEL)
    }

    fun sendPlayersAnsweredCounter(count: Int) {
        sendEvent(ANSWER_COUNTER_CHANNEL, AnswerCounterEvent(count))
    }

    fun sendNextQuestion() {
        sendEvent(QUIZ_EVENTS_CHANNEL, NextQuestionEvent())
    }

    fun sendQuizStart() {
        sendEvent(QUIZ_EVENTS_CHANNEL, GameStartEvent())
    }
        fun sendQuizFinish() {
            sendEvent(QUIZ_EVENTS_CHANNEL, GameFinishEvent())
        }
}
