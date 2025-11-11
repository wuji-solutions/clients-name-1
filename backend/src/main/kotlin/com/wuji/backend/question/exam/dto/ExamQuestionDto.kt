package com.wuji.backend.question.exam.dto

import com.wuji.backend.config.DifficultyLevel
import com.wuji.backend.question.common.PlayerAnswer
import com.wuji.backend.question.common.Question
import com.wuji.backend.question.common.QuestionType
import com.wuji.backend.question.common.dto.AnswerDto
import com.wuji.backend.question.common.dto.PlayerAnswerDto
import com.wuji.backend.question.common.dto.toAnswerDto
import com.wuji.backend.question.common.dto.toDto

data class ExamQuestionDto(
    val id: Int,
    val category: String,
    val type: QuestionType,
    val task: String,
    val answers: List<AnswerDto>,
    val difficultyLevel: DifficultyLevel,
    val questionNumber: Int,
    val totalBaseQuestions: Int,
    val allowGoingBack: Boolean,
    val playerAlreadyAnswered: Boolean,
    val playerAnswerDto: PlayerAnswerDto?,
    val imageUrl: String?,
    val imageBase64: String?
)

fun Question.toExamQuestionDto(
    playerAnswer: PlayerAnswer?,
    questionNumber: Int,
    totalBaseQuestions: Int,
    allowGoingBack: Boolean
) =
    ExamQuestionDto(
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
        allowGoingBack = allowGoingBack,
        imageUrl = imageUrl,
        imageBase64 = imageUrl)
