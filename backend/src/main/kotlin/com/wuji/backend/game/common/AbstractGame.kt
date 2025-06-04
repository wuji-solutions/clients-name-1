package com.wuji.backend.game.common

import com.wuji.backend.player.state.Player
import com.wuji.backend.player.state.PlayerDetails

abstract class AbstractGame<DetailsT: PlayerDetails, ConfigT : GameConfig>(
    val name: String,
    private val config: ConfigT
) {
    private val isRunning: Boolean = false
    val players: MutableList<Player<DetailsT>> = mutableListOf()

    abstract fun start()
    abstract fun stop()
    abstract fun getRaport(): String
}

open class GameConfig
