package com.wuji.backend.reports

import com.wuji.backend.config.GameConfig
import com.wuji.backend.game.common.AbstractGame
import com.wuji.backend.player.state.PlayerDetails
import com.wuji.backend.reports.common.Report
import java.io.File
import java.nio.file.Paths
import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter

/**
 * Reports Service used to generate reports for games
 *
 * Directory tree:
 * - Raporty
 *     - Nazwa_gry Czas_rozpoczecia
 *         - OgolnePodsumowanieGraczy.csv
 *         - SzczegolowePodsumowaniaGraczy
 *                 - Gracz1.csv
 *                     - Gracz2.csv
 *                         - ...
 *             - OgolnePodsumowaniePytan.csv
 */
class ReportsService {
    companion object {
        private const val REPORTS_DIR_NAME = "Raporty"
        const val FILE_EXTENSION = ".csv"
        private val dateTimeFormatter =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH-mm")
                .withZone(ZoneId.systemDefault())

        fun getReportsDir(): File {
            val home = System.getProperty("user.home")
            val os = System.getProperty("os.name").lowercase()

            return when {
                os.contains("win") ||
                    os.contains("mac") ||
                    os.contains("nux") ->
                    Paths.get(home, "Documents", REPORTS_DIR_NAME).toFile()
                else -> Paths.get(home).toFile()
            }
        }

        fun getGameSubdir(
            game: AbstractGame<out PlayerDetails, out GameConfig>
        ): File {
            val reportDirName =
                StringBuilder()
                    .apply {
                        append(game.name)
                        append(" ")
                        append(game.gameType.polish)
                        append(" ")
                        append(
                            dateTimeFormatter.format(
                                Instant.ofEpochMilli(game.timeOfCreationEpoch)))
                    }
                    .toString()
            val gameSubDir = File(getReportsDir(), reportDirName)
            if (!gameSubDir.exists()) {
                println("${gameSubDir.absolutePath} doesn't exist")
                gameSubDir.mkdirs()
            }
            return gameSubDir
        }
    }

    private var reportsToWrite: Set<Report> =
        setOf(
            PlayersSummaryReport, PlayerSpecificReport, QuestionsSummaryReport)

    fun setReports(reports: Set<Report>) {
        reportsToWrite = reports
    }

    fun writeReports(game: AbstractGame<out PlayerDetails, out GameConfig>) {
        reportsToWrite.forEach { report -> report.write(game) }
    }
}
