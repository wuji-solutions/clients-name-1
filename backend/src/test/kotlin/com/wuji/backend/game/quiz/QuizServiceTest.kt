package com.wuji.backend.game.quiz

import com.wuji.backend.config.DifficultyLevel
import com.wuji.backend.config.QuizConfig
import com.wuji.backend.events.common.SSEEventService
import com.wuji.backend.events.common.SSEUsersService
import com.wuji.backend.game.GameRegistry
import com.wuji.backend.game.GameType
import com.wuji.backend.player.dto.PlayerDto
import com.wuji.backend.player.dto.PlayerDto.Companion.toDto
import com.wuji.backend.player.state.PlayerService
import com.wuji.backend.player.state.QuizPlayer
import com.wuji.backend.player.state.exception.PlayerNotFoundException
import com.wuji.backend.question.common.Answer
import com.wuji.backend.question.common.PlayerAnswer
import com.wuji.backend.question.common.Question
import com.wuji.backend.question.common.QuestionType
import com.wuji.backend.reports.common.GameStats
import io.mockk.*
import kotlin.test.Test
import kotlin.test.assertEquals
import org.junit.jupiter.api.BeforeEach

class QuizServiceTest {

    private val gameRegistry = mockk<GameRegistry>(relaxed = true)
    private val playerService = mockk<PlayerService>(relaxed = true)
    private val sseUsersService = mockk<SSEUsersService>(relaxed = true)
    private val sseEventService = mockk<SSEEventService>(relaxed = true)

    private lateinit var quizService: QuizService
    private lateinit var quizGame: QuizGame

    @BeforeEach
    fun setup() {
        quizGame = mockk {
            every { players } returns mutableSetOf()
            every { askedQuestions } returns mutableListOf()
        }

        quizService =
            QuizService(
                gameRegistry, playerService, sseUsersService, sseEventService)

        every { gameRegistry.getAs(QuizGame::class.java) } returns quizGame
        every { gameRegistry.game } returns quizGame
    }

    @Test
    fun `joinGame should create player, add to game and send players event`() {
        val playerNickname = "Alice"
        val playerIndex = 420
        val player =
            mockk<QuizPlayer> {
                every { nickname } returns playerNickname
                every { index } returns playerIndex
            }
        val playerDto = PlayerDto(playerIndex, playerNickname)

        every { playerService.createPlayer(any(), any(), any()) } returns player
        every { quizGame.findPlayerByIndex(any()) } throws
            PlayerNotFoundException(playerIndex)

        quizService.joinGame(playerIndex, playerNickname)

        verify { playerService.createPlayer(playerIndex, playerNickname, any()) }
        verify { sseUsersService.sendPlayers(match { it.contains(playerDto) }) }
        assert(player in quizGame.players)
    }

    @Test
    fun `listPlayers should return mapped player DTOs`() {
        val player =
            mockk<QuizPlayer> {
                every { nickname } returns "John"
                every { index } returns 420
            }

        every { quizGame.players } returns mutableSetOf(player)

        val dto = player.toDto()

        val result = quizService.listPlayers()

        assertEquals(listOf(dto), result)
    }

    @Test
    fun `createGame should register a new quiz game`() {
        val config = mockk<QuizConfig>()
        val resource =
            this::class.java.getResource("/sample_moodle_xml_1.xml")!!.path

        quizService.createGame("test", config, resource)

        verify {
            gameRegistry.register(
                match { it.name == "test" && it.gameType == GameType.QUIZ })
        }
    }

    @Test
    fun `startGame should start quiz and send SSE`() {
        every { quizGame.start() } just Runs

        quizService.startGame()

        verify {
            quizGame.start()
            sseEventService.sendGameStart()
        }
    }

    @Test
    fun `pauseGame should pause quiz`() {
        every { quizGame.pause() } just Runs

        quizService.pauseGame()

        verify { quizGame.pause() }
    }

    @Test
    fun `resumeGame should resume quiz`() {
        every { quizGame.resume() } just Runs

        quizService.resumeGame()

        verify { quizGame.resume() }
    }

    @Test
    fun `finishGame should finish quiz and send SSE`() {
        every { quizGame.finish() } just Runs

        quizService.finishGame()

        verify {
            quizGame.finish()
            sseEventService.sendGameFinish()
        }
    }

    @Test
    fun `getGameSummary should return questions with correct and incorrect counts`() {
        val answer =
            mockk<Answer> {
                every { id } returns 1
                every { text } returns "content"
            }

        val question =
            mockk<Question> {
                every { id } returns 1
                every { category } returns "category"
                every { type } returns QuestionType.TEXT
                every { text } returns "task"
                every { answers } returns listOf(answer)
                every { correctAnswerIds } returns mutableSetOf(answer.id)
                every { difficultyLevel } returns DifficultyLevel.EASY
            }

        val player = mockk<QuizPlayer>()
        every { player.alreadyAnswered(question.id) } returns true

        val playerAnswer = mockk<PlayerAnswer>()
        every { player.answerForQuestion(question.id) } returns playerAnswer

        every { quizGame.players } returns mutableSetOf(player)
        every { quizGame.askedQuestions } returns mutableListOf(question)

        mockkObject(GameStats)
        every { GameStats.countCorrectIncorrectAnswers(any(), any()) } returns
            Pair(5, 3)

        val dto = quizService.getGameSummary()

        assertEquals(1, dto.questions.size)
        assertEquals(5, dto.questions[0].correctAnswersCount)
        assertEquals(3, dto.questions[0].incorrectAnswersCount)

        unmockkObject(GameStats)
    }
}
