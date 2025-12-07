package com.wuji.backend.dispenser

import com.wuji.backend.config.DifficultyLevel
import com.wuji.backend.dispenser.exception.CannotGoBackException
import com.wuji.backend.dispenser.exception.NoMoreQuestionsException
import com.wuji.backend.player.state.ExamPlayer
import com.wuji.backend.player.state.ExamPlayerDetails
import com.wuji.backend.question.common.Answer
import com.wuji.backend.question.common.Image
import com.wuji.backend.question.common.ImageType
import com.wuji.backend.question.common.Question
import com.wuji.backend.question.common.QuestionType
import com.wuji.backend.question.common.TextFormat
import kotlin.test.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

class ExamDispenserTest {

    private lateinit var dispenser: ExamDispenser
    private lateinit var player: ExamPlayer
    private val playerIndex = 0

    private val q1 =
        Question(
            1,
            "cat",
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
            "dog",
            QuestionType.TEXT,
            "task2",
            TextFormat.PLAIN_TEXT,
            listOf(Answer(0, "answer2")),
            setOf(0),
            DifficultyLevel.MEDIUM,
            listOf(Image("url2", ImageType.URL)),
            listOf("tag2"))

    private val q3 =
        Question(
            3,
            "mouse",
            QuestionType.TEXT,
            "task3",
            TextFormat.PLAIN_TEXT,
            listOf(Answer(0, "answer3")),
            setOf(0),
            DifficultyLevel.HARD,
            listOf(Image("url3", ImageType.URL)),
            listOf("tag3"))

    private val q4 =
        Question(
            4,
            "bird",
            QuestionType.TEXT,
            "task4",
            TextFormat.PLAIN_TEXT,
            listOf(Answer(0, "answer4")),
            setOf(0),
            DifficultyLevel.EASY,
            listOf(Image("url5", ImageType.URL)),
            listOf("tag4"))

    private val questions = listOf(q1, q2, q3, q4)

    @BeforeEach
    fun setup() {
        dispenser = ExamDispenser()
        player =
            ExamPlayer(
                playerIndex, nickname = "Bob", details = ExamPlayerDetails())
    }

    @Test
    fun `initialize should create player dispensers`() {
        dispenser.initialize(
            setOf(player),
            questions,
            requiredQuestionCount = 3,
            randomizeQuestions = false,
            enforceDifficultyBalance = false,
            withAdditionalFeedbackQuestion = false)

        assertTrue(dispenser.dispensers.containsKey(playerIndex))
        val pd = dispenser.dispensers[playerIndex]!! // NOSONAR
        assertEquals(3, pd.baseQuestions.size)
        assertEquals(1, pd.additionalQuestions.size)
    }

    @Test
    fun `initialize with selected question ids should select correct base questions`() {
        dispenser.initialize(
            setOf(player),
            questions,
            selectedQuestionIds = setOf(2, 3),
            withAdditionalFeedbackQuestion = false)

        val pd = dispenser.dispensers[playerIndex]!! // NOSONAR
        assertEquals(listOf(q2, q3), pd.baseQuestions)
        assertEquals(listOf(q1, q4), pd.additionalQuestions)
    }

    @Test
    fun `currentQuestion should return first question`() {
        dispenser.initialize(
            setOf(player),
            questions,
            3,
            randomizeQuestions = false,
            enforceDifficultyBalance = false)

        val current = dispenser.currentQuestion(playerIndex)
        assertEquals(q1, current)
    }

    @Test
    fun `nextQuestion should move forward and update current`() {
        dispenser.initialize(
            setOf(player),
            questions,
            3,
            randomizeQuestions = false,
            enforceDifficultyBalance = false)

        val first = dispenser.currentQuestion(playerIndex)
        val second = dispenser.nextQuestion(playerIndex)

        assertEquals(q2, second)
        assertEquals(q2, dispenser.currentQuestion(playerIndex))
        assertNotEquals(first, second)
    }

    @Test
    fun `previousQuestion should move backward but not below 0`() {
        dispenser.initialize(
            setOf(player),
            questions,
            3,
            randomizeQuestions = false,
            enforceDifficultyBalance = false)

        dispenser.nextQuestion(playerIndex) // q2
        dispenser.nextQuestion(playerIndex) // q3
        assertEquals(q3, dispenser.currentQuestion(playerIndex))

        val prev1 = dispenser.previousQuestion(playerIndex)
        assertEquals(q2, prev1)

        val prev2 = dispenser.previousQuestion(playerIndex)
        assertEquals(q1, prev2)

        assertFailsWith<NoMoreQuestionsException> {
            dispenser.previousQuestion(playerIndex)
        }
    }

    @Test
    fun `nextQuestion should traverse combined list and throw at the end`() {
        dispenser.initialize(
            setOf(player),
            questions,
            3,
            randomizeQuestions = false,
            enforceDifficultyBalance = false,
            withAdditionalFeedbackQuestion = false)

        // traverse all questions
        dispenser.nextQuestion(playerIndex) // q2
        dispenser.nextQuestion(playerIndex) // q3
        val fourth = dispenser.nextQuestion(playerIndex) // q4
        assertEquals(q4, fourth)

        // trying to go beyond combined list should throw
        assertFailsWith<NoMoreQuestionsException> {
            dispenser.nextQuestion(playerIndex)
        }
    }

    @Test
    fun `calling navigation on uninitialized player should throw`() {
        assertFailsWith<IndexOutOfBoundsException> {
            dispenser.currentQuestion(playerIndex)
        }
        assertFailsWith<IndexOutOfBoundsException> {
            dispenser.nextQuestion(playerIndex)
        }
        assertFailsWith<IndexOutOfBoundsException> {
            dispenser.previousQuestion(playerIndex)
        }
    }

    @Test
    fun `previousQuestion should throw CannotGoBackException when in additional section`() {
        dispenser.initialize(
            setOf(player),
            questions,
            3,
            randomizeQuestions = false,
            enforceDifficultyBalance = false)

        // move to the end of base questions (q3)
        dispenser.nextQuestion(playerIndex)
        dispenser.nextQuestion(playerIndex)
        assertEquals(q3, dispenser.currentQuestion(playerIndex))

        // move into the additional questions (q4)
        dispenser.nextQuestion(playerIndex)
        assertEquals(q4, dispenser.currentQuestion(playerIndex))

        assertFailsWith<CannotGoBackException> {
            dispenser.previousQuestion(playerIndex)
        }
    }

    @Test
    fun `previousQuestion should move backward inside base questions only`() {
        dispenser.initialize(
            setOf(player),
            questions,
            3,
            randomizeQuestions = false,
            enforceDifficultyBalance = false)

        dispenser.nextQuestion(playerIndex) // q2
        dispenser.nextQuestion(playerIndex) // q3
        assertEquals(q3, dispenser.currentQuestion(playerIndex))

        val prev1 = dispenser.previousQuestion(playerIndex)
        assertEquals(q2, prev1)
        val prev2 = dispenser.previousQuestion(playerIndex)
        assertEquals(q1, prev2)
    }
}
