package com.wuji.backend.events.exam.dto

import com.wuji.backend.events.common.dto.SSEEvent

class NewExamStateEvent(override val data: NewExamStateDto) : SSEEvent {
    override val name: String
        get() = NEW_EXAM_STATE_EVENT
}
