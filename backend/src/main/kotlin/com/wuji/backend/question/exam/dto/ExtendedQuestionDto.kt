package com.wuji.backend.question.exam.dto

import com.wuji.backend.config.DifficultyLevel
import com.wuji.backend.question.common.PlayerAnswer
import com.wuji.backend.question.common.Question
import com.wuji.backend.question.common.QuestionType
import com.wuji.backend.question.common.dto.AnswerDto
import com.wuji.backend.question.common.dto.PlayerAnswerDto
import com.wuji.backend.question.common.dto.toAnswerDto
import com.wuji.backend.question.common.dto.toDto

data class ExtendedQuestionDto(
    val id: Int,
    val category: String,
    val type: QuestionType,
    val task: String,
    val answers: List<AnswerDto>,
    val difficultyLevel: DifficultyLevel,
    val questionNumber: Int,
    val totalBaseQuestions: Int,
    val playerAlreadyAnswered: Boolean,
    val playerAnswerDto: PlayerAnswerDto?
)

fun Question.toExtendedQuestionDto(
    playerAnswer: PlayerAnswer?,
    questionNumber: Int,
    totalBaseQuestions: Int
) =
    ExtendedQuestionDto(
        id = this.id,
        category = this.category,
        type = this.type,
        task = this.text,
        answers = this.answers.map { it.toAnswerDto() },
        difficultyLevel = this.difficultyLevel,
        playerAlreadyAnswered = playerAnswer != null,
        playerAnswerDto = playerAnswer?.toDto(),
        questionNumber = questionNumber,
        totalBaseQuestions = totalBaseQuestions,
    )
