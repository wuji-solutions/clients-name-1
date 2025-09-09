package com.wuji.backend.question.common

import com.wuji.backend.config.DifficultyLevel

data class Question(
    val id: Int,
    val category: String,
    val type: QuestionType,
    val task: String,
    val answers: List<Answer>,
    val correctAnswerIds: Set<Int>,
    val difficultyLevel: DifficultyLevel,
) {
    private val correctAnswers = answers.filter { it.id in correctAnswerIds }

    fun areCorrectAnswerIds(answerIds: Set<Int>) = correctAnswerIds == answerIds

    fun inCorrectAnswerIds(answerId: Int) = answerId in correctAnswerIds
}

enum class QuestionType {
    TEXT;

    fun toPolish(): String =
        when (this) {
            TEXT -> "TEKST"
        }
}

data class Answer(val id: Int, val content: String)

data class PlayerAnswer(
    val question: Question,
    val selectedIds: Set<Int>,
    val answerTimeInMilliseconds: Long
) {
    val isCorrect = question.areCorrectAnswerIds(selectedIds)
}
