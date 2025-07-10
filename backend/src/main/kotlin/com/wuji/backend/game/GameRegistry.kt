package com.wuji.backend.game

import com.wuji.backend.game.common.AbstractGame
import com.wuji.backend.game.common.GameConfig
import com.wuji.backend.game.quiz.exception.GameNotCreatedYetException
import com.wuji.backend.player.state.PlayerDetails
import org.springframework.stereotype.Component

@Component
class GameRegistry {
    private var _game: AbstractGame<*, *>? = null
    private var _gameType: GameType? = null

    val game: AbstractGame<out PlayerDetails, out GameConfig>
        get() = _game ?: throw GameNotCreatedYetException()

    val gameType: GameType
        get() = _gameType ?: throw GameNotCreatedYetException()

    fun register(game: AbstractGame<*, *>) {
        this._game = game
        this._gameType = game.gameType
    }

    fun <T : AbstractGame<*, *>> getAs(clazz: Class<T>): T {
        return clazz.cast(game) ?: throw IllegalStateException("Game is not of expected type")
    }
}
