package com.wuji.backend.config.dto

import com.wuji.backend.config.BoardConfig
import com.wuji.backend.config.CategoryName
import com.wuji.backend.config.DifficultyLevel
import com.wuji.backend.config.MinCorrectAnswers
import com.wuji.backend.security.validator.ValidBoardConfig

@ValidBoardConfig
data class BoardConfigDto(
    val pointsPerDifficulty: Map<DifficultyLevel, Int>,
    val rankingPromotionRules: Map<CategoryName, MinCorrectAnswers>,
) : GameConfigDto()

fun BoardConfigDto.toBoardConfig(): BoardConfig {
    return BoardConfig(
        totalDurationMinutes = totalDurationMinutes,
        questionFilePath = questionFilePath,
        questionDurationSeconds = questionDurationSeconds,
        endImmediatelyAfterTime = endImmediatelyAfterTime,
        pointsPerDifficulty = pointsPerDifficulty,
        rankingPromotionRules = rankingPromotionRules
    )
}