package com.wuji.backend.game.exam

import com.wuji.backend.game.common.DifficultyLevel
import com.wuji.backend.game.common.GameConfig

data class ExamConfig(
    val requiredQuestionCount: Int,
    val randomizeQuestions: Boolean,
    val enforceDifficultyBalance: Boolean,
    val selectedQuestionIds: List<Int> = emptyList(),
    val zeroPointsOnCheating: Boolean,
    val markQuestionOnCheating: Boolean,
    val notifyTeacherOnCheating: Boolean,
    val pointsPerDifficulty: Map<DifficultyLevel, Int>,
    val allowGoingBack: Boolean,
) : GameConfig() {
    init {
        require(randomizeQuestions || selectedQuestionIds.isNotEmpty()) {
            "Lista wybranych pytań musi być podana, jeśli losowe pytania nie są ustawione"
        }

        require(!randomizeQuestions || selectedQuestionIds.isEmpty()) {
            "Lista wybranych pytań musi być pusta, jeśli losowe pytania są ustawione"
        }

        require(requiredQuestionCount > 0) {
            "Liczba wymaganych pytań do odpowiedzenia musi być dodatnia"
        }
    }
}
