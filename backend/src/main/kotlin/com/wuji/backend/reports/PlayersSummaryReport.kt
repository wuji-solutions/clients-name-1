package com.wuji.backend.reports

import com.wuji.backend.config.GameConfig
import com.wuji.backend.game.common.AbstractGame
import com.wuji.backend.player.state.PlayerDetails
import com.wuji.backend.reports.ReportsService.Companion.FILE_EXTENSION
import com.wuji.backend.reports.ReportsService.Companion.getGameSubdir
import com.wuji.backend.reports.common.GameStats
import com.wuji.backend.reports.common.Report
import java.io.File

object PlayersSummaryReport : Report {
    private const val PLAYERS_SUMMARY_REPORT_FILENAME =
        "OgolnePodsumowanieGraczy$FILE_EXTENSION"

    override fun write(game: AbstractGame<out PlayerDetails, out GameConfig>) {
        val players = game.players

        val rowNames =
            listOf(
                "Indeks",
                "Pseudonim",
                "Czas spędzony odpowiadając na pytania [s]",
                "Liczba prawidłowych odpowiedzi",
                "Liczba nieprawidłowych odpowiedzi",
                "Procent poprawnych odpowiedzi [%]")
        val file = File(getGameSubdir(game), PLAYERS_SUMMARY_REPORT_FILENAME)
        file.createNewFile()
        getWriter().open(file) {
            writeRow(rowNames)
            players.forEach { player ->
                val correctCount =
                    GameStats.countCorrectAnswersForPlayer(game, player.index)
                val incorrectCount =
                    GameStats.countIncorrectAnswersForPlayer(game, player.index)
                val correctAnswersPerc =
                    if (correctCount + incorrectCount > 0)
                        correctCount.toDouble() /
                            (correctCount + incorrectCount).toDouble() * 100f
                    else 0f

                writeRow(
                    listOf(
                        player.index,
                        player.nickname,
                        "%.2f"
                            .format(
                                GameStats.sumTotalAnswerTimeInMillis(
                                    game, player.index) / 1000f),
                        correctCount,
                        incorrectCount,
                        "%.2f".format(correctAnswersPerc)))
            }
        }
    }
}
