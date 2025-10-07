package com.wuji.backend.security.validator

import com.wuji.backend.game.GameType
import com.wuji.backend.game.common.GameServiceDelegate
import com.wuji.backend.game.common.GameState
import com.wuji.backend.game.common.exception.GameInIncorrectStateException
import com.wuji.backend.security.validator.exception.InvalidGameTypeException
import kotlin.jvm.java
import org.aspectj.lang.JoinPoint
import org.aspectj.lang.annotation.Aspect
import org.aspectj.lang.annotation.Before
import org.springframework.stereotype.Component

@Aspect
@Component
class GameStateAspect(private val gameServiceDelegate: GameServiceDelegate) {

    @Before("@within(GameCreated) || @annotation(GameCreated)")
    fun checkCreated() {
        if (gameServiceDelegate.getGameState() != GameState.CREATED) {
            throw GameInIncorrectStateException(
                GameState.CREATED, gameServiceDelegate.getGameState())
        }
    }

    @Before("@within(GameRunning) || @annotation(GameRunning)")
    fun checkRunning() {
        if (gameServiceDelegate.getGameState() != GameState.RUNNING) {
            throw GameInIncorrectStateException(
                GameState.RUNNING, gameServiceDelegate.getGameState())
        }
    }

    @Before("@within(GamePaused) || @annotation(GamePaused)")
    fun checkPaused() {
        if (gameServiceDelegate.getGameState() != GameState.PAUSED) {
            throw GameInIncorrectStateException(
                GameState.PAUSED, gameServiceDelegate.getGameState())
        }
    }

    @Before(
        "@within(GameRunningOrFinishing) || @annotation(GameRunningOrFinishing)")
    fun checkRunningOrFinishing() {
        if (gameServiceDelegate.getGameState() != GameState.FINISHING &&
            gameServiceDelegate.getGameState() != GameState.RUNNING) {
            throw GameInIncorrectStateException(
                "${GameState.RUNNING.polish} lub ${GameState.FINISHING.polish}",
                gameServiceDelegate.getGameState().polish)
        }
    }

    @Before("@within(RequiresGame)")
    fun checkGameType(joinPoint: JoinPoint) {
        val controllerClass = joinPoint.target::class.java
        val annotation = controllerClass.getAnnotation(RequiresGame::class.java)

        if (annotation != null &&
            gameServiceDelegate.getGameType() != annotation.value) {
            throw InvalidGameTypeException(
                annotation.value, gameServiceDelegate.getGameType())
        }
    }
}

@Target(AnnotationTarget.FUNCTION, AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
annotation class GameCreated

@Target(AnnotationTarget.FUNCTION, AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
annotation class GameRunning

@Target(AnnotationTarget.FUNCTION, AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
annotation class GamePaused

@Target(AnnotationTarget.FUNCTION, AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
annotation class GameRunningOrFinishing

@Target(AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
annotation class RequiresGame(val value: GameType)
