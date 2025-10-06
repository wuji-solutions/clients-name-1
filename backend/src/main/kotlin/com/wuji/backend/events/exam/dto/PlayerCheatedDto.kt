package com.wuji.backend.events.exam.dto

import com.wuji.backend.question.common.dto.QuestionDto

data class PlayerCheatedDto(
    val nickname: String,
    val index: Int,
    val question: QuestionDto
)
