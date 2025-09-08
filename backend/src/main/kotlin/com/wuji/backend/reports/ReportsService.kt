package com.wuji.backend.reports

import com.github.doyaaaaaken.kotlincsv.dsl.csvWriter
import com.wuji.backend.config.GameConfig
import com.wuji.backend.game.common.AbstractGame
import com.wuji.backend.player.state.PlayerDetails
import com.wuji.backend.reports.common.GameStats
import com.wuji.backend.reports.common.GameStats.Companion.countIncorrectAnswersForGame
import java.io.File
import java.nio.file.Paths

object ReportsService {
    fun getDocumentsDir(): String {
        val home = System.getProperty("user.home")
        val os = System.getProperty("os.name").lowercase()

        return when {
            os.contains("win") -> Paths.get(home, "Documents").toString()
            os.contains("mac") -> Paths.get(home, "Documents").toString()
            os.contains("nux") -> Paths.get(home, "Documents").toString()
            else -> home
        }
    }

    fun writePlayerSummaryReport(
        game: AbstractGame<out PlayerDetails, out GameConfig>
    ) {
        val players = game.players
        val rowNames =
            listOf(
                "Pseudonim",
                "Czas gry [s]",
                "Liczba prawidłowych odpowiedzi",
                "Liczba nieprawidłowych odpowiedzi")
        csvWriter().open(File(getDocumentsDir(), game.name)) {
            writeRow(rowNames)
            players.forEach { player ->
                {
                    writeRow(
                        listOf(
                            player.nickname,
                            player.details.timeTookInSeconds,
                            GameStats.countCorrectAnswersForGame(
                                game, player.index),
                            countIncorrectAnswersForGame(game, player.index)))
                }
            }
        }
    }
}
