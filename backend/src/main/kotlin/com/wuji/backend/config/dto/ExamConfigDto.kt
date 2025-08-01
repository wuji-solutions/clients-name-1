package com.wuji.backend.config.dto

import com.wuji.backend.config.DifficultyLevel
import com.wuji.backend.config.ExamConfig
import com.wuji.backend.security.validator.ValidExamConfig
import jakarta.validation.constraints.Min

@ValidExamConfig
data class ExamConfigDto(
    @field:Min(
        1,
        message = "Liczba wymaganych pytań do odpowiedzenia musi być dodatnia")
    val requiredQuestionCount: Int,
    val randomizeQuestions: Boolean,
    val enforceDifficultyBalance: Boolean,
    val selectedQuestionIds: List<Int> = emptyList(),
    val zeroPointsOnCheating: Boolean,
    val markQuestionOnCheating: Boolean,
    val notifyTeacherOnCheating: Boolean,
    val pointsPerDifficulty: Map<DifficultyLevel, Int>,
    val allowGoingBack: Boolean,
) : GameConfigDto()

fun ExamConfigDto.toExamConfig(): ExamConfig {
    return ExamConfig(
        totalDurationMinutes = totalDurationMinutes,
        questionFilePath = questionFilePath,
        questionDurationSeconds = questionDurationSeconds,
        endImmediatelyAfterTime = endImmediatelyAfterTime,
        requiredQuestionCount = requiredQuestionCount,
        randomizeQuestions = randomizeQuestions,
        enforceDifficultyBalance = enforceDifficultyBalance,
        selectedQuestionIds = selectedQuestionIds,
        zeroPointsOnCheating = zeroPointsOnCheating,
        markQuestionOnCheating = markQuestionOnCheating,
        notifyTeacherOnCheating = notifyTeacherOnCheating,
        pointsPerDifficulty = pointsPerDifficulty,
        allowGoingBack = allowGoingBack,
    )
}
