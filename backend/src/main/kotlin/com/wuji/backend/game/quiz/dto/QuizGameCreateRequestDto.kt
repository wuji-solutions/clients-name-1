package com.wuji.backend.game.quiz.dto

import com.wuji.backend.game.quiz.QuizGameConfig
import com.wuji.backend.question.common.Question

data class QuizGameCreateRequestDto(
    val name: String,
    val config: QuizGameConfig,
    val questions: List<Question>
)
