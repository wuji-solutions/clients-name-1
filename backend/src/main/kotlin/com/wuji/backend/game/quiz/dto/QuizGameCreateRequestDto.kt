package com.wuji.backend.game.quiz.dto

import com.wuji.backend.question.common.Question
import jakarta.validation.Valid

data class QuizGameCreateRequestDto(
    val name: String,
    @field:Valid val config: QuizConfigGameCreateRequestDto,
    val questions: List<Question>
)
