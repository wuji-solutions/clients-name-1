package com.wuji.backend.question.board

import com.wuji.backend.config.DifficultyLevel
import com.wuji.backend.dispenser.BoardDispenser
import com.wuji.backend.events.board.SSEBoardService
import com.wuji.backend.game.GameRegistry
import com.wuji.backend.game.board.BoardGame
import com.wuji.backend.player.state.BoardPlayer
import com.wuji.backend.question.common.Answer
import com.wuji.backend.question.common.PlayerAnswer
import com.wuji.backend.question.common.Question
import com.wuji.backend.question.common.QuestionType
import com.wuji.backend.question.common.TextFormat
import io.mockk.*
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows

class BoardQuestionServiceTest {

    private lateinit var gameRegistry: GameRegistry
    private lateinit var boardGame: BoardGame
    private lateinit var sseBoardService: SSEBoardService
    private lateinit var questionDispenser: BoardDispenser
    private lateinit var service: BoardQuestionService
    private lateinit var player: BoardPlayer
    private lateinit var question: Question

    @BeforeEach
    fun setup() {
        gameRegistry = mockk()
        boardGame = mockk(relaxed = true)
        questionDispenser = mockk()
        player = mockk(relaxed = true)
        sseBoardService = mockk(relaxed = true)

        every { gameRegistry.getAs(BoardGame::class.java) } returns boardGame
        every { boardGame.questionDispenser } returns questionDispenser

        service = BoardQuestionService(gameRegistry, sseBoardService)
        question =
            Question(
                1,
                "cat",
                QuestionType.TEXT,
                "task",
                TextFormat.PLAIN_TEXT,
                listOf(Answer(0, "answer")),
                setOf(0),
                DifficultyLevel.MEDIUM,
                "imageUrl",
                "imageBase64",
                listOf("tag1", "tag1"),
            )
    }

    @Test
    fun `getAnswers should return player's answers`() {
        val answers = mutableListOf(PlayerAnswer(question, setOf(0), 0, false))

        every { player.details.answers } returns answers
        every { boardGame.findPlayerByIndex(0) } returns player

        val result = service.getAnswers(0)

        assertEquals(answers, result)
    }

    @Test
    fun `getQuestion should fetch question from dispenser`() {
        every { boardGame.findPlayerByIndex(0) } returns player

        every { player.details.currentQuestion } returns null
        every { player.details.currentTileIndex } returns 5
        every { boardGame.tiles[5].category } returns question.category
        every {
            player.details.categoryToDifficulty.getValue(question.category)
        } returns question.difficultyLevel
        every { player.details.askedQuestions } returns mutableListOf()

        every {
            questionDispenser.getQuestion(
                question.category, question.difficultyLevel, emptySet())
        } returns question

        val result = service.getQuestion(0)

        assertEquals(question, result)

        // verify dispenser was called once
        verify(exactly = 1) {
            questionDispenser.getQuestion(
                question.category, question.difficultyLevel, emptySet())
        }
    }

    @Test
    fun `answerBoardQuestion should add question to askedQuestions and return result`() {
        service =
            spyk(
                BoardQuestionService(gameRegistry, sseBoardService),
                recordPrivateCalls = true)

        val answers = setOf(0)

        every { service.getQuestion(0) } returns question
        every { boardGame.findPlayerByIndex(0) } returns player
        every { player.details.askedQuestions.add(question) } returns true
        every {
            service.answerQuestion(player, question, answers, any())
        } returns true
        every { boardGame.getTop5Players() } returns listOf(player)
        every {
            boardGame.config.pointsPerDifficulty.getValue(
                question.difficultyLevel)
        } returns 3
        justRun { service.checkForDifficultyPromotion(0) }

        val result = service.answerBoardQuestion(player.index, answers)

        assertTrue(result)
        verify { player.details.askedQuestions.add(question) }
        verify { service.checkForDifficultyPromotion(0) }
    }

    @Test
    fun `checkForDifficultyPromotion should promote difficulty when threshold reached`() {
        service =
            spyk(
                BoardQuestionService(gameRegistry, sseBoardService),
                recordPrivateCalls = true)

        val promotionRules = mapOf(question.category to 2)

        every { service.getQuestion(0) } returns question
        every { boardGame.findPlayerByIndex(0) } returns player
        every { boardGame.config.rankingPromotionRules } returns promotionRules
        every { player.details.answers } returns
            mutableListOf(
                PlayerAnswer(question, setOf(0), 0, false),
                PlayerAnswer(question, setOf(0), 0, false))
        every { player.details.categoryToDifficulty } returns
            mutableMapOf(question.category to question.difficultyLevel)

        service.checkForDifficultyPromotion(0)

        assertEquals(
            question.difficultyLevel.next(),
            player.details.categoryToDifficulty[question.category])
    }

