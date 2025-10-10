package com.wuji.backend.game.exam.dto

import com.wuji.backend.config.dto.ExamConfigDto
import jakarta.validation.Valid

class ExamGameCreateRequestDto(
    val name: String,
    @field:Valid val config: ExamConfigDto
)
