package com.wuji.backend.events.quiz

import com.wuji.backend.events.common.ANSWER_COUNTER_CHANNEL
import com.wuji.backend.events.common.EVENTS_CHANNEL
import com.wuji.backend.events.common.SSEEventService
import com.wuji.backend.events.common.SSEService
import com.wuji.backend.events.common.dto.GameFinishEvent
import com.wuji.backend.events.common.dto.GameStartEvent
import com.wuji.backend.events.quiz.dto.AnswerCounterEvent
import com.wuji.backend.events.quiz.dto.EndQuestionEvent
import com.wuji.backend.events.quiz.dto.NextQuestionEvent
import org.springframework.stereotype.Service
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter

@Service
class SSEQuizService(private val sseEventService: SSEEventService) :
    SSEService() {

    fun addAnswerCounterEmitter(): SseEmitter {
        return addEmitter(ANSWER_COUNTER_CHANNEL)
    }

    fun sendPlayersAnsweredCounter(count: Int) {
        sendEvent(ANSWER_COUNTER_CHANNEL, AnswerCounterEvent(count))
    }

    fun sendNextQuestion() {
        sseEventService.sendEvent(EVENTS_CHANNEL, NextQuestionEvent())
    }

    fun sendQuizStart() {
        sseEventService.sendEvent(EVENTS_CHANNEL, GameStartEvent())
    }

    fun sendQuizFinish() {
        sendEvent(EVENTS_CHANNEL, GameFinishEvent())
    }

    fun sendEndQuestion() {
        sendEvent(EVENTS_CHANNEL, EndQuestionEvent())
    }
}
