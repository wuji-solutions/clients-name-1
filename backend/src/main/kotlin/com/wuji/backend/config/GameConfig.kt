package com.wuji.backend.config

interface GameConfig {
    val questionFilePath: String
    val questionDurationSeconds: Int
}

enum class DifficultyLevel {
    EASY,
    MEDIUM,
    HARD;

    fun next(): DifficultyLevel = values().getOrNull(this.ordinal + 1) ?: HARD

    fun toPolish(): String =
        when (this) {
            EASY -> "Łatwy"
            MEDIUM -> "Średni"
            HARD -> "Trudny"
        }
}
