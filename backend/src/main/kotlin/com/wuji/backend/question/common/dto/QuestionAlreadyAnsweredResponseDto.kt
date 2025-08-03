package com.wuji.backend.question.common.dto

data class QuestionAlreadyAnsweredResponseDto(
    val alreadyAnswered: Boolean,
    val answerIds: Set<Int>
)
