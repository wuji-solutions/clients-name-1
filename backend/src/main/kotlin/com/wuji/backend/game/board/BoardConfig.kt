package com.wuji.backend.game.board

import com.wuji.backend.game.common.DifficultyLevel
import com.wuji.backend.game.common.GameConfig

data class BoardConfig(
    val pointsPerDifficulty: Map<DifficultyLevel, Int>,
    val rankingPromotionRules: Map<CategoryName, MinCorrectAnswers>,
) : GameConfig()

typealias CategoryName = String

typealias MinCorrectAnswers = Int
