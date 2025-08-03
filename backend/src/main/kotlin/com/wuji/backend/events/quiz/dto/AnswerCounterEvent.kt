package com.wuji.backend.events.quiz.dto

import com.wuji.backend.events.common.dto.SSEEvent

class AnswerCounterEvent(override val data: Int) : SSEEvent {
    override val name: String = ANSWER_COUNTER_EVENT
}
