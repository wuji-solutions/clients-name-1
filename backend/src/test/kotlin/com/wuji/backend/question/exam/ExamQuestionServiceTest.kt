package com.wuji.backend.question.exam

import com.wuji.backend.config.DifficultyLevel
import com.wuji.backend.dispenser.ExamDispenser
import com.wuji.backend.events.exam.SSEExamService
import com.wuji.backend.game.GameRegistry
import com.wuji.backend.game.exam.ExamGame
import com.wuji.backend.player.state.ExamPlayer
import com.wuji.backend.player.state.ExamPlayerDetails
import com.wuji.backend.question.common.Answer
import com.wuji.backend.question.common.Image
import com.wuji.backend.question.common.ImageType
import com.wuji.backend.question.common.PlayerAnswer
import com.wuji.backend.question.common.Question
import com.wuji.backend.question.common.QuestionType
import com.wuji.backend.question.common.TextFormat
import io.mockk.*
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlin.test.assertNotNull
import kotlin.test.assertTrue
import org.junit.jupiter.api.*

class ExamQuestionServiceTest {

    private lateinit var gameRegistry: GameRegistry
    private lateinit var sseExamService: SSEExamService
    private lateinit var examGame: ExamGame
    private lateinit var questionService: ExamQuestionService

    private lateinit var player: ExamPlayer
    private lateinit var details: ExamPlayerDetails

    private val question1 =
        Question(
            1,
            "cat",
            QuestionType.TEXT,
            "task",
            TextFormat.PLAIN_TEXT,
            listOf(Answer(0, "answer")),
            setOf(0),
            DifficultyLevel.MEDIUM,
            listOf(Image("url1", ImageType.URL)),
            listOf("tag1", "tag1"),
        )
    private val question2 =
        Question(
            2,
            "cat2",
            QuestionType.TEXT,
            "task",
            TextFormat.PLAIN_TEXT,
            listOf(Answer(1, "answer")),
            setOf(0),
            DifficultyLevel.MEDIUM,
            listOf(Image("url1", ImageType.URL)),
            listOf("tag1", "tag1"),
        )
    private val playerAnswer1 =
        PlayerAnswer(
            question1,
            setOf(0),
            answerTimeInMilliseconds = 100,
            cheated = false)

    @BeforeEach
    fun setup() {
        gameRegistry = mockk()
        sseExamService = mockk(relaxed = true)
        examGame = mockk(relaxed = true)
        details = ExamPlayerDetails().apply { answers.add(playerAnswer1) }
        player =
            mockk(relaxed = true) {
                every { details } returns this@ExamQuestionServiceTest.details
            }

        every { gameRegistry.getAs(ExamGame::class.java) } returns examGame
        every { examGame.findPlayerByIndex(0) } returns player

        questionService =
            spyk(ExamQuestionService(gameRegistry, sseExamService))
    }

    @Test
    fun `getAnswers should return player's answers`() {
        val result = questionService.getAnswers(0)
        assertEquals(1, result.size)
        assertEquals(question1.id, result.first().question.id)
    }

    @Test
    fun `getCurrentQuestion should call game questionDispenser currentQuestion`() {
        val dispenser = mockk<ExamDispenser>()
        every { examGame.questionDispenser } returns dispenser
        every { dispenser.currentQuestion(0) } returns question1

        val result = questionService.getCurrentQuestion(0)

        assertEquals(question1, result)
        verify { dispenser.currentQuestion(0) }
    }

    @Test
    fun `getNextQuestion should move to and return next question`() {
        val dispenser = mockk<ExamDispenser>()
        every { examGame.questionDispenser } returns dispenser
        every { dispenser.nextQuestion(0) } returns question2

        val result = questionService.getNextQuestion(0)

        assertEquals(question2, result)
        verify { dispenser.nextQuestion(0) }
    }

    @Test
    fun `getPreviousQuestion should return previous question when allowed`() {
        val dispenser = mockk<ExamDispenser>()
        every { examGame.questionDispenser } returns dispenser
        every { dispenser.previousQuestion(0) } returns question1
        every { examGame.config.allowGoingBack } returns true

        val result = questionService.getPreviousQuestion(0)

        assertEquals(question1, result)
        verify { dispenser.previousQuestion(0) }
    }

    @Test
    fun `getPreviousQuestion should throw when not allowed`() {
        every { examGame.config.allowGoingBack } returns false

        assertFailsWith<IllegalStateException> {
            questionService.getPreviousQuestion(0)
        }
    }

    @Test
    fun `getQuestionAndMarkTime should set firstGetCurrentQuestionTime only once`() {
        val getFunc: (Int) -> Question = { question1 }

        val (question, playerAnswer) =
            questionService.getQuestionAndMarkTime(0, getFunc)

        assertEquals(question1, question)
        assertNotNull(details.firstGetCurrentQuestionTime)
        assertEquals(playerAnswer1, playerAnswer)

        // calling again shouldn’t reset the time
        val savedTime = details.firstGetCurrentQuestionTime
        questionService.getQuestionAndMarkTime(0, getFunc)
        assertEquals(savedTime, details.firstGetCurrentQuestionTime)
    }

    @Test
    fun `answerExamQuestion should throw if player has not fetched question before`() {
        every { examGame.questionDispenser.currentQuestion(0) } returns
            question1

        assertFailsWith<IllegalStateException> {
            questionService.answerExamQuestion(
                0, setOf(1), playerCheated = false)
        }
    }

