package com.wuji.backend.game.exam.dto

import com.wuji.backend.question.common.dto.DetailedPlayerAnswerDto

data class CompleteExamResponseDto(
    val totalPointsEarned: Int,
    val questionsAnswered: List<DetailedPlayerAnswerDto>?
)
