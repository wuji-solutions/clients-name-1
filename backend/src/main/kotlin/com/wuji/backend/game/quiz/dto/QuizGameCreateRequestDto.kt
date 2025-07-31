package com.wuji.backend.game.quiz.dto

import com.wuji.backend.config.dto.QuizConfigDto
import com.wuji.backend.question.common.Question
import jakarta.validation.Valid

data class QuizGameCreateRequestDto(
    val name: String,
    @field:Valid val config: QuizConfigDto,
    val questions: List<Question>
)
