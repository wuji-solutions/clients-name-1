package com.wuji.backend.dispenser

import com.wuji.backend.question.common.Question

class QuizDispenser(questions: MutableList<Question>) : GameDispenser() {
    override val dispensers: Map<Int, Dispenser> =
        mapOf(0 to Dispenser(questions))

    var currentQuestionNumber = 1
        private set

    val totalQuestionCount =
        dispensers[0]?.questions?.size
            ?: throw IllegalStateException("No questions to dispenser")

    override fun moveToNextQuestion(id: Int): Question {
        return super.moveToNextQuestion(id).also { currentQuestionNumber++ }
    }
}
