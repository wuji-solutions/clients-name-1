package com.wuji.backend.question.common.dto

data class AnswerCountDto(val answer: AnswerDto, val count: Int)

data class AnswersPerQuestionDto(val answers: List<AnswerCountDto>)
