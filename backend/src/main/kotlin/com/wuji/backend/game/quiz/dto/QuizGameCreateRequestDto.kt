package com.wuji.backend.game.quiz.dto

import com.wuji.backend.config.dto.QuizConfigDto
import jakarta.validation.Valid

data class QuizGameCreateRequestDto(
    val name: String,
    @field:Valid val config: QuizConfigDto,
)
