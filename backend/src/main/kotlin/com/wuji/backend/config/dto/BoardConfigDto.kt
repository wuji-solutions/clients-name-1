package com.wuji.backend.config.dto

import com.fasterxml.jackson.annotation.JsonProperty
import com.wuji.backend.config.BoardConfig
import com.wuji.backend.config.CategoryName
import com.wuji.backend.config.DifficultyLevel
import com.wuji.backend.config.MinCorrectAnswers
import com.wuji.backend.security.validator.ValidBoardConfig

@ValidBoardConfig
data class BoardConfigDto(
    @JsonProperty(required = true)
    val pointsPerDifficulty: Map<DifficultyLevel, Int>,
    @JsonProperty(required = true)
    val rankingPromotionRules: Map<CategoryName, MinCorrectAnswers>,
    @JsonProperty(required = true)
    val showLeaderboard: Boolean,
    override val totalDurationMinutes: Int,
    override val questionFilePath: String,
    override val questionDurationSeconds: Int,
    override val endImmediatelyAfterTime: Boolean,
) : GameConfigDto()

fun BoardConfigDto.toBoardConfig(): BoardConfig {
    return BoardConfig(
        totalDurationMinutes = totalDurationMinutes,
        questionFilePath = questionFilePath,
        questionDurationSeconds = questionDurationSeconds,
        endImmediatelyAfterTime = endImmediatelyAfterTime,
        pointsPerDifficulty = pointsPerDifficulty,
        rankingPromotionRules = rankingPromotionRules,
        showLeaderboard = showLeaderboard)
}

fun BoardConfig.toBoardConfigDto(): BoardConfigDto {
    return BoardConfigDto(
        totalDurationMinutes = totalDurationMinutes,
        questionFilePath = questionFilePath,
        questionDurationSeconds = questionDurationSeconds,
        endImmediatelyAfterTime = endImmediatelyAfterTime,
        pointsPerDifficulty = pointsPerDifficulty,
        rankingPromotionRules = rankingPromotionRules,
        showLeaderboard = showLeaderboard)
}
