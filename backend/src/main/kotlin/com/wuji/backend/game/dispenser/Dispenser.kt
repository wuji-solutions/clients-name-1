package com.wuji.backend.game.dispenser

import com.wuji.backend.question.common.Question

class Dispenser (
    val questions: MutableList<Question>,
) {
    fun nextQuestion(): Question? {
        if (questions.isEmpty()) {
            return null
        }
        return questions.removeFirst()
    }
}