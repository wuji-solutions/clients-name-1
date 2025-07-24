package com.wuji.backend.question.dispenser

import com.wuji.backend.question.common.Question

class QuestionDispenser() {
    private var questionNumber = 0
    private val questions = mutableListOf<Question>()
    private val questionOrder : MutableMap<Int, MutableList<Int>> = mutableMapOf()
    fun parseQuestions() {
//        TODO
    }
    fun registerListener(index: Int) {
        questionOrder.put(index, (0..questions.size).shuffled().toMutableList())
    }
    fun getQuestionForListener(index: Int): Question? {
        val list = questionOrder.getOrElse(index) { return null }
        return getQuestionByIndex(list.removeFirst())
    }
    fun getNextQuestion(): Question {
        return questions[questionNumber++]
    }
    fun getQuestionByIndex(index: Int): Question {
        return questions[index]
    }
    fun getRandomQuestion(): Question {
        return questions.random()
    }
}