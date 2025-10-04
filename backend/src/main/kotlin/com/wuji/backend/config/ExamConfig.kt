package com.wuji.backend.config

data class ExamConfig(
    val totalDurationMinutes: Int,
    val endImmediatelyAfterTime: Boolean,
    override val questionFilePath: String,
    override val questionDurationSeconds: Int,
    val requiredQuestionCount: Int,
    val randomizeQuestions: Boolean,
    val enforceDifficultyBalance: Boolean,
    val selectedQuestionIds: List<Int> = emptyList(),
    val zeroPointsOnCheating: Boolean,
    val markQuestionOnCheating: Boolean,
    val notifyTeacherOnCheating: Boolean,
    val pointsPerDifficulty: Map<DifficultyLevel, Int>,
    val allowGoingBack: Boolean,
    val additionalTimeToAnswerAfterFinishInSeconds: Long = 10
) : GameConfig
