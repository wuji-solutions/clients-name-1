package com.wuji.backend.reports

import com.wuji.backend.config.GameConfig
import com.wuji.backend.game.common.AbstractGame
import com.wuji.backend.player.state.Player
import com.wuji.backend.player.state.PlayerDetails
import com.wuji.backend.reports.ReportsService.Companion.FILE_EXTENSION
import com.wuji.backend.reports.ReportsService.Companion.getGameSubdir
import com.wuji.backend.reports.common.Report
import java.io.File

object PlayerSpecificReport : Report {
    private const val PLAYER_REPORTS_DIR_NAME = "SzczegolowePodsumowaniaGraczy"

    fun getPlayersReportsSubdir(
        game: AbstractGame<out PlayerDetails, out GameConfig>
    ): File {
        val playerReportsSubdir =
            File(getGameSubdir(game), PLAYER_REPORTS_DIR_NAME)
        if (!playerReportsSubdir.exists()) playerReportsSubdir.mkdirs()
        return playerReportsSubdir
    }

    override fun write(game: AbstractGame<out PlayerDetails, out GameConfig>) =
        game.players.forEach { player -> writePlayer(player, game) }

    fun writePlayer(
        player: Player<out PlayerDetails>,
        game: AbstractGame<out PlayerDetails, out GameConfig>
    ) {
        val rowNames =
            listOf(
                "ID Pytania",
                "Treść pytania",
                "Wybrane odpowiedzi",
                "Czy to poprawna odpowiedź?")

        val fileName =
            StringBuilder()
                .apply {
                    append(player.index)
                    append(" ")
                    append(player.nickname)
                    append(FILE_EXTENSION)
                }
                .toString()
        val file = File(getPlayersReportsSubdir(game), fileName)
        file.createNewFile()

        getWriter().open(file) {
            writeRow(rowNames)

            player.details.answers.forEach { answer ->
                writeRow(
                    listOf(
                        answer.question.id,
                        answer.question.text,
                        answer.selectedIds,
                        answer.isCorrect))
            }
        }
    }
}
