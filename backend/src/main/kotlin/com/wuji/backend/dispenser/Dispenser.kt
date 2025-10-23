package com.wuji.backend.dispenser

import com.wuji.backend.game.quiz.exception.QuestionNotFoundException
import com.wuji.backend.question.common.Question

class Dispenser(
    val questions: MutableList<Question>,
) {
    fun nextQuestion(): Question {
        if (questions.isEmpty()) {
            throw QuestionNotFoundException()
        }
        return questions.removeFirst()
    }

    fun currentQuestion(): Question {
        if (questions.isEmpty()) {
            throw QuestionNotFoundException()
        }
        return questions.first()
    }
}
