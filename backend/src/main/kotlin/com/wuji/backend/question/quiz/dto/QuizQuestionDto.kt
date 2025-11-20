package com.wuji.backend.question.quiz.dto

import com.wuji.backend.config.DifficultyLevel
import com.wuji.backend.question.common.Question
import com.wuji.backend.question.common.QuestionType
import com.wuji.backend.question.common.dto.AnswerDto
import com.wuji.backend.question.common.dto.toAnswerDto

data class QuizQuestionDto(
    val id: Int,
    val category: String,
    val type: QuestionType,
    val task: String,
    val answers: List<AnswerDto>,
    val difficultyLevel: DifficultyLevel,
    val questionNumber: Int,
    val totalQuestions: Int
)

fun Question.toQuizQuestionDto(
    questionNumber: Int,
    totalQuestions: Int
): QuizQuestionDto =
    QuizQuestionDto(
        id = this.id,
        category = this.category,
        type = this.type,
        task = this.text,
        answers = this.answers.map { it.toAnswerDto() },
        difficultyLevel = this.difficultyLevel,
        questionNumber = questionNumber,
        totalQuestions = totalQuestions)