    @Test
    fun `answerBoardQuestion should send leaderboard event if player enters top5 by points`() {
        service =
            spyk(
                BoardQuestionService(gameRegistry, sseBoardService),
                recordPrivateCalls = true)

        val answers = setOf(0)
        every { service.getQuestion(0) } returns question
        every { boardGame.findPlayerByIndex(0) } returns player
        every { player.details.askedQuestions.add(question) } returns true
        every {
            service.answerQuestion(player, question, answers, any())
        } returns true
        justRun { service.checkForDifficultyPromotion(0) }

        every { boardGame.config.pointsPerDifficulty } returns
            mapOf(question.difficultyLevel to 20)
        every { boardGame.config.showLeaderboard } returns true

        val mutablePointsMap = mutableMapOf<Int, Int>()
        every { player.details.pointsMap } returns mutablePointsMap
        every { player.details.points() } answers
            {
                mutablePointsMap.values.sum()
            }

        val otherPlayer = mockk<BoardPlayer>(relaxed = true)
        every { otherPlayer.details.points() } returns 10

        // min points = 10, so after scoring 20 player enters top 5
        every { boardGame.getTop5Players() } returns listOf(otherPlayer)

        every { sseBoardService.sendNewLeaderboardStateEvent(any()) } just Runs

        val result = service.answerBoardQuestion(0, answers)

        assertTrue(result)
        assertTrue(mutablePointsMap.values.sum() >= 20)
        verify { sseBoardService.sendNewLeaderboardStateEvent(any()) }
    }

    @Test
    fun `answerBoardQuestion should send leaderboard event if fewer than 5 players exist`() {
        service =
            spyk(
                BoardQuestionService(gameRegistry, sseBoardService),
                recordPrivateCalls = true)

        val answers = setOf(0)
        every { service.getQuestion(0) } returns question
        every { boardGame.findPlayerByIndex(0) } returns player
        every { player.details.askedQuestions.add(question) } returns true
        every {
            service.answerQuestion(player, question, answers, any())
        } returns true
        justRun { service.checkForDifficultyPromotion(0) }

        every { boardGame.config.pointsPerDifficulty } returns
            mapOf(question.difficultyLevel to 5)
        every { boardGame.config.showLeaderboard } returns true

        val mutablePointsMap = mutableMapOf<Int, Int>()
        every { player.details.pointsMap } returns mutablePointsMap
        every { player.details.points() } answers
            {
                mutablePointsMap.values.sum()
            }

        // only 2 players → size < 5 triggers event
        val p1 = mockk<BoardPlayer>(relaxed = true)
        val p2 = mockk<BoardPlayer>(relaxed = true)
        every { p1.details.points() } returns 100
        every { p2.details.points() } returns 50
        every { boardGame.getTop5Players() } returns listOf(p1, p2)

        every { sseBoardService.sendNewLeaderboardStateEvent(any()) } just Runs

        val result = service.answerBoardQuestion(0, answers)

        assertTrue(result)
        verify { sseBoardService.sendNewLeaderboardStateEvent(any()) }
    }

    @Test
    fun `answerBoardQuestion should not send leaderboard event if below threshold and 5 or more players exist`() {
        service =
            spyk(
                BoardQuestionService(gameRegistry, sseBoardService),
                recordPrivateCalls = true)

        val answers = setOf(0)
        every { service.getQuestion(0) } returns question
        every { boardGame.findPlayerByIndex(0) } returns player
        every { player.details.askedQuestions.add(question) } returns true
        every {
            service.answerQuestion(player, question, answers, any())
        } returns true
        justRun { service.checkForDifficultyPromotion(0) }

        every { boardGame.config.pointsPerDifficulty } returns
            mapOf(question.difficultyLevel to 5)

        val mutablePointsMap = mutableMapOf<Int, Int>()
        every { player.details.pointsMap } returns mutablePointsMap
        every { player.details.points() } answers
            {
                mutablePointsMap.values.sum()
            }

        // 5 players with points higher than player
        val players =
            List(5) {
                mockk<BoardPlayer>(relaxed = true).apply {
                    every { details.points() } returns 100
                }
            }
        every { boardGame.getTop5Players() } returns players

        every { sseBoardService.sendNewLeaderboardStateEvent(any()) } just Runs

        val result = service.answerBoardQuestion(0, answers)

        assertTrue(result)
        assertEquals(5, player.details.points())
        verify(exactly = 0) {
            sseBoardService.sendNewLeaderboardStateEvent(any())
        }
    }

