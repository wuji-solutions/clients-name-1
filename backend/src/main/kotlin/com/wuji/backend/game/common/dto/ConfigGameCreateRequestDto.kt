package com.wuji.backend.game.common.dto

import com.wuji.backend.game.common.GameConfig
import com.wuji.backend.game.common.GameConfigDefaults.DEFAULT_END_IMMEDIATELY_AFTER_TIME
import com.wuji.backend.game.common.GameConfigDefaults.DEFAULT_QUESTION_DURATION_SECONDS
import com.wuji.backend.game.common.GameConfigDefaults.DEFAULT_QUESTION_FILE_PATH
import com.wuji.backend.game.common.GameConfigDefaults.DEFAULT_TOTAL_DURATION_MINUTES
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank

open class ConfigGameCreateRequestDto(
    @field:Min(1, message = "Całkowity czas na rozgrywkę musi być dodatni")
    val totalDurationMinutes: Int = DEFAULT_TOTAL_DURATION_MINUTES,
    @field:NotBlank(message = "Ścieżka do pliku z pytaniami nie może być pusta")
    val questionFilePath: String = DEFAULT_QUESTION_FILE_PATH,
    @field:Min(1, message = "Czas na pojedynczą odpowiedź musi być dodatni")
    val questionDurationSeconds: Int = DEFAULT_QUESTION_DURATION_SECONDS,
    val endImmediatelyAfterTime: Boolean = DEFAULT_END_IMMEDIATELY_AFTER_TIME,
)

fun ConfigGameCreateRequestDto.toGameConfig(): GameConfig {
    return GameConfig(
        totalDurationMinutes = totalDurationMinutes,
        endImmediatelyAfterTime = endImmediatelyAfterTime,
        questionFilePath = questionFilePath,
        questionDurationSeconds = questionDurationSeconds)
}
