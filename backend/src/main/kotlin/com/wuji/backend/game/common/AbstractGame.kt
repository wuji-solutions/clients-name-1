package com.wuji.backend.game.common

import com.wuji.backend.game.GameType
import com.wuji.backend.player.state.Player
import com.wuji.backend.player.state.PlayerDetails

abstract class AbstractGame<DetailsT : PlayerDetails, ConfigT : GameConfig>(
    val name: String,
    val gameType: GameType,
    private val config: ConfigT
) {
    var isRunning: Boolean = false
    var isFinished: Boolean = false

    // TODO: Add constraint to make sure its impossible for isRunning = true && isFinished = true
    val players: MutableSet<Player<DetailsT>> = mutableSetOf()

    abstract fun start()
    abstract fun pause()
    abstract fun resume()
    abstract fun stop()
    abstract fun getRaport(): String
}

open class GameConfig
