package com.wuji.backend.game.dispenser

import com.wuji.backend.question.common.Question

interface GameDispenser {
    val dispensers: Map<Int, Dispenser>

    fun getQuestionFromDispenser(id: Int = 0): Question?
}