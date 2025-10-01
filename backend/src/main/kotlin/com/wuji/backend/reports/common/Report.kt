package com.wuji.backend.reports.common

import com.wuji.backend.config.GameConfig
import com.wuji.backend.game.common.AbstractGame
import com.wuji.backend.player.state.PlayerDetails

fun interface Report {
    fun write(game: AbstractGame<out PlayerDetails, out GameConfig>)
}
