package com.wuji.backend.question.board

import com.wuji.backend.config.DifficultyLevel
import com.wuji.backend.dispenser.BoardDispenser
import com.wuji.backend.game.GameRegistry
import com.wuji.backend.game.board.BoardGame
import com.wuji.backend.player.state.BoardPlayer
import com.wuji.backend.question.common.Answer
import com.wuji.backend.question.common.PlayerAnswer
import com.wuji.backend.question.common.Question
import com.wuji.backend.question.common.QuestionType
import io.mockk.*
import kotlin.test.assertEquals
import kotlin.test.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

class BoardQuestionServiceTest {

    private lateinit var gameRegistry: GameRegistry
    private lateinit var boardGame: BoardGame
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

        every { gameRegistry.getAs(BoardGame::class.java) } returns boardGame
        every { boardGame.questionDispenser } returns questionDispenser

        service = BoardQuestionService(gameRegistry)
        question =
            Question(
                1,
                "cat",
                QuestionType.TEXT,
                "task",
                listOf(Answer(0, "answer")),
                setOf(0),
                DifficultyLevel.MEDIUM)
    }

    @Test
    fun `getAnswers should return player's answers`() {
        val answers = mutableListOf(PlayerAnswer(question, setOf(0), 0))

        every { player.details.answers } returns answers
        every { boardGame.findPlayerByIndex(0) } returns player

        val result = service.getAnswers(0)

        assertEquals(answers, result)
    }

    @Test
    fun `getQuestion should fetch question from dispenser`() {
        every { boardGame.findPlayerByIndex(0) } returns player
        every { player.details.currentTileIndex } returns 5
        every { boardGame.tiles[5].category } returns "cat"
        every { player.details.categoryToDifficulty.getValue("cat") } returns
            question.difficultyLevel
        every { player.details.askedQuestions } returns mutableListOf()
        every {
            questionDispenser.getQuestion(
                "cat", question.difficultyLevel, emptySet())
        } returns question

        val result = service.getQuestion(0)

        assertEquals(question, result)
    }

    @Test
    fun `answerBoardQuestion should add question to askedQuestions and return result`() {
        service =
            spyk(BoardQuestionService(gameRegistry), recordPrivateCalls = true)

        val answers = setOf(0)

        every { service.getQuestion(0) } returns question
        every { boardGame.findPlayerByIndex(0) } returns player
        every { player.details.askedQuestions.add(question) } returns true
        every { service.answerQuestion(player, question, answers) } returns true
        justRun { service.checkForDifficultyPromotion(0) }

        val result = service.answerBoardQuestion(0, answers)

        assertTrue(result)
        verify { player.details.askedQuestions.add(question) }
        verify { service.checkForDifficultyPromotion(0) }
    }

    @Test
    fun `checkForDifficultyPromotion should promote difficulty when threshold reached`() {
        service =
            spyk(BoardQuestionService(gameRegistry), recordPrivateCalls = true)

        val promotionRules = mapOf(question.category to 2)

        every { service.getQuestion(0) } returns question
        every { boardGame.findPlayerByIndex(0) } returns player
        every { boardGame.config.rankingPromotionRules } returns promotionRules
        every { player.details.askedQuestions } returns
            mutableListOf(question, question)
        every { player.details.categoryToDifficulty } returns
            mutableMapOf(question.category to question.difficultyLevel)

        service.checkForDifficultyPromotion(0)

        assertEquals(
            question.difficultyLevel.next(),
            player.details.categoryToDifficulty[question.category])
    }
}
