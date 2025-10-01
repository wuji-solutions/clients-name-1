package com.wuji.backend.security.validator

import com.wuji.backend.game.GameType
import com.wuji.backend.game.common.GameServiceDelegate
import com.wuji.backend.game.common.GameState
import com.wuji.backend.security.validator.exception.InvalidGameStateException
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
            throw InvalidGameStateException(
                "Gra nie została jeszcze stworzona.")
        }
    }

    @Before("@within(GameRunning) || @annotation(GameRunning)")
    fun checkRunning() {
        if (gameServiceDelegate.getGameState() != GameState.RUNNING) {
            throw InvalidGameStateException("Gra nie jest w toku")
        }
    }

    @Before("@within(GamePaused) || @annotation(GamePaused)")
    fun checkPaused() {
        if (gameServiceDelegate.getGameState() != GameState.PAUSED) {
            throw InvalidGameStateException("Gra nie jest zapauzowana")
        }
    }

    @Before("@within(RequiresGame)")
    fun checkGameType(joinPoint: JoinPoint) {
        val controllerClass = joinPoint.target::class.java
        val annotation = controllerClass.getAnnotation(RequiresGame::class.java)

        if (annotation != null &&
            gameServiceDelegate.getGameType() != annotation.value) {
            throw InvalidGameStateException(
                "Wymagana gra to ${annotation.value}, " +
                    "a aktualna to ${gameServiceDelegate.getGameType()}")
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

@Target(AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
annotation class RequiresGame(val value: GameType)
