package com.wuji.backend.game.common

import com.wuji.backend.config.GameConfig
import com.wuji.backend.game.GameType
import com.wuji.backend.player.state.Player
import com.wuji.backend.player.state.PlayerDetails
import com.wuji.backend.player.state.exception.PlayerNotFoundException
import java.util.concurrent.CopyOnWriteArraySet

abstract class AbstractGame<DetailsT : PlayerDetails, ConfigT : GameConfig>(
    val name: String,
    val gameType: GameType,
    val config: ConfigT
) {
    var gameState: GameState = GameState.CREATED

    val players: MutableSet<Player<DetailsT>> = CopyOnWriteArraySet()

    abstract fun start()

    abstract fun pause()

    abstract fun resume()

    abstract fun finish()

    abstract fun getReport(): String

    fun findPlayerByIndex(index: Int): Player<DetailsT> {
        return players.find { player -> player.index == index }
            ?: throw PlayerNotFoundException(index).also {
                println("Player not found: $players")
            }
    }
}
