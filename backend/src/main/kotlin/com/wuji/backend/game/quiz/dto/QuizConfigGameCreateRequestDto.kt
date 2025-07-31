package com.wuji.backend.game.quiz.dto

import com.wuji.backend.game.common.dto.ConfigGameCreateRequestDto
import com.wuji.backend.game.common.dto.toGameConfig
import com.wuji.backend.game.quiz.QuizConfig

typealias QuizConfigGameCreateRequestDto = ConfigGameCreateRequestDto

fun QuizConfigGameCreateRequestDto.toQuizConfig(): QuizConfig {
    return this.toGameConfig()
}
