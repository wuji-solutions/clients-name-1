package com.wuji.backend.configuration

import com.wuji.backend.game.common.Answer
import com.wuji.backend.game.common.Question
import com.wuji.backend.game.common.QuestionType
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class TestConfig {

    @Bean
    fun getListOfQuestions(): List<Question> {
        return listOf(
            Question(
                QuestionType.TEXT, "2 + 2 =",
                listOf(
                    Answer(0, "1"),
                    Answer(1, "4"),
                    Answer(2, "7"),
                    Answer(3, "15")
                ), 1
            ),
            Question(
                QuestionType.TEXT, "5 * 3 =",
                listOf(
                    Answer(0, "15"),
                    Answer(1, "8"),
                    Answer(2, "53"),
                    Answer(3, "10")
                ), 0
            ),
            Question(
                QuestionType.TEXT, "9 - 4 =",
                listOf(
                    Answer(0, "13"),
                    Answer(1, "5"),
                    Answer(2, "6"),
                    Answer(3, "4")
                ), 1
            ),
            Question(
                QuestionType.TEXT, "12 / 4 =",
                listOf(
                    Answer(0, "3"),
                    Answer(1, "4"),
                    Answer(2, "6"),
                    Answer(3, "2")
                ), 0
            ),
            Question(
                QuestionType.TEXT, "Ile to jest 10 + 15?",
                listOf(
                    Answer(0, "20"),
                    Answer(1, "30"),
                    Answer(2, "25"),
                    Answer(3, "15")
                ), 2
            ),
            Question(
                QuestionType.TEXT, "Ile to jest 6 * 6?",
                listOf(
                    Answer(0, "36"),
                    Answer(1, "30"),
                    Answer(2, "26"),
                    Answer(3, "42")
                ), 0
            ),
            Question(
                QuestionType.TEXT, "Jaki jest wynik działania: 100 - 75?",
                listOf(
                    Answer(0, "25"),
                    Answer(1, "15"),
                    Answer(2, "35"),
                    Answer(3, "20")
                ), 0
            ),
            Question(
                QuestionType.TEXT, "Jeśli mam 2 jabłka i dostanę 3, ile będę mieć?",
                listOf(
                    Answer(0, "4"),
                    Answer(1, "5"),
                    Answer(2, "2"),
                    Answer(3, "6")
                ), 1
            ),
            Question(
                QuestionType.TEXT, "Która liczba jest większa: 18 czy 21?",
                listOf(
                    Answer(0, "18"),
                    Answer(1, "21"),
                    Answer(2, "Są równe"),
                    Answer(3, "Nie da się określić")
                ), 1
            ),
            Question(
                QuestionType.TEXT, "Ile boków ma kwadrat?",
                listOf(
                    Answer(0, "3"),
                    Answer(1, "4"),
                    Answer(2, "5"),
                    Answer(3, "6")
                ), 1
            )
        )
    }
}
