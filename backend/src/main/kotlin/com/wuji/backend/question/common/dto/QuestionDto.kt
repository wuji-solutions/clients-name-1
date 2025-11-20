package com.wuji.backend.question.common.dto

import com.wuji.backend.config.DifficultyLevel
import com.wuji.backend.question.common.Question
import com.wuji.backend.question.common.QuestionType

data class QuestionDto(
    val id: Int,
    val category: String,
    val type: QuestionType,
    val task: String,
    val answers: List<AnswerDto>,
    val difficultyLevel: DifficultyLevel
)

fun Question.toQuestionDto() =
    QuestionDto(
        id = this.id,
        category = this.category,
        type = this.type,
        task = this.text,
        answers = this.answers.map { it.toAnswerDto() },
        difficultyLevel = this.difficultyLevel)
