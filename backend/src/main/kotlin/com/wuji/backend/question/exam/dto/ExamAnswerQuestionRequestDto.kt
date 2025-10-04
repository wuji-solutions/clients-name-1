package com.wuji.backend.question.exam.dto

import com.wuji.backend.security.validator.NonNegativeElements

class ExamAnswerQuestionRequestDto(
    @field:NonNegativeElements(message = "Id odpowiedzi muszą być nieujemne")
    val answerIds: Set<Int>,
    val playerCheated: Boolean,
)
