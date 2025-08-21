package com.wuji.backend.game.board

import com.wuji.backend.config.BoardConfig
import com.wuji.backend.game.common.GameState
import com.wuji.backend.player.state.BoardPlayer
import com.wuji.backend.player.state.BoardPlayerDetails
import com.wuji.backend.question.common.Question
import io.mockk.every
import io.mockk.mockk
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

class BoardGameTest {

    private lateinit var game: BoardGame
    private lateinit var player: BoardPlayer

    @BeforeEach
    fun setUp() {
        val config = mockk<BoardConfig>(relaxed = true)
        val tiles = listOf(Tile("cat1", 0), Tile("cat2", 1), Tile("cat3", 2))
        val question =
            mockk<Question>(relaxed = true) { every { category } returns "cat" }
        game =
            BoardGame(
                name = "TestGame",
                config = config,
                categories = listOf("cat1", "cat2"),
                questions = listOf(question),
                tiles = tiles)
        player = BoardPlayer(0, "Alice", BoardPlayerDetails())
        game.players.add(player)
    }

    @Test
    fun `pause should set state to PAUSED`() {
        game.pause()
        assertEquals(GameState.PAUSED, game.gameState)
    }

    @Test
    fun `resume should set state to RUNNING`() {
        game.resume()
        assertEquals(GameState.RUNNING, game.gameState)
    }

    @Test
    fun `finish should set state to FINISHED`() {
        game.finish()
        assertEquals(GameState.FINISHED, game.gameState)
    }

    @Test
    fun `addPlayer should put player on tile 0`() {
        game.addPlayer(player)
        assertTrue(game.boardState[0]!!.contains(player))
    }

    @Test
    fun `movePlayer should move player to new tile`() {
        game.addPlayer(player)
        val startIndex = player.details.currentTileIndex

        game.movePlayer(player, 2)

        val newIndex = player.details.currentTileIndex
        assertEquals((startIndex + 2) % game.tiles.size, newIndex)
        assertFalse(game.boardState[startIndex]!!.contains(player))
        assertTrue(game.boardState[newIndex]!!.contains(player))
    }

    @Test
    fun `movePlayer should throw if player not on tile`() {
        assertThrows(IllegalStateException::class.java) {
            game.movePlayer(player, 1)
        }
    }
}
