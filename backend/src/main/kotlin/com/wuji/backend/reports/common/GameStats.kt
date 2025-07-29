package com.wuji.backend.reports.common

import com.wuji.backend.game.GameConfig
import com.wuji.backend.game.common.AbstractGame
import com.wuji.backend.player.state.PlayerDetails

abstract class GameStats {
    companion object {
        fun countPlayersAnsweredForQuestion(
            game: AbstractGame<out PlayerDetails, out GameConfig>,
            questionId: Int
        ): Int =
            game.players.count { player -> player.alreadyAnswered(questionId) }
    }
}
