package com.wuji.backend.dispenser

import com.wuji.backend.question.common.Question

class QuizDispenser(questions: MutableList<Question>) : GameDispenser {
    override val dispensers: Map<Int, Dispenser> =
        mapOf(0 to Dispenser(questions))

    override fun moveNextQuestion(id: Int): Question {
        val dispenser =
            dispensers[id]
                ?: throw NoSuchElementException("Brak dispenser o id=$id")
        dispenser.nextQuestion()
        return dispenser.currentQuestion()
    }

    override fun getCurrentQuestion(id: Int): Question {
        return dispensers[id]?.currentQuestion()
            ?: throw NoSuchElementException("Brak dispenser o id=$id")
    }
}
