package com.wuji.backend.game.quiz.dto

import jakarta.validation.constraints.Min

data class AnswerQuestionRequestDto(
    @Min(0, message = "Index odpowiedzi na pytanie musi byc nieujemny")
    val answerId: Int
)
