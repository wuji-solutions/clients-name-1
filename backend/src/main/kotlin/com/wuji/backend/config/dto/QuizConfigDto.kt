package com.wuji.backend.config.dto

import com.wuji.backend.config.QuizConfig

typealias QuizConfigDto = GameConfigDto

fun QuizConfigDto.toQuizConfig(): QuizConfig {
    return QuizConfig(
        questionFilePath = questionFilePath,
        questionDurationSeconds = questionDurationSeconds)
}

fun QuizConfig.toQuizConfigDto(): QuizConfigDto {
    return QuizConfigDto(
        questionFilePath = questionFilePath,
        questionDurationSeconds = questionDurationSeconds)
}
