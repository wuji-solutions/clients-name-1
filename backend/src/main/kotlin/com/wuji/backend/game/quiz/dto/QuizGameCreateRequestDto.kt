package com.wuji.backend.game.quiz.dto

import com.wuji.backend.game.QuizConfig
import com.wuji.backend.question.common.Question

data class QuizGameCreateRequestDto(
    val name: String,
    val config: QuizConfig,
    val questions: List<Question>
)
