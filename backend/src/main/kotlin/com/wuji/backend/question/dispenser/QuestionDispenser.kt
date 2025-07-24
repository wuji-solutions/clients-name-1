package com.wuji.backend.question.dispenser

import com.wuji.backend.question.common.Question

class QuestionDispenser() {
    private var index = 0
    private val questions = mutableListOf<Question>()
    fun parseQuestions() {
//        TODO
    }
    fun getNextQuestion(): Question {
        return questions[index++]
    }
    fun getQuestion(index: Int): Question {
        return questions[index]
    }
    fun getRandomQuestion(): Question {
        return questions.random()
    }
}