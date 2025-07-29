package com.wuji.backend.game

open class GameConfig

data class CommonConfig(
    val totalDurationMinutes: Int,
    val endImmediatelyAfterTime: Boolean,
    val questionFilePath: String,
    val questionDurationSeconds: Int
)

data class ExamConfig(
    val commonConfig: CommonConfig,
    val requiredQuestionCount: Int,
    val randomizeQuestions: Boolean,
    val enforceDifficultyBalance: Boolean,
    val selectedQuestionIds: List<String>?,
    val cheatingPolicy: CheatingPolicy,
    val pointsPerDifficulty: Map<DifficultyLevel, Int>,
    val allowGoingBack: Boolean
) : GameConfig() {
    init {
        require(randomizeQuestions || selectedQuestionIds != null) {
            "Lista selectedQuestionIds musi być podana, jeśli randomizeQuestions jest ustawione na false"
        }

        require(!randomizeQuestions || selectedQuestionIds == null) {
            "Lista selectedQuestionIds musi być pusta (null), jeśli randomizeQuestions jest ustawione na true"
        }
    }
}

data class CheatingPolicy(
    val commonConfig: CommonConfig,
    val zeroPointsOnCheating: Boolean,
    val markQuestionOnCheating: Boolean,
    val notifyTeacherOnCheating: Boolean
) : GameConfig()

enum class DifficultyLevel {
    EASY,
    MEDIUM,
    HARD
}

data class BoardConfig(
    val commonConfig: CommonConfig,
    val pointsPerDifficulty: Map<DifficultyLevel, Int>,
    val rankingPromotionRules:
        Map<String, Int>, // category -> how many good answers for a promotion
) : GameConfig()

data class QuizConfig(
    val commonConfig: CommonConfig,
) : GameConfig()
