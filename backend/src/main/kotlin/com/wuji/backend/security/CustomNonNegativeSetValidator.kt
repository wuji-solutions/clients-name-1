package com.wuji.backend.security

import jakarta.validation.Constraint
import jakarta.validation.ConstraintValidator
import jakarta.validation.ConstraintValidatorContext
import jakarta.validation.Payload
import kotlin.reflect.KClass

@Target(AnnotationTarget.FIELD)
@Retention(AnnotationRetention.RUNTIME)
@Constraint(validatedBy = [NonNegativeSetValidator::class])
annotation class NonNegativeElements(
    val message: String = "Wszystkie elementy muszą być nieujemne",
    val groups: Array<KClass<*>> = [],
    val payload: Array<KClass<out Payload>> = []
)

class NonNegativeSetValidator :
    ConstraintValidator<NonNegativeElements, Set<Int>> {
    override fun isValid(
        value: Set<Int>?,
        context: ConstraintValidatorContext
    ): Boolean {
        if (value == null) return true
        return value.all { it >= 0 }
    }
}