    @Test
    fun `answerExamQuestion should add points for correct non-cheating answer`() {
        every { examGame.questionDispenser.currentQuestion(0) } returns
            question1
        details.firstGetCurrentQuestionTime = System.currentTimeMillis() - 1000
        every {
            examGame.config.pointsPerDifficulty.getValue(
                question1.difficultyLevel)
        } returns 10
        every { examGame.config.markQuestionOnCheating } returns false
        every { examGame.config.zeroPointsOnCheating } returns false
        every { examGame.config.notifyTeacherOnCheating } returns false

        every {
            questionService.answerQuestionWithOverwrite(
                player, question1, any(), any(), any())
        } returns true

        val result =
            questionService.answerExamQuestion(
                0, setOf(1), playerCheated = false)

        assertTrue(result)
        assertEquals(
            10,
            details.points(
                examGame.config.pointsPerDifficulty,
                examGame.config.zeroPointsOnCheating))
        verify { sseExamService.sendNewExamStateEvent(examGame) }
    }

    @Test
    fun `answerExamQuestion should notify teacher if cheating`() {
        every { examGame.questionDispenser.currentQuestion(0) } returns
            question1
        details.firstGetCurrentQuestionTime = System.currentTimeMillis() - 500
        every { examGame.config.markQuestionOnCheating } returns true
        every { examGame.config.notifyTeacherOnCheating } returns true
        every { examGame.config.zeroPointsOnCheating } returns true
        every { examGame.config.pointsPerDifficulty.getValue(any()) } returns 5

        every {
            questionService.answerQuestionWithOverwrite(
                player, question1, any(), any(), any())
        } returns true

        questionService.answerExamQuestion(0, setOf(1), playerCheated = true)

        verify { sseExamService.sendPlayerCheatedEvent(player, question1) }
        verify { sseExamService.sendNewExamStateEvent(examGame) }
    }

    @Test
    fun `answerExamQuestion should not award points if player cheated and zeroPointsOnCheating is true`() {
        details.answers.clear()
        every { examGame.findPlayerByIndex(0) } returns player
        every { examGame.questionDispenser.currentQuestion(0) } returns
            question1
        every { examGame.config.markQuestionOnCheating } returns true
        every { examGame.config.zeroPointsOnCheating } returns true
        every { examGame.config.notifyTeacherOnCheating } returns true
        every { examGame.config.pointsPerDifficulty } returns
            mapOf(DifficultyLevel.MEDIUM to 10)

        questionService.getQuestionAndMarkTime(playerIndex = 0) { playerIndex ->
            question1
        }
        val result =
            questionService.answerExamQuestion(
                playerIndex = 0, answerIds = setOf(0), playerCheated = true)

        // Assert
        assertTrue(result, "Answer should be marked correct")
        assertEquals(
            0,
            player.details.points(
                examGame.config.pointsPerDifficulty,
                examGame.config.zeroPointsOnCheating),
            "Player should not get points due to zeroPointsOnCheating")
        assertEquals(
            null,
            player.details.firstGetCurrentQuestionTime,
            "Time should be reset after answering")
        verify { sseExamService.sendPlayerCheatedEvent(player, question1) }
        verify { sseExamService.sendNewExamStateEvent(examGame) }
    }

    @Test
    fun `answerExamQuestion additional question should not be saved in player's answers`() {
        every { questionService.getCurrentQuestionNumber(0) } returns 2
        every { questionService.getBaseQuestionsSize(0) } returns 1

        val additionalQuestion =
            Question(
                10,
                "extraQuestion",
                QuestionType.TEXT,
                "taskExtra",
                TextFormat.PLAIN_TEXT,
                listOf(Answer(0, "answer")),
                setOf(0),
                DifficultyLevel.MEDIUM,
                listOf(Image("url1", ImageType.URL)),
                listOf("tag"))

        every { examGame.questionDispenser.currentQuestion(0) } returns
            additionalQuestion

        val initialAnswerCount = player.details.answers.size

        questionService.getQuestionAndMarkTime(
            0, questionService::getCurrentQuestion)
        questionService.answerExamQuestion(0, setOf(0), playerCheated = false)

        assertEquals(initialAnswerCount, player.details.answers.size)
    }

    @Test
    fun `answerExamQuestion additional question should return true without modifying points`() {
        every { questionService.getCurrentQuestionNumber(0) } returns 2
        every { questionService.getBaseQuestionsSize(0) } returns 1

        every {
            examGame.config.pointsPerDifficulty.getValue(
                question1.difficultyLevel)
        } returns 10
        every { examGame.config.markQuestionOnCheating } returns false
        every { examGame.config.zeroPointsOnCheating } returns false
        every { examGame.config.notifyTeacherOnCheating } returns false
        val additionalQuestion =
            Question(
                5,
                "extra3",
                QuestionType.TEXT,
                "taskExtra3",
                TextFormat.PLAIN_TEXT,
                listOf(Answer(0, "answer")),
                setOf(0),
                DifficultyLevel.HARD,
                listOf(Image("url1", ImageType.URL)),
                listOf("tag"))

        every { examGame.questionDispenser.currentQuestion(0) } returns
            additionalQuestion

        questionService.getQuestionAndMarkTime(
            0, questionService::getCurrentQuestion)
        val result =
            questionService.answerExamQuestion(
                0, setOf(0), playerCheated = false)

        assertTrue(result)
        assertEquals(
            10,
            player.details.points(
                examGame.config.pointsPerDifficulty,
                examGame.config.zeroPointsOnCheating)) // points unchanged
    }
}
