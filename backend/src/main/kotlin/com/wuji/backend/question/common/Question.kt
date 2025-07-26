package com.wuji.backend.question.common

data class Question(
    val id: Int,
    val category: String,
    val type: QuestionType,
    val task: String,
    val answers: List<Answer>,
    val correctAnswerIds: Set<Int>
) {
    val correctAnswers = answers.filter { it.id in correctAnswerIds }

    fun isCorrectAnswerId(answerIds: Set<Int>) =
        correctAnswers.equals(answerIds)
}

enum class QuestionType {
    TEXT
}

data class Answer(val id: Int, val content: String)

data class PlayerAnswer(
    val question: Question,
    val selectedIds: Set<Int>,
    val answerTimeInMilliseconds: Int
) {
    val isCorrect = question.isCorrectAnswerId(selectedIds)
}
