package com.wuji.backend.util.ext

import com.wuji.backend.question.common.Question
import com.wuji.backend.question.common.dto.QuestionResponseDto

fun Question.toQuestionDto() =
    QuestionResponseDto(
        id = this.id,
        category = this.category,
        type = this.type,
        task = this.task,
        answers = this.answers)
