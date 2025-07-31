package com.wuji.backend.game.common

import com.wuji.backend.game.common.GameConfigDefaults.DEFAULT_END_IMMEDIATELY_AFTER_TIME
import com.wuji.backend.game.common.GameConfigDefaults.DEFAULT_QUESTION_DURATION_SECONDS
import com.wuji.backend.game.common.GameConfigDefaults.DEFAULT_QUESTION_FILE_PATH
import com.wuji.backend.game.common.GameConfigDefaults.DEFAULT_TOTAL_DURATION_MINUTES

open class GameConfig(
    val totalDurationMinutes: Int = DEFAULT_TOTAL_DURATION_MINUTES,
    val endImmediatelyAfterTime: Boolean = DEFAULT_END_IMMEDIATELY_AFTER_TIME,
    val questionFilePath: String = DEFAULT_QUESTION_FILE_PATH,
    val questionDurationSeconds: Int = DEFAULT_QUESTION_DURATION_SECONDS
)

enum class DifficultyLevel {
    EASY,
    MEDIUM,
    HARD
}
