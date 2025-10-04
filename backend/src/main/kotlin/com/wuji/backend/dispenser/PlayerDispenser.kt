package com.wuji.backend.dispenser

import com.wuji.backend.question.common.Question
import kotlin.math.max

class PlayerDispenser(
    val baseQuestions: List<Question>,
    val additionalQuestions: MutableSet<Question>,
) {
    private var currentQuestionIndex = 0

    fun nextQuestion(): Question {
        if (currentQuestionIndex == baseQuestions.lastIndex) {
            return additionalQuestions.random().also {
                additionalQuestions.remove(it)
            }
        }
        return baseQuestions[++currentQuestionIndex]
    }

    fun currentQuestion(): Question = baseQuestions[currentQuestionIndex]

    fun previousQuestion(): Question {
        currentQuestionIndex = max(currentQuestionIndex - 1, 0)
        return baseQuestions[currentQuestionIndex]
    }
}
