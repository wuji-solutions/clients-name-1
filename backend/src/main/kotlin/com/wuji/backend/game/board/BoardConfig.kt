package com.wuji.backend.game.board

import com.wuji.backend.game.common.DifficultyLevel
import com.wuji.backend.game.common.GameConfig

data class BoardConfig(
    val pointsPerDifficulty: Map<DifficultyLevel, Int>,
    val rankingPromotionRules:
        Map<String, Int>, // category -> how many good answers for a promotion
) : GameConfig()
