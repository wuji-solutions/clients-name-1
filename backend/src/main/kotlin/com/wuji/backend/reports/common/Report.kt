package com.wuji.backend.reports.common

import com.github.doyaaaaaken.kotlincsv.client.CsvWriter
import com.github.doyaaaaaken.kotlincsv.dsl.csvWriter
import com.wuji.backend.config.GameConfig
import com.wuji.backend.game.common.AbstractGame
import com.wuji.backend.player.state.PlayerDetails

interface Report {
    fun write(game: AbstractGame<out PlayerDetails, out GameConfig>)

    fun getWriter(): CsvWriter = csvWriter {
        delimiter = ';'
        charset = "Windows-1250"
    }
}
