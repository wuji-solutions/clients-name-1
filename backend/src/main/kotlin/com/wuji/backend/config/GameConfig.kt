package com.wuji.backend.config

interface GameConfig {
    val questionFilePath: String
    val questionDurationSeconds: Int
}

enum class DifficultyLevel(val polish: String) {
    EASY("Łatwy"),
    MEDIUM("Średni"),
    HARD("Trudny");

    fun next(): DifficultyLevel = values().getOrNull(this.ordinal + 1) ?: HARD
}
