package com.wuji.backend.configuration

import com.wuji.backend.game.quiz.QuizGame
import com.wuji.backend.game.quiz.QuizGameConfig
import com.wuji.backend.question.common.Answer
import com.wuji.backend.question.common.Question
import com.wuji.backend.question.common.QuestionType
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class TestConfig {

    @Bean
    fun getListOfQuestions(): List<Question> {
        return listOf(
            Question(
                id = 1,
                category = "Matematyka",
                type = QuestionType.TEXT,
                task = "2 + 2 =",
                answers = listOf(
                    Answer(0, "1"),
                    Answer(1, "4"),
                    Answer(2, "7"),
                    Answer(3, "15")
                ),
                correctAnswerId = 1
            ),
            Question(
                id = 2,
                category = "Matematyka",
                type = QuestionType.TEXT,
                task = "5 * 3 =",
                answers = listOf(
                    Answer(0, "15"),
                    Answer(1, "8"),
                    Answer(2, "53"),
                    Answer(3, "10")
                ),
                correctAnswerId = 0
            ),
            Question(
                id = 3,
                category = "Matematyka",
                type = QuestionType.TEXT,
                task = "9 - 4 =",
                answers = listOf(
                    Answer(0, "13"),
                    Answer(1, "5"),
                    Answer(2, "6"),
                    Answer(3, "4")
                ),
                correctAnswerId = 1
            ),
            Question(
                id = 4,
                category = "Matematyka",
                type = QuestionType.TEXT,
                task = "12 / 4 =",
                answers = listOf(
                    Answer(0, "3"),
                    Answer(1, "4"),
                    Answer(2, "6"),
                    Answer(3, "2")
                ),
                correctAnswerId = 0
            ),
            Question(
                id = 5,
                category = "Matematyka",
                type = QuestionType.TEXT,
                task = "Ile to jest 10 + 15?",
                answers = listOf(
                    Answer(0, "20"),
                    Answer(1, "30"),
                    Answer(2, "25"),
                    Answer(3, "15")
                ),
                correctAnswerId = 2
            ),
            Question(
                id = 6,
                category = "Matematyka",
                type = QuestionType.TEXT,
                task = "Ile to jest 6 * 6?",
                answers = listOf(
                    Answer(0, "36"),
                    Answer(1, "30"),
                    Answer(2, "26"),
                    Answer(3, "42")
                ),
                correctAnswerId = 0
            ),
            Question(
                id = 7,
                category = "Matematyka",
                type = QuestionType.TEXT,
                task = "Jaki jest wynik działania: 100 - 75?",
                answers = listOf(
                    Answer(0, "25"),
                    Answer(1, "15"),
                    Answer(2, "35"),
                    Answer(3, "20")
                ),
                correctAnswerId = 0
            ),
            Question(
                id = 8,
                category = "Logika dziecięca",
                type = QuestionType.TEXT,
                task = "Jeśli mam 2 jabłka i dostanę 3, ile będę mieć?",
                answers = listOf(
                    Answer(0, "4"),
                    Answer(1, "5"),
                    Answer(2, "2"),
                    Answer(3, "6")
                ),
                correctAnswerId = 1
            ),
            Question(
                id = 9,
                category = "Logika dziecięca",
                type = QuestionType.TEXT,
                task = "Która liczba jest większa: 18 czy 21?",
                answers = listOf(
                    Answer(0, "18"),
                    Answer(1, "21"),
                    Answer(2, "Są równe"),
                    Answer(3, "Nie da się określić")
                ),
                correctAnswerId = 1
            ),
            Question(
                id = 10,
                category = "Geometria",
                type = QuestionType.TEXT,
                task = "Ile boków ma kwadrat?",
                answers = listOf(
                    Answer(0, "3"),
                    Answer(1, "4"),
                    Answer(2, "5"),
                    Answer(3, "6")
                ),
                correctAnswerId = 1
            )
        )

    }

    @Bean
    fun getQuizGameConfig(): QuizGameConfig = QuizGameConfig(10)

    @Bean
    fun getQuizGame(config: QuizGameConfig, questions: List<Question>): QuizGame =
        QuizGame("Quiz Game 123", config, questions)
}
