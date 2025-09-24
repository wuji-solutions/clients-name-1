package com.wuji.backend.question.common

import com.wuji.backend.config.DifficultyLevel
import kotlin.collections.mutableListOf

data class Question(
    val id: Int,
    val category: String,
    val type: QuestionType,
    val text: String,
    val textFormat: TextFormat,
    val answers: List<Answer>,
    val correctAnswerIds: Set<Int>,
    val difficultyLevel: DifficultyLevel,
    val imageUrl: String?,
    val imageBase64: String?,
    val tags: List<String>
) {
    fun areCorrectAnswerIds(answerIds: Set<Int>) = correctAnswerIds == answerIds

    fun inCorrectAnswerIds(answerId: Int) = answerId in correctAnswerIds

    companion object {
        private var counter: Int = 0

        @SuppressWarnings("kotlin:S107")
        fun create(
            category: String,
            type: QuestionType,
            text: String,
            textFormat: TextFormat,
            answers: List<Answer>,
            correctAnswerIds: Set<Int>,
            difficultyLevel: DifficultyLevel,
            imageUrl: String?,
            imageBase64: String?,
            tags: List<String> = mutableListOf()
        ): Question {
            counter += 1
            return Question(
                counter,
                category,
                type,
                text,
                textFormat,
                answers,
                correctAnswerIds,
                difficultyLevel,
                imageUrl,
                imageBase64,
                tags)
        }
    }
}

enum class QuestionType {
    TEXT;

    fun toPolish(): String =
        when (this) {
            TEXT -> "TEKST"
        }
}

enum class TextFormat {
    HTML,
    PLAIN_TEXT,
    MARKDOWN;

    companion object {}
}
