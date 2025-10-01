package com.wuji.backend.security.validator

import com.wuji.backend.game.GameType
import com.wuji.backend.game.common.GameServiceDelegate
import com.wuji.backend.security.validator.exception.InvalidGameStateException
import io.mockk.every
import io.mockk.mockk
import org.aspectj.lang.JoinPoint
import org.aspectj.lang.Signature
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Test

class GameStateAspectTest {

    private val mockGameServiceDelegate = mockk<GameServiceDelegate>(relaxed = true)
    private val aspect = GameStateAspect(mockGameServiceDelegate)

    // Dummy controller annotated with RequiresGame
    @RequiresGame(GameType.BOARD)
    class BoardGameController

    private fun mockJoinPoint(target: Any): JoinPoint {
        val jp = mockk<JoinPoint>()
        val sig = mockk<Signature>()
        every { jp.signature } returns sig
        every { jp.target } returns target
        return jp
    }

    @Test
    fun `allows access when game type matches`() {
        // Arrange
        every { mockGameServiceDelegate.getGameType() } returns GameType.BOARD
        val joinPoint = mockJoinPoint(BoardGameController())

        // Act & Assert (no exception should be thrown)
        aspect.checkGameType(joinPoint)
    }

    @Test
    fun `throws exception when game type does not match`() {
        // Arrange
        every { mockGameServiceDelegate.getGameType() } returns GameType.QUIZ
        val joinPoint = mockJoinPoint(BoardGameController())

        // Act & Assert
        assertThrows(InvalidGameStateException::class.java) {
            aspect.checkGameType(joinPoint)
        }
    }
}
