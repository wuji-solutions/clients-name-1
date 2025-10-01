package com.wuji.backend.security.validator

import com.wuji.backend.game.GameType
import com.wuji.backend.game.common.GameServiceDelegate
import com.wuji.backend.game.common.GameState
import com.wuji.backend.game.common.exception.GameInIncorrectStateException
import com.wuji.backend.security.validator.exception.InvalidGameTypeException
import io.mockk.every
import io.mockk.mockk
import org.aspectj.lang.JoinPoint
import org.aspectj.lang.Signature
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow
import org.junit.jupiter.api.assertThrows

class GameStateAspectTest {

    private val mockGameServiceDelegate =
        mockk<GameServiceDelegate>(relaxed = true)
    private val aspect = GameStateAspect(mockGameServiceDelegate)

    @RequiresGame(GameType.BOARD) class BoardGameController

    @GameCreated class CreatedController

    @GameRunning class RunningController

    @GamePaused class PausedController

    private fun mockJoinPoint(target: Any): JoinPoint {
        val jp = mockk<JoinPoint>()
        val sig = mockk<Signature>()
        every { jp.signature } returns sig
        every { jp.target } returns target
        return jp
    }

    @Test
    fun `allows access when game type matches`() {
        every { mockGameServiceDelegate.getGameType() } returns GameType.BOARD
        val joinPoint = mockJoinPoint(BoardGameController())

        aspect.checkGameType(joinPoint)
    }

    @Test
    fun `throws exception when game type does not match`() {
        every { mockGameServiceDelegate.getGameType() } returns GameType.QUIZ
        val joinPoint = mockJoinPoint(BoardGameController())

        assertThrows(InvalidGameTypeException::class.java) {
            aspect.checkGameType(joinPoint)
        }
    }

    @Test
    fun `checkCreated succeeds when game state is CREATED`() {
        every { mockGameServiceDelegate.getGameState() } returns
            GameState.CREATED

        assertDoesNotThrow { aspect.checkCreated() }
    }

    @Test
    fun `checkCreated fails when game state is not CREATED`() {
        every { mockGameServiceDelegate.getGameState() } returns
            GameState.RUNNING

        assertThrows<GameInIncorrectStateException> { aspect.checkCreated() }
    }

    @Test
    fun `checkRunning succeeds when game state is RUNNING`() {
        every { mockGameServiceDelegate.getGameState() } returns
            GameState.RUNNING
        assertDoesNotThrow { aspect.checkRunning() }
    }

    @Test
    fun `checkRunning fails when game state is not RUNNING`() {
        every { mockGameServiceDelegate.getGameState() } returns
            GameState.PAUSED
        assertThrows<GameInIncorrectStateException> { aspect.checkRunning() }
    }

    @Test
    fun `checkPaused succeeds when game state is PAUSED`() {
        every { mockGameServiceDelegate.getGameState() } returns
            GameState.PAUSED
        assertDoesNotThrow { aspect.checkPaused() }
    }

    @Test
    fun `checkPaused fails when game state is not PAUSED`() {
        every { mockGameServiceDelegate.getGameState() } returns
            GameState.RUNNING
        assertThrows<GameInIncorrectStateException> { aspect.checkPaused() }
    }
}
