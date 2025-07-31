package com.wuji.backend.game.exam.dto

import com.wuji.backend.game.common.DifficultyLevel
import com.wuji.backend.game.common.dto.ConfigGameCreateRequestDto
import com.wuji.backend.game.exam.ExamConfig
import com.wuji.backend.security.validator.ValidExamConfig
import jakarta.validation.constraints.Min

@ValidExamConfig
data class ExamConfigGameCreateRequestDto(
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
) : ConfigGameCreateRequestDto()

fun ExamConfigGameCreateRequestDto.toExamConfig(): ExamConfig {
    return ExamConfig(
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
