package com.wuji.backend.config

data class BoardConfig(
    override val totalDurationMinutes: Int,
    override val endImmediatelyAfterTime: Boolean,
    override val questionFilePath: String,
    override val questionDurationSeconds: Int,
    val pointsPerDifficulty: Map<DifficultyLevel, Int>,
    val rankingPromotionRules: Map<CategoryName, MinCorrectAnswers>
) : GameConfig

typealias CategoryName = String

typealias MinCorrectAnswers = Int
