package com.wuji.backend.question.common.dto

data class DetailedPlayerAnswerDto(
    val question: QuestionDto,
    val selectedAnswerIds: Set<Int>,
    val isCorrect: Boolean,
    val pointsEarned: Int,
)
