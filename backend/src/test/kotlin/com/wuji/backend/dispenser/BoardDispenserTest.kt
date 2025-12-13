package com.wuji.backend.dispenser

import com.wuji.backend.config.DifficultyLevel
import com.wuji.backend.dispenser.exception.NoMoreQuestionsException
import com.wuji.backend.question.common.Answer
import com.wuji.backend.question.common.Image
import com.wuji.backend.question.common.ImageType
import com.wuji.backend.question.common.Question
import com.wuji.backend.question.common.QuestionType
import com.wuji.backend.question.common.TextFormat
import kotlin.test.assertContains
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

class BoardDispenserTest {

    private val catA = "A"
    private val catB = "B"

    private val q1 =
        Question(
            1,
            catA,
            QuestionType.TEXT,
            "task1",
            TextFormat.PLAIN_TEXT,
            listOf(Answer(0, "answer1")),
            setOf(0),
            DifficultyLevel.EASY,
            listOf(Image("url1", ImageType.URL)),
            listOf("tag1"))

    private val q2 =
        Question(
            2,
            catA,
            QuestionType.TEXT,
            "task2",
            TextFormat.PLAIN_TEXT,
            listOf(Answer(0, "answer2")),
            setOf(0),
            DifficultyLevel.EASY,
            listOf(Image("url2", ImageType.URL)),
            listOf("tag2"))

    private val q3 =
        Question(
            3,
            catA,
            QuestionType.TEXT,
            "task3",
            TextFormat.PLAIN_TEXT,
            listOf(Answer(0, "answer3")),
            setOf(0),
            DifficultyLevel.MEDIUM,
            listOf(Image("url3", ImageType.URL)),
            listOf("tag3"))

    private val q4 =
        Question(
            4,
            catB,
            QuestionType.TEXT,
            "task4",
            TextFormat.PLAIN_TEXT,
            listOf(Answer(0, "answer4")),
            setOf(0),
            DifficultyLevel.EASY,
            listOf(Image("url5", ImageType.URL)),
            listOf("tag4"))

    private val q5 =
        Question(
            5,
            catB,
            QuestionType.TEXT,
            "task4",
            TextFormat.PLAIN_TEXT,
            listOf(Answer(0, "answer4")),
            setOf(0),
            DifficultyLevel.MEDIUM,
            listOf(Image("url5", ImageType.URL)),
            listOf("tag4"))

    private lateinit var dispenser: BoardDispenser

    @BeforeEach
    fun setup() {
        dispenser =
            BoardDispenser(
                categories = listOf(catA, catB),
                questions = listOf(q1, q2, q3, q4, q5))
    }

    @Test
    fun `should return question matching category and difficulty`() {
        val result =
            dispenser.getQuestion(catA, DifficultyLevel.EASY, emptySet())

        assertContains(setOf(q1, q2), result)
    }

    @Test
    fun `should not return previously used questions`() {
        val prev = setOf(q1)

        val result = dispenser.getQuestion(catA, DifficultyLevel.EASY, prev)

        assertEquals(q2, result)
    }

    @Test
    fun `should fallback to any unanswered question in category when none match difficulty`() {
        val prev = setOf(q1, q2) // all EASY used

        val result = dispenser.getQuestion(catA, DifficultyLevel.EASY, prev)

        assertEquals(q3, result) // fallback to MEDIUM
    }

    @Test
    fun `should choose question from another category when category is exhausted`() {
        // Exhaust category A
        val prev = setOf(q1, q2, q3)

        val result = dispenser.getQuestion(catA, DifficultyLevel.EASY, prev)

        assertContains(setOf(q4, q5), result)
    }

    @Test
    fun `should throw NoMoreQuestionsException when all questions are exhausted`() {
        val prev = setOf(q1, q2, q3, q4, q5)

        assertThrows(NoMoreQuestionsException::class.java) {
            dispenser.getQuestion(catA, DifficultyLevel.EASY, prev)
        }
    }

    @Test
    fun `should throw when category does not exist`() {
        val missingCategory = "UNKNOWN"

        val ex =
            assertThrows(IllegalArgumentException::class.java) {
                dispenser.getQuestion(
                    missingCategory, DifficultyLevel.EASY, emptySet())
            }

        assertTrue(ex.message!!.contains("Nieznana kategoria"))
    }
}
