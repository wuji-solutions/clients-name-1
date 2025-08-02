package com.wuji.backend.question.common.dto

import com.wuji.backend.question.common.Answer

data class AnswerDto(val id: Int, val content: String)

fun Answer.toAnswerDto(): AnswerDto {
    return AnswerDto(id = this.id, content = this.content)
}
