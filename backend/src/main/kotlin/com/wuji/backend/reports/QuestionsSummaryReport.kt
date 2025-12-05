package com.wuji.backend.reports

import com.wuji.backend.config.GameConfig
import com.wuji.backend.game.GameType
import com.wuji.backend.game.board.BoardGame
import com.wuji.backend.game.common.AbstractGame
import com.wuji.backend.game.exam.ExamGame
import com.wuji.backend.game.quiz.QuizGame
import com.wuji.backend.player.state.PlayerDetails
import com.wuji.backend.question.common.Question
import com.wuji.backend.reports.ReportsService.Companion.FILE_EXTENSION
import com.wuji.backend.reports.ReportsService.Companion.getGameSubdir
import com.wuji.backend.reports.common.GameStats
import com.wuji.backend.reports.common.Report
import java.io.File

object QuestionsSummaryReport : Report {
    private const val QUESTIONS_SUMMARY_REPORT_FILENAME =
        "OgolnePodsumowaniePytan$FILE_EXTENSION"

    override fun write(game: AbstractGame<out PlayerDetails, out GameConfig>) {
        val questions =
            when (game.gameType) {
                GameType.QUIZ -> (game as QuizGame).askedQuestions
                GameType.EXAM -> (game as ExamGame).questions
                GameType.BOARD -> (game as BoardGame).questions
            }
        return writeUsingQuestions(questions, game)
    }

    fun writeUsingQuestions(
        questions: List<Question>,
        game: AbstractGame<out PlayerDetails, out GameConfig>
    ) {
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

        val file = File(getGameSubdir(game), QUESTIONS_SUMMARY_REPORT_FILENAME)
        file.createNewFile()

        getWriter().open(file) {
            writeRow(rowNames)
            questions.forEach { question ->
                val (correctCount, incorrectCount) =
                    GameStats.countCorrectIncorrectAnswers(game, question.id)
                val correctAnswersPerc =
                    if (correctCount + incorrectCount > 0)
                        correctCount.toDouble() /
                            (correctCount + incorrectCount).toDouble() * 100f
                    else 0f
                writeRow(
                    listOf(
                        question.id,
                        question.category,
                        question.text,
                        question.type.polish,
                        question.difficultyLevel.polish,
                        correctCount,
                        incorrectCount,
                        "%.2f".format(correctAnswersPerc)))
            }
        }
    }
}
