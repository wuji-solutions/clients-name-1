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

    override fun moveNextQuestion(id: Int): Question {
        val dispenser = dispensers[id] ?: throw NoSuchElementException("Brak dispenser o id=$id")
        dispenser.nextQuestion()
        return dispenser.currentQuestion()
    }

    override fun getCurrentQuestion(id: Int): Question {
        return dispensers[id]?.currentQuestion() ?: throw NoSuchElementException("Brak dispenser o id=$id")
    }
}