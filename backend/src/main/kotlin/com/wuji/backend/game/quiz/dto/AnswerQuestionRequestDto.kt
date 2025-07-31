package com.wuji.backend.game.quiz.dto

import com.wuji.backend.security.validator.NonNegativeElements

data class AnswerQuestionRequestDto(
    @field:NonNegativeElements(message = "Id odpowiedzi muszą być nieujemne")
    val answerIds: Set<Int>,
)
