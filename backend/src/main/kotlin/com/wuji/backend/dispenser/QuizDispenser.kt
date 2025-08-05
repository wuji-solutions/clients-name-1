package com.wuji.backend.dispenser

import com.wuji.backend.question.common.Question

class QuizDispenser(questions: MutableList<Question>) : GameDispenser() {
    override val dispensers: Map<Int, Dispenser> =
        mapOf(0 to Dispenser(questions))
}
