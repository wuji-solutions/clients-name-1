package com.wuji.backend.security

import com.wuji.backend.game.GameRegistry
import com.wuji.backend.game.GameType
import com.wuji.backend.game.common.exception.GameIncorrectIsRunningException
import com.wuji.backend.game.common.exception.IncorrectGameTypeException
import org.aspectj.lang.JoinPoint
import org.aspectj.lang.annotation.Aspect
import org.aspectj.lang.annotation.Before
import org.aspectj.lang.reflect.MethodSignature
import org.springframework.stereotype.Component

@Aspect
@Component
class GameValidationAspect(
    private val gameRegistry: GameRegistry
) {

    @Before("@within(com.wuji.backend.security.RequiresGame) || @annotation(com.wuji.backend.security.RequiresGame)")
    fun validateGameType(joinPoint: JoinPoint) {
        val requiredType = getRequiredGameType(joinPoint)
        val currentType = gameRegistry.gameType

        if (currentType != requiredType) {
            throw IncorrectGameTypeException(gameRegistry.gameType, requiredType.gameClass())
        }
    }

    @Before("@within(com.wuji.backend.security.RunningGame) || @annotation(com.wuji.backend.security.RunningGame)")
    fun validateGameIsRunning(joinPoint: JoinPoint) {
        val isRunning = joinPoint.getIsRunning()
        if (gameRegistry.game.isRunning == isRunning) {
            throw GameIncorrectIsRunningException(gameRegistry.game.isRunning, isRunning)
        }
    }

    private fun JoinPoint.getIsRunning(): Boolean {
        val method = (signature as MethodSignature).method

        method.getAnnotation(RunningGame::class.java)?.let {
            return it.isRunning
        }

        val targetClass = target.javaClass
        targetClass.getAnnotation(RunningGame::class.java)?.let {
            return it.isRunning
        }

        throw IllegalStateException("Missing @RunningGame annotation on method or class")

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

        throw IllegalStateException("Missing @RequiresGame annotation on method or class")
    }
}


@Target(AnnotationTarget.FUNCTION, AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
annotation class RequiresGame(val gametype: GameType)

@Target(AnnotationTarget.FUNCTION, AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
annotation class RunningGame(val isRunning: Boolean)