package com.wuji.backend.events.quiz.dto

import com.wuji.backend.events.common.dto.SSEEvent

class NextQuestionEvent() : SSEEvent {
    override val name: String
        get() = NEXT_QUESTION_EVENT

    override val data: Any = Unit
}
