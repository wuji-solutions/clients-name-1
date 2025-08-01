package com.wuji.backend.game.quiz.dto

import com.wuji.backend.question.common.dto.AnswerDto

data class AnswerCountDto(val answer: AnswerDto, val count: Int)

data class AnswersPerQuestionDto(val answers: List<AnswerCountDto>)
