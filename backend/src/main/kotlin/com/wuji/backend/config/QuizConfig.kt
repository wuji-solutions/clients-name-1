package com.wuji.backend.config

data class QuizConfig(
    override val totalDurationMinutes: Int,
    override val endImmediatelyAfterTime: Boolean,
    override val questionFilePath: String,
    override val questionDurationSeconds: Int,
) : GameConfig()
