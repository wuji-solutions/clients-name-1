package com.wuji.backend.reports.common

import com.wuji.backend.game.common.AbstractGame
import com.wuji.backend.game.common.GameConfig
import com.wuji.backend.player.state.PlayerDetails

abstract class GameStats {
    companion object {
        fun countPlayersAnsweredForQuestion(
            game: AbstractGame<out PlayerDetails, out GameConfig>,
            questionId: Int
        ): Int {
            var counter = 0
            for (player in game.players) {
                if (player.details.answers.any {
                    it.question.id == questionId
                }) {
                    counter++
                }
            }
            return counter
        }
    }
}