    @Test
    fun `calling getQuestion multiple times should return the first question returned`() {
        // arrange
        every { boardGame.findPlayerByIndex(0) } returns player

        // make currentQuestion stateful so setter changes getter result
        var mutableCurrentQuestion: Question? = null
        every { player.details.currentQuestion } answers
            {
                mutableCurrentQuestion
            }
        every { player.details.currentQuestion = any() } answers
            {
                mutableCurrentQuestion = it.invocation.args[0] as Question?
            }

        every { player.details.currentTileIndex } returns 5
        every { boardGame.tiles[5].category } returns question.category
        every {
            player.details.categoryToDifficulty.getValue(question.category)
        } returns question.difficultyLevel
        every { player.details.askedQuestions } returns mutableListOf()

        every {
            questionDispenser.getQuestion(
                question.category, question.difficultyLevel, emptySet())
        } returns question

        // act
        val first = service.getQuestion(0)
        val second = service.getQuestion(0)

        // assert
        assertEquals(question, first)
        assertEquals(first, second)

        // ensure dispenser was only used once (cached on player.details.currentQuestion)
        verify(exactly = 1) {
            questionDispenser.getQuestion(
                question.category, question.difficultyLevel, emptySet())
        }
    }

    @Test
    fun `answerBoardQuestion should reset currentQuestion and firstGetCurrentQuestionTime`() {
        service =
            spyk(
                BoardQuestionService(gameRegistry, sseBoardService),
                recordPrivateCalls = true)

        val answers = setOf(0)

        every { service.getQuestion(0) } returns question
        every { boardGame.findPlayerByIndex(0) } returns player
        every { player.details.askedQuestions.add(question) } returns true
        every {
            service.answerQuestion(player, question, answers, any())
        } returns true
        justRun { service.checkForDifficultyPromotion(0) }
        every { boardGame.getTop5Players() } returns listOf(player)
        every { boardGame.config.pointsPerDifficulty.getValue(any()) } returns 5

        // prepare mutable state for currentQuestion and time
        var mutableQuestion: Question? = question
        var mutableTime: Long? = System.currentTimeMillis()
        every { player.details.currentQuestion } answers { mutableQuestion }
        every { player.details.currentQuestion = any() } answers
            {
                mutableQuestion = it.invocation.args[0] as Question?
            }
        every { player.details.firstGetCurrentQuestionTime } answers
            {
                mutableTime
            }
        every { player.details.firstGetCurrentQuestionTime = any() } answers
            {
                mutableTime = it.invocation.args[0] as Long?
            }

        val result = service.answerBoardQuestion(0, answers)

        assertTrue(result)
        assertEquals(null, mutableQuestion)
        assertEquals(null, mutableTime)
    }

    @Test
    fun `answerBoardQuestion should not award points if incorrect`() {
        service =
            spyk(
                BoardQuestionService(gameRegistry, sseBoardService),
                recordPrivateCalls = true)

        val answers = setOf(999)

        every { service.getQuestion(0) } returns question
        every { boardGame.findPlayerByIndex(0) } returns player
        every { player.details.askedQuestions.add(question) } returns true
        every {
            service.answerQuestion(player, question, answers, any())
        } returns false
        justRun { service.checkForDifficultyPromotion(0) }
        every { boardGame.getTop5Players() } returns listOf(player)
        every { boardGame.config.pointsPerDifficulty.getValue(any()) } returns 5

        val mutablePointsMap = mutableMapOf<Int, Int>()
        every { player.details.pointsMap } returns mutablePointsMap
        every { player.details.points() } answers
            {
                mutablePointsMap.values.sum()
            }

        val result = service.answerBoardQuestion(0, answers)

        assertFalse(result)
        assertEquals(0, player.details.points())
    }

    @Test
    fun `answerBoardQuestion should throw if answered before getQuestion`() {
        service =
            spyk(
                BoardQuestionService(gameRegistry, sseBoardService),
                recordPrivateCalls = true)

        every { service.getQuestion(0) } returns question
        every { boardGame.findPlayerByIndex(0) } returns player
        every { boardGame.getTop5Players() } returns listOf(player)
        every { player.details.askedQuestions.add(question) } returns true
        // simulate no time set
        every { player.details.firstGetCurrentQuestionTime } returns null
        every { player.details.currentQuestion } returns question

        assertThrows<IllegalStateException> {
            service.answerBoardQuestion(0, setOf(0))
        }
    }
}
