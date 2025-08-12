package com.wuji.backend.game.quiz.dto

import com.wuji.backend.question.common.dto.QuestionDto

data class QuizSummaryResponseDto(val questions: List<QuestionWithSummaryDto>)

data class QuestionWithSummaryDto(
    val question: QuestionDto,
    val correctAnswers: Int,
    val incorrectAnswers: Int
)
