package com.wuji.backend.events.quiz.dto

import com.wuji.backend.events.common.dto.SSEEvent

class EndQuestionEvent() : SSEEvent {
    override val name: String
        get() = END_QUESTION_EVENT

    override val data: Any = Unit
}
