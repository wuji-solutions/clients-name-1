package com.wuji.backend.game

import com.wuji.backend.game.common.AbstractGame
import com.wuji.backend.game.common.GameConfig
import com.wuji.backend.game.common.exception.GameNotCreatedYetException
import com.wuji.backend.game.common.exception.IncorrectGameTypeException
import com.wuji.backend.game.common.exception.ReportNotCreatedYetException
import com.wuji.backend.player.state.PlayerDetails
import com.wuji.backend.reports.common.GameReport
import com.wuji.backend.reports.common.ReportRow
import org.springframework.stereotype.Component

@Component
class GameRegistry {
    private var _game: AbstractGame<out PlayerDetails, out GameConfig>? = null
    private var _gameType: GameType? = null
    private var _gameReport: GameReport<out ReportRow>? = null

    val game: AbstractGame<out PlayerDetails, out GameConfig>
        get() = _game ?: throw GameNotCreatedYetException()

    val gameType: GameType
        get() = _gameType ?: throw GameNotCreatedYetException()

    val gameReport: GameReport<out ReportRow>
        get() = _gameReport ?: throw ReportNotCreatedYetException()

    fun register(
        game: AbstractGame<out PlayerDetails, out GameConfig>,
        gameReport: GameReport<out ReportRow>
    ) {
        this._game = game
        this._gameType = game.gameType
        this._gameReport = gameReport
    }

    fun <T : AbstractGame<out PlayerDetails, out GameConfig>> getAs(
        clazz: Class<T>
    ): T {
        return clazz.cast(game)
            ?: throw IncorrectGameTypeException(gameType, clazz)
    }
}
