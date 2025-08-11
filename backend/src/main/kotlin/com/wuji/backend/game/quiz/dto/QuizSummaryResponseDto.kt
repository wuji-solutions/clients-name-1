package com.wuji.backend.game.quiz.dto

data class QuizSummaryResponseDto(
    val questionsToSummary: Map<QuestionId, QuestionSummaryDto>
)


data class QuestionSummaryDto(
    val correctAnswers: Int,
    val incorrectAnswers: Int,
)

typealias QuestionId = Int