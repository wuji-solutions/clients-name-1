package com.wuji.backend.game.common

open class GameConfig(
    val totalDurationMinutes: Int = 0,
    val endImmediatelyAfterTime: Boolean = false,
    val questionFilePath: String = "",
    val questionDurationSeconds: Int = 0
) {
    init {
        require(totalDurationMinutes > 0) {
            "Całkowity czas na rozgrywkę musi być dodatni, a otrzymano $totalDurationMinutes"
        }
        require(questionFilePath.isNotEmpty()) {
            "Ścieżka do pliku z pytaniami musi nie być pusta"
        }
        require(questionDurationSeconds > 0) {
            "Czas na pojedynczą odpowiedź musi być dodatni, a otrzymano $questionDurationSeconds"
        }
    }
}

enum class DifficultyLevel {
    EASY,
    MEDIUM,
    HARD
}
