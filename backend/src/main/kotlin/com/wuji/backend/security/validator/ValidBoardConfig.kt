package com.wuji.backend.security.validator

import jakarta.validation.Constraint
import kotlin.reflect.KClass

@Constraint(validatedBy = [BoardConfigValidator::class])
@Target(AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
annotation class ValidBoardConfig(
    val message: String = "Konfiguracja rozgrywki jest nieprawidłowa",
    val groups: Array<KClass<*>> = [],
    val payload: Array<KClass<out Any>> = []
)
