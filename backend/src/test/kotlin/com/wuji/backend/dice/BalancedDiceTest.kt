package com.wuji.backend.dice

import com.wuji.backend.config.DifficultyLevel
import com.wuji.backend.game.board.Tile
import com.wuji.backend.player.state.BoardPlayer
import com.wuji.backend.player.state.BoardPlayerDetails
import com.wuji.backend.player.state.Player
import com.wuji.backend.question.common.PlayerAnswer
import com.wuji.backend.question.common.Question
import io.mockk.every
import io.mockk.mockk
import kotlin.collections.emptyMap
import kotlin.random.Random
import kotlin.test.Test
import kotlin.test.assertTrue

class BalancedDiceTest {

    private fun createTiles(): List<Tile> {
        return listOf(
            Tile("Math", 0),
            Tile("Science", 1),
            Tile("History", 2),
            Tile("Geography", 3),
            Tile("Physics", 4),
            Tile("Biology", 5),
            Tile("Math", 6),
            Tile("Science", 7),
            Tile("History", 8),
            Tile("Geography", 9))
    }

    private fun createPlayer(
        currentPosition: Int = 0,
        categoryDifficulties: Map<String, DifficultyLevel> = emptyMap(),
        recentCategories: List<String> = emptyList()
    ): BoardPlayer {
        val details =
            BoardPlayerDetails(
                currentTileIndex = currentPosition,
                categoryToDifficulty =
                    categoryDifficulties.toMutableMap().withDefault {
                        DifficultyLevel.EASY
                    })

        recentCategories.reversed().forEach { category ->
            val mockQuestion = mockk<Question>()
            every { mockQuestion.category } returns category
            every { mockQuestion.id } returns (0..10000).random()
            every { mockQuestion.areCorrectAnswerIds(any()) } returns true

            val answer =
                PlayerAnswer(
                    question = mockQuestion,
                    selectedIds = emptySet(),
                    answerTimeInMilliseconds = 1000L,
                    cheated = false)
            details.answers.add(answer)
        }

        return Player(index = 0, nickname = "HotBob123", details = details)
    }

    @Test
    fun `should return value between 1 and 6`() {
        val tiles = createTiles()
        val dice = BalancedDice(tiles)
        val player = createPlayer()

        val roll = dice.roll(player)

        assertTrue(roll in 1..6, "Roll should be between 1 and 6, got $roll")
    }

    @Test
    fun `should heavily penalize most recent category`() {
        val tiles = createTiles()
        val player =
            createPlayer(
                currentPosition = 0,
                categoryDifficulties =
                    mapOf(
                        "Math" to DifficultyLevel.EASY,
                        "Science" to DifficultyLevel.EASY),
                recentCategories = listOf("Math"))

        // Index 0 = Math, so roll 1 would land on Science (index 1)
        // we want to check that Math is avoided
        val dice = BalancedDice(tiles, Random(42))
        val rolls = (1..1000).map { dice.roll(player) }
        val roll1Count = rolls.count { it == 1 }
        val roll6Count = rolls.count { it == 6 }

        assertTrue(roll1Count > 150)
        assertTrue(roll6Count < 10)
    }

    @Test
    fun `should favor categories with lower difficulty`() {
        val tiles = createTiles()
        val player =
            createPlayer(
                currentPosition = 0,
                categoryDifficulties =
                    mapOf(
                        "Math" to DifficultyLevel.EASY,
                        "Science" to DifficultyLevel.HARD,
                        "History" to DifficultyLevel.MEDIUM),
                recentCategories = emptyList())

        val dice = BalancedDice(tiles, Random(123))
        val rolls = (1..1000).map { dice.roll(player) }

        // from index 0:
        // 1 -> Science (HARD)
        // 2 -> History (MEDIUM)
        // 3 -> Geography (EASY)

        val roll1Count = rolls.count { it == 1 } // HARD
        val roll2Count = rolls.count { it == 2 } // MEDIUM
        val roll3Count = rolls.count { it == 3 } // EASY

        assertTrue(roll3Count > roll2Count)
        assertTrue(roll2Count > roll1Count)
    }

    @Test
    fun `should handle player with no answer history`() {
        val tiles = createTiles()
        val player =
            createPlayer(
                currentPosition = 0,
                categoryDifficulties =
                    mapOf(
                        "Math" to DifficultyLevel.EASY,
                        "Science" to DifficultyLevel.HARD),
                recentCategories = emptyList())

        val dice = BalancedDice(tiles)
        val roll = dice.roll(player)

        assertTrue(roll in 1..6)
    }

    @Test
    fun `should produce different results with different random seeds`() {
        val tiles = createTiles()
        val player = createPlayer()

        val dice1 = BalancedDice(tiles, Random(100))
        val dice2 = BalancedDice(tiles, Random(200))

        val rolls1 = (1..100).map { dice1.roll(player) }
        val rolls2 = (1..100).map { dice2.roll(player) }

        assertTrue(rolls1 != rolls2)
    }
}
