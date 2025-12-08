package com.wuji.backend.config

data class BoardConfig(
    val totalDurationMinutes: Int,
    val endImmediatelyAfterTime: Boolean,
    override val questionFilePath: String,
    override val questionDurationSeconds: Int,
    val pointsPerDifficulty: Map<DifficultyLevel, Int>,
    val rankingPromotionRules: Map<CategoryName, MinCorrectAnswers>,
    val showLeaderboard: Boolean,
    val numberOfTiles: Int,
) : GameConfig

typealias CategoryName = String

typealias MinCorrectAnswers = Int
