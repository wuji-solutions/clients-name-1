package com.wuji.backend.question.common.dto

import com.wuji.backend.question.common.Answer
import com.wuji.backend.question.common.QuestionType

data class QuestionResponseDto(
    val id: Int,
    val category: String,
    val type: QuestionType,
    val task: String,
    val answers: List<Answer>
)
