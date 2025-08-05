package com.wuji.backend.dispenser

import com.wuji.backend.question.common.Question

abstract class GameDispenser {
    abstract val dispensers: Map<Int, Dispenser>

    open fun moveNextQuestion(id: Int = 0): Question {
        val dispenser =
            dispensers[id]
                ?: throw NoSuchElementException("Brak dispenser o id=$id")
        dispenser.nextQuestion()
        return dispenser.currentQuestion()
    }

    open fun getCurrentQuestion(id: Int = 0): Question {
        return dispensers[id]?.currentQuestion()
            ?: throw NoSuchElementException("Brak dispenser o id=$id")
    }
}
