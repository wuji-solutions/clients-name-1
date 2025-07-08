package com.wuji.backend.game.quiz.dto

import jakarta.validation.constraints.Min

data class AnswerQuestionRequestDto(
    @field:Min(0, message = "Id odpowiedzi na pytanie musi byc nieujemny")
    val answerId: Int
)
