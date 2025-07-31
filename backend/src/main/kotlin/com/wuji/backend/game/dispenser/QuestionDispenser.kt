package com.wuji.backend.game.dispenser

import com.wuji.backend.game.quiz.exception.QuestionNotFoundException
import com.wuji.backend.question.common.Question

class QuestionDispenser(
    private val questions: List<Question>
) {
    private val questionOrder : MutableMap<Int, MutableList<Int>> = mutableMapOf()
    fun parseQuestions() {
        TODO("question format not yet decided")
    }
    fun registerListener(index: Int) =
        questionOrder.put(index, (0..questions.size).shuffled().toMutableList())

    fun getQuestionForListener(index: Int): Question? {
        val list = questionOrder.getOrElse(index) { return null }
        return getQuestionByIndex(list.removeFirst())
    }

    fun getQuestionByIndex(index: Int): Question {
        if (index !in 0..questions.size) {
            throw QuestionNotFoundException()
        }
        return questions[index]
    }
    fun getRandomQuestion(): Question = questions.random()

}