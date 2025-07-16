package com.wuji.backend.question.common

import com.wuji.backend.question.common.exception.InvalidQuestionCorrectAnswerIdException

data class Question(
    val id: Int,
    val category: String,
    val type: QuestionType,
    val task: String,
    val answers: List<Answer>,
    val correctAnswerId: Int
) {
    val correctAnswer =
        answers.find { it.id == correctAnswerId }
            ?: throw InvalidQuestionCorrectAnswerIdException(correctAnswerId)

    fun isCorrectAnswerId(answerId: Int) = correctAnswerId == answerId
}

enum class QuestionType {
    TEXT
}

data class Answer(val id: Int, val content: String)

data class PlayerAnswer(val question: Question, val selectedId: Int) {
    val isCorrect = question.isCorrectAnswerId(selectedId)
}
