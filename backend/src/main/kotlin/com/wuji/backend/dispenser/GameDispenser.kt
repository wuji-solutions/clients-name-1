package com.wuji.backend.dispenser

import com.wuji.backend.question.common.Question

interface GameDispenser {
    val dispensers: Map<Int, Dispenser>

    fun moveNextQuestion(id: Int = 0): Question

    fun getCurrentQuestion(id: Int = 0): Question
}
