package com.wuji.backend.game.board.dto

import com.wuji.backend.game.board.CategoryName
import com.wuji.backend.game.board.MinCorrectAnswers
import com.wuji.backend.game.common.DifficultyLevel
import com.wuji.backend.game.common.dto.ConfigGameCreateRequestDto
import com.wuji.backend.security.validator.ValidBoardConfig

@ValidBoardConfig
data class BoardConfigGameCreateRequestDto(
    val pointsPerDifficulty: Map<DifficultyLevel, Int>,
    val rankingPromotionRules: Map<CategoryName, MinCorrectAnswers>,
) : ConfigGameCreateRequestDto()
