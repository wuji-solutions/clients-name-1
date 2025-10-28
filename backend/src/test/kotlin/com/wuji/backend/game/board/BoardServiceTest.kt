package com.wuji.backend.game.board

import com.wuji.backend.config.BoardConfig
import com.wuji.backend.events.board.SSEBoardService
import com.wuji.backend.events.common.SSEEventService
import com.wuji.backend.events.common.SSEUsersService
import com.wuji.backend.game.GameRegistry
import com.wuji.backend.game.GameType
import com.wuji.backend.player.dto.PlayerDto
import com.wuji.backend.player.dto.PlayerDto.Companion.toDto
import com.wuji.backend.player.state.BoardPlayer
import com.wuji.backend.player.state.BoardPlayerDetails
import com.wuji.backend.player.state.PlayerService
import com.wuji.backend.player.state.exception.PlayerNotFoundException
import io.mockk.*
import kotlin.test.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

class BoardServiceTest {

    private val gameRegistry = mockk<GameRegistry>()
    private val sseEventService = mockk<SSEEventService>(relaxed = true)
    private val sseUsersService = mockk<SSEUsersService>(relaxed = true)
    private val sseBoardService = mockk<SSEBoardService>(relaxed = true)
    private val playerService = mockk<PlayerService>()

    private lateinit var service: BoardService
    private lateinit var game: BoardGame

    @BeforeEach
    fun setUp() {
        game =
            spyk(
                BoardGame(
                    name = "Test",
                    config = mockk(relaxed = true),
                    categories = listOf("cat1"),
                    questions = emptyList(),
                    tiles = listOf(Tile("cat1", 0))))
        every { gameRegistry.getAs(BoardGame::class.java) } returns game
        service =
            BoardService(
                gameRegistry,
                sseEventService,
                sseUsersService,
                sseBoardService,
                playerService)
    }

    @Test
    fun `joinGame should create player, add to game and send players event`() {
        val playerNickname = "Alice"
        val playerIndex = 420
        val player =
            mockk<BoardPlayer> {
                every { nickname } returns playerNickname
                every { index } returns playerIndex
            }
        val playerDto = PlayerDto(playerIndex, playerNickname)

        every {
            playerService.createPlayer(any(), any<BoardPlayerDetails>())
        } returns player
        every { game.findPlayerByIndex(any()) } throws
            PlayerNotFoundException(playerIndex)

        service.joinGame(playerIndex, playerNickname)

        verify {
            playerService.createPlayer(playerIndex, any())
        }
        verify { sseUsersService.sendPlayers(match { it.contains(playerDto) }) }
        assert(player in game.players)
    }

    @Test
    fun `listPlayers should return mapped player DTOs`() {
        val player =
            mockk<BoardPlayer> {
                every { nickname } returns "John"
                every { index } returns 420
            }

        every { game.players } returns mutableSetOf(player)

        val dto = player.toDto()

        val result = service.listPlayers()

        assertEquals(listOf(dto), result)
    }

    @Test
    fun `createGame should register a new quiz game`() {
        val config = mockk<BoardConfig>()
        val resource =
            this::class.java.getResource("/sample_moodle_xml_1.xml")!!.path
        val numOfTiles = 10
        every { gameRegistry.register(any()) } just runs

        service.createGame("test", config, resource, numOfTiles)

        verify {
            gameRegistry.register(
                match { it.name == "test" && it.gameType == GameType.BOARD })
        }
    }

    @Test
    fun `startGame should start quiz and send SSE`() {
        every { game.start() } just Runs

        service.startGame()

        verify {
            game.start()
            sseEventService.sendGameStart()
        }
    }

    @Test
    fun `pauseGame should pause quiz`() {
        every { game.pause() } just Runs

        service.pauseGame()

        verify { game.pause() }
    }

    @Test
    fun `resumeGame should resume quiz`() {
        every { game.resume() } just Runs

        service.resumeGame()

        verify { game.resume() }
    }

    @Test
    fun `finishGame should finish quiz and send SSE`() {
        every { game.finish() } just Runs

        service.finishGame()

        verify {
            game.finish()
            sseEventService.sendGameFinish()
        }
    }

    @Test
    fun `movePlayer should call game move and send SSE update`() {
        val player = BoardPlayer(0, "Test", BoardPlayerDetails())
        game.addPlayer(player)
        every { game.findPlayerByIndex(player.index) } returns player

        service.movePlayer(player.index)
        verify { game.movePlayer(player, any()) }
        verify { sseBoardService.sendNewBoardStateEvent(any()) }
    }
}
