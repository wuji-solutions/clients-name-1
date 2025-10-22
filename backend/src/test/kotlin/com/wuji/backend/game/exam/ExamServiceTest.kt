package com.wuji.backend.game.exam

import com.wuji.backend.config.DifficultyLevel
import com.wuji.backend.config.ExamConfig
import com.wuji.backend.events.common.SSEEventService
import com.wuji.backend.events.common.SSEUsersService
import com.wuji.backend.game.GameRegistry
import com.wuji.backend.game.common.GameState
import com.wuji.backend.game.exam.dto.CompleteExamResponseDto
import com.wuji.backend.player.state.ExamPlayer
import com.wuji.backend.player.state.ExamPlayerDetails
import com.wuji.backend.player.state.PlayerService
import com.wuji.backend.player.state.exception.PlayerNotFoundException
import com.wuji.backend.question.common.Answer
import com.wuji.backend.question.common.PlayerAnswer
import com.wuji.backend.question.common.Question
import com.wuji.backend.question.common.QuestionType
import com.wuji.backend.question.common.TextFormat
import com.wuji.backend.question.common.dto.DetailedPlayerAnswerDto
import com.wuji.backend.question.exam.ExamQuestionService
import io.mockk.*
import java.io.FileNotFoundException
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertNull
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows

class ExamServiceTest {

    private val gameRegistry = mockk<GameRegistry>(relaxed = true)
    private val playerService = mockk<PlayerService>(relaxed = true)
    private val sseUsersService = mockk<SSEUsersService>(relaxed = true)
    private val sseEventService = mockk<SSEEventService>(relaxed = true)
    private val examQuestionService = mockk<ExamQuestionService>(relaxed = true)

    private val examGame =
        spyk(
            ExamGame(
                name = "test-game",
                config = mockk(relaxed = true),
                questions = emptyList()))

    private lateinit var service: ExamService

    private val question1 =
        Question(
            1,
            "cat",
            QuestionType.TEXT,
            "task",
            TextFormat.PLAIN_TEXT,
            listOf(Answer(0, "answer")),
            setOf(0),
            DifficultyLevel.EASY,
            "imageUrl",
            "imageBase64",
            listOf("tag1", "tag1"),
        )

    @BeforeEach
    fun setup() {
        every { gameRegistry.getAs(ExamGame::class.java) } returns examGame
        service =
            ExamService(
                gameRegistry,
                playerService,
                sseUsersService,
                sseEventService,
                examQuestionService)
    }

    @Test
    fun `createGame should throw when file does not exist`() {
        val path = "nonexistent.xml"
        val config = mockk<ExamConfig>()

        assertThrows<FileNotFoundException> {
            service.createGame("Test", config, path)
        }
    }

    @Test
    fun `startGame should start game and send event`() {
        every { examGame.start() } just Runs

        service.startGame()

        verify { examGame.start() }
        verify { sseEventService.sendGameStart() }
    }

    @Test
    fun `pauseGame should pause game`() {
        every { examGame.pause() } just Runs

        service.pauseGame()

        verify { examGame.pause() }
    }

    @Test
    fun `resumeGame should resume game`() {
        every { examGame.resume() } just Runs

        service.resumeGame()

        verify { examGame.resume() }
    }

    @Test
    fun `finishGame should finish game when state is RUNNING`() {
        examGame.gameState = GameState.RUNNING
        every {
            examGame.config.additionalTimeToAnswerAfterFinishInSeconds
        } returns 0

        service.finishGame()
        Thread.sleep(50) // allow thread to run

        assert(examGame.gameState == GameState.FINISHED)
        verify { sseEventService.sendGameFinish() }
    }

    @Test
    fun `finishGame should finish game immediately when not running`() {
        examGame.gameState = GameState.PAUSED

        service.finishGame()

        verify { sseEventService.sendGameFinish() }
    }

    @Test
    fun `hasJoined should return true if player found`() {
        every { examGame.findPlayerByIndex(1) } returns mockk()
        assert(service.hasJoined(1, "test"))
    }

    @Test
    fun `hasJoined should return false if player not found`() {
        every { examGame.findPlayerByIndex(1) } throws
            PlayerNotFoundException(1)
        assert(!service.hasJoined(1, "test"))
    }

    @Test
    fun `getTimeUntilFinish should return correct time until finish`() {
        val now = System.currentTimeMillis()
        every { examGame.plannedFinishTimeEpoch } returns
            now + 65000 // 1 min 5 sec

        val dto = service.getTimeUntilFinish()
        assert(dto.minutes in 1..1)
        assert(dto.seconds in 0..10)
    }

    @Test
    fun `completeAttempt should return total points only when feedback disabled`() {
        val player = mockk<ExamPlayer>()
        val details = mockk<ExamPlayerDetails>()
        val playerIndex = 1

        every { examGame.findPlayerByIndex(playerIndex) } returns player
        every { player.details } returns details

        every { examGame.config.showDetailedFinishFeedback } returns false
        every { examGame.config.pointsPerDifficulty } returns
            mapOf(DifficultyLevel.EASY to 1)
        every { examGame.config.zeroPointsOnCheating } returns false

        every { details.points(any(), any()) } returns 42

        val result: CompleteExamResponseDto =
            service.completeAttempt(playerIndex)

        verify { examQuestionService.getNextQuestion(playerIndex) }
        assertEquals(42, result.totalPointsEarned)
        assertNull(result.questionsAnswered)
    }

    @Test
    fun `completeAttempt should include detailed feedback when enabled`() {
        val player = mockk<ExamPlayer>()
        val playerIndex = 1

        val playerAnswer =
            PlayerAnswer(
                question = question1,
                selectedIds = question1.correctAnswerIds,
                answerTimeInMilliseconds = 1000,
                cheated = false)

        val details =
            mockk<ExamPlayerDetails> {
                every { answers } returns mutableListOf(playerAnswer)
            }

        every { examGame.findPlayerByIndex(playerIndex) } returns player
        every { player.details } returns details
        every { details.points(any(), any()) } returns 50
        every { details.answers } returns mutableListOf(playerAnswer)

        every { examGame.config.showDetailedFinishFeedback } returns true
        every { examGame.config.pointsPerDifficulty } returns
            mapOf(DifficultyLevel.EASY to 1)
        every { examGame.config.zeroPointsOnCheating } returns false

        val result: CompleteExamResponseDto =
            service.completeAttempt(playerIndex)
        val questionsAnswered = result.questionsAnswered!!

        verify { examQuestionService.getNextQuestion(playerIndex) }
        assertEquals(50, result.totalPointsEarned)
        assertNotNull(questionsAnswered)
        assertEquals(1, questionsAnswered.size)

        val feedback: DetailedPlayerAnswerDto = questionsAnswered.first()
        assertEquals(1, feedback.pointsEarned)
        assertEquals(true, feedback.isCorrect)
    }
}
