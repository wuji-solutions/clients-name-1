package com.wuji.backend.dispenser

import com.wuji.backend.question.common.Question

class BoardDispenser(categories : List<String>, questions : List<Question>) : GameDispenser {
    override val dispensers : MutableMap<Int, Dispenser> = mutableMapOf()
    val categories : List<String> = categories
    init {
        for (i in 0 until categories.size) {
            dispensers.put(i, Dispenser(questions.shuffled().toMutableList()))
        }
    }

    override fun getQuestionFromDispenser(id: Int): Question {
        return dispensers[id]?.nextQuestion() ?: throw NoSuchElementException("Brak dispensera o id=$id")
    }

    override fun getCurrentQuestion(id: Int): Question {
        return dispensers[id]?.currentQuestion() ?: throw NoSuchElementException("Brak dispenser o id=$id")
    }
}