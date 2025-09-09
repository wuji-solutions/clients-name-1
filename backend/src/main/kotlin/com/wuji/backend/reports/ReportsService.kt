package com.wuji.backend.reports

import com.github.doyaaaaaken.kotlincsv.dsl.csvWriter
import com.wuji.backend.config.GameConfig
import com.wuji.backend.game.GameType
import com.wuji.backend.game.common.AbstractGame
import com.wuji.backend.game.quiz.QuizGame
import com.wuji.backend.player.state.PlayerDetails
import com.wuji.backend.reports.common.GameStats
import java.io.File
import java.nio.file.Paths
import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter

/**
 * Reports Service used to generate reports based for games
 *
 * Directory tree:
 *  - Raporty
 *      - OgolnePodsumowanieGraczy.csv
 *      - SzczegolowePodsumowaniaGraczy
 *          - Gracz1.csv
 *          - Gracz2.csv
 *          - ...
 *      - OgolnePodsumowaniePytan.csv
 */
object ReportsService {
    private val FILE_EXTENSION = ".csv"
    private val REPORTS_DIRECTORY = "Raporty"
    private val PLAYERS_SUMMARY_REPORT_FILENAME = "OgolnePodsumowanieGraczy.csv"
    private val QUESTIONS_SUMMARY_REPORT_FILENAME =
        "Ogolne PodsumowaniePytan.csv"
    private val dateTimeFormatter =
        DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")
            .withZone(ZoneId.systemDefault())

    fun getReportsDir(): File {
        val home = System.getProperty("user.home")
        val os = System.getProperty("os.name").lowercase()

        return when {
            os.contains("win") || os.contains("mac") || os.contains("nux") ->
                Paths.get(home, "Documents", REPORTS_DIRECTORY).toFile()
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
                    append(
                        dateTimeFormatter.format(
                            Instant.ofEpochMilli(game.timeOfCreationEpoch)))
                    append(FILE_EXTENSION)
                }
                .toString()
        val gameSubDir = File(getReportsDir(), reportDirName)
        if (!gameSubDir.exists()) gameSubDir.mkdirs()
        return gameSubDir
    }

    fun writeAllReports(game: AbstractGame<out PlayerDetails, out GameConfig>) {
        writePlayersSummaryReport(game)
        writeQuestionsSummaryReport(game)
    }

    fun writePlayersSummaryReport(
        game: AbstractGame<out PlayerDetails, out GameConfig>
    ) {
        val players = game.players

        val rowNames =
            listOf(
                "Pseudonim",
                "Czas spędzony odpowiadając na pytania [s]",
                "Liczba prawidłowych odpowiedzi",
                "Liczba nieprawidłowych odpowiedzi",
                "Procent poprawnych odpowiedzi [%]")

        csvWriter().open(
            File(getGameSubdir(game), PLAYERS_SUMMARY_REPORT_FILENAME)) {
                writeRow(rowNames)
                players.forEach { player ->
                    val correctCount =
                        GameStats.countCorrectAnswersForPlayer(
                            game, player.index)
                    val incorrectCount =
                        GameStats.countIncorrectAnswersForPlayer(
                            game, player.index)

                    writeRow(
                        listOf(
                            player.nickname,
                            "%.2f"
                                .format(
                                    GameStats.sumTotalAnswerTimeInMillis(
                                        game, player.index) / 1000),
                            correctCount,
                            incorrectCount,
                            "%.2f"
                                .format(
                                    correctCount /
                                        (correctCount + incorrectCount) * 100)))
                }
            }
    }

    fun writeQuestionsSummaryReport(
        game: AbstractGame<out PlayerDetails, out GameConfig>
    ) {
        return when (game.gameType) {
            GameType.QUIZ -> writeQuestionsSummaryReport(game as QuizGame)
            GameType.EXAM -> TODO()
            GameType.BOARD -> TODO()
        }
    }

    fun writeQuestionsSummaryReport(game: QuizGame) {
        val questions = game.askedQuestions.toList()
        val rowNames =
            listOf(
                "ID Pytania",
                "Kategoria pytania",
                "Treść pytania",
                "Typ pytania",
                "Trudność pytania",
                "Liczba prawidłowych odpowiedzi",
                "Liczba nieprawidłowych odpowiedzi",
                "Procent poprawnych odpowiedzi [%]")

        csvWriter().open(
            File(getGameSubdir(game), QUESTIONS_SUMMARY_REPORT_FILENAME)) {
                writeRow(rowNames)
                questions.forEach { question ->
                    val (correctCount, incorrectCount) =
                        GameStats.countCorrectIncorrectAnswers(
                            game, question.id)
                    writeRow(
                        listOf(
                            question.id,
                            question.category,
                            question.task,
                            question.type.toPolish(),
                            question.difficultyLevel.toPolish(),
                            correctCount,
                            incorrectCount,
                            "%.2f"
                                .format(
                                    correctCount /
                                        (correctCount + incorrectCount) * 100)))
                }
            }
    }
}
