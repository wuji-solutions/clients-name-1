package com.wuji.backend.dispenser

import com.wuji.backend.question.common.Question

class ExamDispenser(players: List<Int>, questions: List<Question>) :
    GameDispenser {
    override val dispensers: MutableMap<Int, Dispenser> = mutableMapOf()

    init {
        for (player in players) {
            dispensers.put(
                player, Dispenser(questions.shuffled().toMutableList()))
        }
    }

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
