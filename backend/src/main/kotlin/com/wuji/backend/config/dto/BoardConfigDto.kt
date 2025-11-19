package com.wuji.backend.config.dto

import com.fasterxml.jackson.annotation.JsonProperty
import com.wuji.backend.config.BoardConfig
import com.wuji.backend.config.CategoryName
import com.wuji.backend.config.DEFAULT_END_IMMEDIATELY_AFTER_TIME
import com.wuji.backend.config.DEFAULT_TOTAL_DURATION_MINUTES
import com.wuji.backend.config.DifficultyLevel
import com.wuji.backend.config.MinCorrectAnswers
import com.wuji.backend.security.validator.ValidBoardConfig
import jakarta.validation.constraints.Min

@ValidBoardConfig
data class BoardConfigDto(
    @field:Min(1, message = "Całkowity czas na rozgrywkę musi być dodatni")
    val totalDurationMinutes: Int = DEFAULT_TOTAL_DURATION_MINUTES,
    @JsonProperty(required = true)
    val pointsPerDifficulty: Map<DifficultyLevel, Int>,
    @JsonProperty(required = true)
    val rankingPromotionRules: Map<CategoryName, MinCorrectAnswers>,
    @JsonProperty(required = true) val showLeaderboard: Boolean,
    val endImmediatelyAfterTime: Boolean = DEFAULT_END_IMMEDIATELY_AFTER_TIME,
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
        endImmediatelyAfterTime = endImmediatelyAfterTime,
        pointsPerDifficulty = pointsPerDifficulty,
        rankingPromotionRules = rankingPromotionRules,
        showLeaderboard = showLeaderboard)
}
