package com.wuji.backend.config

abstract class GameConfig {
    abstract val totalDurationMinutes: Int
    abstract val endImmediatelyAfterTime: Boolean
    abstract val questionFilePath: String
    abstract val questionDurationSeconds: Int
}

enum class DifficultyLevel {
    EASY,
    MEDIUM,
    HARD
}
