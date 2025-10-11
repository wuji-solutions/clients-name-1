package com.wuji.backend.config

data class QuizConfig(
    override val questionFilePath: String,
    override val questionDurationSeconds: Int,
) : GameConfig
