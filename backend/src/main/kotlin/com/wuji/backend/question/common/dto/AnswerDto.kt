package com.wuji.backend.question.common.dto

import com.wuji.backend.question.common.Answer

data class AnswerDto(val id: Int, val text: String)

fun Answer.toAnswerDto(): AnswerDto {
    return AnswerDto(id = this.id, text = this.text)
}
