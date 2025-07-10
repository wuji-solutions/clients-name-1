package com.wuji.backend.security

import com.wuji.backend.game.GameRegistry
import com.wuji.backend.game.GameType
import org.aspectj.lang.JoinPoint
import org.aspectj.lang.annotation.Aspect
import org.aspectj.lang.annotation.Before
import org.aspectj.lang.reflect.MethodSignature
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Component
import org.springframework.web.server.ResponseStatusException

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
            throw ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Requires game type: $requiredType (Current: $currentType)"
            )
        }
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