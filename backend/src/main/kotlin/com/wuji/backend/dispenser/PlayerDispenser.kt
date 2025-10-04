package com.wuji.backend.dispenser

import com.wuji.backend.question.common.Question
import kotlin.math.max
import kotlin.math.min

class PlayerDispenser(
    val baseQuestions: List<Question>,
    val additionalQuestions: List<Question>,
) {
    private var currentQuestionIndex = 0

    fun nextQuestion(): Question {
        currentQuestionIndex =
            min(currentQuestionIndex + 1, baseQuestions.size - 1)
        return baseQuestions[currentQuestionIndex]
    }

    fun currentQuestion(): Question = baseQuestions[currentQuestionIndex]

    fun previousQuestion(): Question {
        currentQuestionIndex = max(currentQuestionIndex - 1, 0)
        return baseQuestions[currentQuestionIndex]
    }
}
