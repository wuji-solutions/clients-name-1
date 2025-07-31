package com.wuji.backend.game.common

import com.wuji.backend.config.GameConfig
import com.wuji.backend.game.GameType
import com.wuji.backend.player.state.Player
import com.wuji.backend.player.state.PlayerDetails

abstract class AbstractGame<DetailsT : PlayerDetails, ConfigT : GameConfig>(
    val name: String,
    val gameType: GameType,
    protected val config: ConfigT
) {
    var gameState: GameState = GameState.CREATED

    val players: MutableSet<Player<DetailsT>> = mutableSetOf()

    abstract fun start()

    abstract fun pause()

    abstract fun resume()

    abstract fun finish()

    abstract fun getReport(): String
}
