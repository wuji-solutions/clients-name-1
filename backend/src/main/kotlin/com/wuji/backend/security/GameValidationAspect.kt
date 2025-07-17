package com.wuji.backend.security

import com.wuji.backend.game.GameRegistry
import com.wuji.backend.game.GameType
import com.wuji.backend.game.common.GameState
import com.wuji.backend.game.common.exception.GameInIncorrectStateException
import com.wuji.backend.game.common.exception.IncorrectGameTypeException
import org.aspectj.lang.JoinPoint
import org.aspectj.lang.annotation.Aspect
import org.aspectj.lang.annotation.Before
import org.aspectj.lang.reflect.MethodSignature
import org.springframework.stereotype.Component

@Aspect
@Component
class GameValidationAspect(private val gameRegistry: GameRegistry) {

    @Before(
        "@within(com.wuji.backend.security.RequiresGame) || @annotation(com.wuji.backend.security.RequiresGame)")
    fun validateGameType(joinPoint: JoinPoint) {
        val requiredType = getRequiredGameType(joinPoint)
        val currentType = gameRegistry.gameType

        if (currentType != requiredType) {
            throw IncorrectGameTypeException(
                gameRegistry.gameType, requiredType.gameClass())
        }
    }

    @Before(
        "@within(com.wuji.backend.security.AnyGameState) || @annotation(com.wuji.backend.security.AnyGameState)")
    fun validateGameIsRunning(joinPoint: JoinPoint) {
        val acceptableStates = joinPoint.getAcceptableStates()
        if (gameRegistry.game.gameState in acceptableStates) {
            throw GameInIncorrectStateException(
                acceptableStates.joinToString("|"),
                gameRegistry.game.gameState.name)
        }
    }

    private fun JoinPoint.getAcceptableStates(): Array<GameState> {
        val method = (signature as MethodSignature).method

        method.getAnnotation(AnyGameState::class.java)?.let {
            return it.states
        }

        val targetClass = target.javaClass
        targetClass.getAnnotation(AnyGameState::class.java)?.let {
            return it.states
        }

        throw IllegalStateException(
            "Missing @RunningGame annotation on method or class")
    }

    private fun getRequiredGameType(joinPoint: JoinPoint): GameType {
        val method = (joinPoint.signature as MethodSignature).method

        method.getAnnotation(RequiresGame::class.java)?.let {
            return it.gametype
        }

        val targetClass = joinPoint.target.javaClass
        targetClass.getAnnotation(RequiresGame::class.java)?.let {
            return it.gametype
        }

        throw IllegalStateException(
            "Missing @RequiresGame annotation on method or class")
    }
}

@Target(AnnotationTarget.FUNCTION, AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
annotation class RequiresGame(val gametype: GameType)

@Target(AnnotationTarget.FUNCTION, AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
annotation class AnyGameState(val states: Array<GameState>)

@Target(AnnotationTarget.FUNCTION, AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
@AnyGameState([GameState.CREATED])
annotation class GameCreated

@Target(AnnotationTarget.FUNCTION, AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
@AnyGameState([GameState.RUNNING])
annotation class GameRunning

@Target(AnnotationTarget.FUNCTION, AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
@AnyGameState([GameState.PAUSED])
annotation class GamePaused

@Target(AnnotationTarget.FUNCTION, AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
@AnyGameState([GameState.FINISHED])
annotation class GameFinished
