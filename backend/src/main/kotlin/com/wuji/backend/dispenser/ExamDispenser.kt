package com.wuji.backend.dispenser

import com.wuji.backend.question.common.Question

class ExamDispenser(players: List<Int>, questions : List<Question>) : GameDispenser {
    override val dispensers : MutableMap<Int, Dispenser> = mutableMapOf()
    init {
        for (player in players) {
            dispensers.put(player, Dispenser(questions.shuffled().toMutableList()))
        }
    }

    override fun getQuestionFromDispenser(id: Int): Question {
        return dispensers[id]?.nextQuestion() ?: throw NoSuchElementException("Brak dispensera o id=$id")
    }

    override fun getCurrentQuestion(id: Int): Question {
        return dispensers[id]?.currentQuestion() ?: throw NoSuchElementException("Brak dispenser o id=$id")
    }
}