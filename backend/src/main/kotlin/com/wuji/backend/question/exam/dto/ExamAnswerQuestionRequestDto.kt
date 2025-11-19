package com.wuji.backend.question.exam.dto

import com.fasterxml.jackson.annotation.JsonProperty
import com.wuji.backend.security.validator.NonNegativeElements

class ExamAnswerQuestionRequestDto(
    @field:NonNegativeElements(message = "Id odpowiedzi muszą być nieujemne")
    val answerIds: Set<Int>,
    @JsonProperty(required = true) val playerCheated: Boolean,
)
