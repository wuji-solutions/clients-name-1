package com.wuji.backend.config.dto

import com.wuji.backend.config.QuizConfig

typealias QuizConfigDto = GameConfigDto

fun QuizConfigDto.toQuizConfig(): QuizConfig {
    return QuizConfig(
        totalDurationMinutes = totalDurationMinutes,
        questionFilePath = questionFilePath,
        questionDurationSeconds = questionDurationSeconds,
        endImmediatelyAfterTime = endImmediatelyAfterTime)
}
