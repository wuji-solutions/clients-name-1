package com.wuji.backend.game.common

import com.wuji.backend.game.common.exception.InvalidQuestionCorrectAnswerIdException

data class Question(
    val type: QuestionType,
    val task: String,
    val answers: List<Answer>,
    val correctAnswerId: Int
) {
    val correctAnswer = answers.find { it.id == correctAnswerId } ?: throw InvalidQuestionCorrectAnswerIdException(correctAnswerId)
}

enum class QuestionType {
    TEXT
}

data class Answer(val id: Int, val content: String)
