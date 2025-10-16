package com.wuji.backend.admin.dto

import com.wuji.backend.question.common.Question
import com.wuji.backend.question.common.dto.QuestionDto

data class ParsedQuestionsInfo(
    val categories: List<String>,
    val numOfQuestions: Int,
    val questions: List<QuestionDto>
)
