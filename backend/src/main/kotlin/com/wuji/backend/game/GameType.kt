package com.wuji.backend.game

import com.wuji.backend.config.GameConfig
import com.wuji.backend.game.common.AbstractGame
import com.wuji.backend.game.quiz.QuizGame
import com.wuji.backend.player.state.PlayerDetails

enum class GameType {
    QUIZ,
    EXAM,
    BOARD;

    fun gameClass():
        Class<out AbstractGame<out PlayerDetails, out GameConfig>> {
        return when (this) {
            QUIZ -> QuizGame::class.java
            EXAM -> TODO()
            BOARD -> TODO()
        }
    }
}
