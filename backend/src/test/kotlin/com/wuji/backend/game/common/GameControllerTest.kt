package com.wuji.backend.game.common

import com.wuji.backend.game.common.dto.JoinGameRequestDto
import com.wuji.backend.player.dto.IPlayerDto
import com.wuji.backend.player.state.exception.PlayerAlreadyJoinedException
import com.wuji.backend.security.auth.Participant
import com.wuji.backend.security.auth.PlayerAuthService
import io.mockk.*
import jakarta.servlet.http.HttpServletRequest
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication

class GameControllerTest {

    private lateinit var playerAuthService: PlayerAuthService
    private lateinit var gameController: TestGameController
    private lateinit var request: HttpServletRequest

    @BeforeEach
    fun setup() {
        playerAuthService = mockk()
        request = mockk()
    }

    @AfterEach
    fun tearDown() {
        clearAllMocks()
    }

    @Test
    fun `joinGame should remove authentication when PlayerAlreadyJoinedException is thrown`() {
        val index = 2
        val nickname = "DuplicatePlayer"
        val requestDto = JoinGameRequestDto(index = index)
        val participant = Participant(index = index, nickname = nickname)

        gameController =
            TestGameController(
                playerAuthService, shouldThrowAlreadyJoined = true)

        every { playerAuthService.authenticate(index, request) } returns
            participant
        every { playerAuthService.removeAuthentication(nickname) } just Runs

        assertThrows<PlayerAlreadyJoinedException> {
            gameController.joinGame(requestDto, request)
        }

        verify(exactly = 1) { playerAuthService.authenticate(index, request) }
        verify(exactly = 1) { playerAuthService.removeAuthentication(nickname) }
        assertEquals(1, gameController.joinGameCallCount)
    }

    @Test
    fun `joinGame should handle multiple players joining sequentially`() {
        val players =
            listOf(
                Triple(1, "Player1", Participant(1, "Player1")),
                Triple(2, "Player2", Participant(2, "Player2")),
                Triple(3, "Player3", Participant(3, "Player3")))

        gameController = TestGameController(playerAuthService)

        players.forEach { (index, _, participant) ->
            every { playerAuthService.authenticate(index, request) } returns
                participant
        }

        val responses =
            players.map { (index, _, _) ->
                gameController.joinGame(
                    JoinGameRequestDto(index = index), request)
            }

        responses.forEachIndexed { i, response ->
            assertEquals(HttpStatus.OK, response.statusCode)
            assertEquals(players[i].second, response.body)
        }

        verify(exactly = 3) { playerAuthService.authenticate(any(), request) }
        assertEquals(3, gameController.joinGameCallCount)
    }

    @Test
    fun `joinGame should use correct participant data from authentication`() {
        val index = 5
        val nickname = "UniqueNickname"
        val requestDto = JoinGameRequestDto(index = index)
        val participant = Participant(index = index, nickname = nickname)

        gameController = TestGameController(playerAuthService)

        every { playerAuthService.authenticate(index, request) } returns
            participant

        gameController.joinGame(requestDto, request)

        assertEquals(index, gameController.lastCalledIndex)
        assertEquals(nickname, gameController.lastCalledNickname)
    }

    @Test
    fun `joinGame should not remove authentication on successful join`() {
        val index = 6
        val nickname = "SuccessPlayer"
        val requestDto = JoinGameRequestDto(index = index)
        val participant = Participant(index = index, nickname = nickname)

        gameController = TestGameController(playerAuthService)

        every { playerAuthService.authenticate(index, request) } returns
            participant

        gameController.joinGame(requestDto, request)

        verify(exactly = 0) {
            playerAuthService.removeAuthentication(any<String>())
        }
        verify(exactly = 0) {
            playerAuthService.removeAuthentication(any<Int>())
        }
    }

    private class TestGameController(
        playerAuthService: PlayerAuthService,
        private val shouldThrowAlreadyJoined: Boolean = false,
        private val shouldThrowRuntimeException: Boolean = false
    ) : GameController(playerAuthService) {

        var joinGameCallCount = 0
        var lastCalledIndex: Int? = null
        var lastCalledNickname: String? = null

        override fun performJoinGame(index: Int, nickname: String) {
            joinGameCallCount++
            lastCalledIndex = index
            lastCalledNickname = nickname

            when {
                shouldThrowAlreadyJoined ->
                    throw PlayerAlreadyJoinedException(index, nickname)
                shouldThrowRuntimeException ->
                    throw RuntimeException("Unexpected error")
            }
        }

        override fun getPlayer(
            authentication: Authentication
        ): ResponseEntity<out IPlayerDto> {
            return ResponseEntity.ok(mockk<IPlayerDto>())
        }
    }
}
