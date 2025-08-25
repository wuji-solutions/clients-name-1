package com.wuji.backend.config

interface GameConfig {
    val totalDurationMinutes: Int
    val endImmediatelyAfterTime: Boolean
    val questionFilePath: String
    val questionDurationSeconds: Int
}

enum class DifficultyLevel {
    EASY,
    MEDIUM,
    HARD;

    fun next(): DifficultyLevel = values().getOrNull(this.ordinal + 1) ?: HARD
}
