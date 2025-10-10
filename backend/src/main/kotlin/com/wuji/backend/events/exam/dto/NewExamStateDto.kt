package com.wuji.backend.events.exam.dto

data class NewExamStateDto(
    val requiredQuestionCount: Int,
    val playerState: List<ExamPlayerStateDto>
)

data class ExamPlayerStateDto(
    val index: Int,
    val nickname: String,
    val points: Int,
    val correctAnswers: Int,
    val incorrectAnswers: Int,
)
