package com.wuji.backend.game

import com.wuji.backend.game.common.AbstractGame
import com.wuji.backend.game.common.GameConfig
import com.wuji.backend.game.common.exception.GameNotCreatedYetException
import com.wuji.backend.game.common.exception.IncorrectGameTypeException
import com.wuji.backend.player.state.PlayerDetails
import org.springframework.stereotype.Component

@Component
class GameRegistry {
    private var _game: AbstractGame<out PlayerDetails, out GameConfig>? = null
    private var _gameType: GameType? = null

    val game: AbstractGame<out PlayerDetails, out GameConfig>
        get() = _game ?: throw GameNotCreatedYetException()

    val gameType: GameType
        get() = _gameType ?: throw GameNotCreatedYetException()

    fun register(
        game: AbstractGame<out PlayerDetails, out GameConfig>,
    ) {
        this._game = game
        this._gameType = game.gameType
    }

    fun <T : AbstractGame<out PlayerDetails, out GameConfig>> getAs(
        clazz: Class<T>
    ): T {
        return clazz.cast(game)
            ?: throw IncorrectGameTypeException(gameType, clazz)
    }
}
