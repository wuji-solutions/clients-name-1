package com.wuji.backend.dispenser

import com.wuji.backend.question.common.Question

class QuizDispenser(questions: MutableList<Question>) : GameDispenser {
    override val dispensers: Map<Int, Dispenser> = mapOf(0 to Dispenser(questions))

    override fun getQuestionFromDispenser(id: Int): Question {
        return dispensers[id]?.nextQuestion() ?: throw NoSuchElementException("Brak dispensera o id=$id")
    }

    override fun getCurrentQuestion(id: Int): Question {
        return dispensers[id]?.currentQuestion() ?: throw NoSuchElementException("Brak dispenser o id=$id")
    }
}