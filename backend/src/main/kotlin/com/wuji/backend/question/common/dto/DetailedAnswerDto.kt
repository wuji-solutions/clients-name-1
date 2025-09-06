package com.wuji.backend.question.common.dto

import com.wuji.backend.question.common.Answer

data class DetailedAnswerDto(
    val id: Int,
    val content: String,
    val isCorrect: Boolean
)

fun Answer.toDetailedAnswerDto(isCorrect: Boolean): DetailedAnswerDto {
    return DetailedAnswerDto(
        id = this.id, content = this.text, isCorrect = isCorrect)
}
