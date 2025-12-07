package com.wuji.backend.question.common.dto

import com.wuji.backend.config.DifficultyLevel
import com.wuji.backend.question.common.ImageDto
import com.wuji.backend.question.common.Question
import com.wuji.backend.question.common.QuestionType
import com.wuji.backend.question.common.toImageDto

data class QuestionDto(
    val id: Int,
    val category: String,
    val type: QuestionType,
    val task: String,
    val answers: List<AnswerDto>,
    val difficultyLevel: DifficultyLevel,
    val images: List<ImageDto>?,
)

fun Question.toQuestionDto() =
    QuestionDto(
        id = this.id,
        category = this.category,
        type = this.type,
        task = this.text,
        answers = this.answers.map { it.toAnswerDto() },
        difficultyLevel = this.difficultyLevel,
        images = this.images?.map { it.toImageDto() })
