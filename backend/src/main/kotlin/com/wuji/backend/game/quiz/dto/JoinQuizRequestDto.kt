package com.wuji.backend.game.quiz.dto

import jakarta.validation.constraints.Min

data class JoinQuizRequestDto(
    @Min(1, message = "Index powinien wynosic conajmniej 1.")
    val index: Int
)
