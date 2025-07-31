package com.wuji.backend.security.validator

import com.wuji.backend.config.dto.BoardConfigDto
import jakarta.validation.ConstraintValidator
import jakarta.validation.ConstraintValidatorContext

class BoardConfigValidator :
    ConstraintValidator<ValidBoardConfig, BoardConfigDto> {
    override fun isValid(
        dto: BoardConfigDto,
        context: ConstraintValidatorContext
    ): Boolean {
        if (dto.pointsPerDifficulty.any { it.value < 0 }) {
            context.disableDefaultConstraintViolation()
            context
                .buildConstraintViolationWithTemplate(
                    "Punkty za pytania w zależności od trudności muszą być nieujemne"
                )
                .addPropertyNode("pointsPerDifficulty")
                .addConstraintViolation()
            return false
        }

        if (dto.rankingPromotionRules.any { it.value <= 0 }) {
            context.disableDefaultConstraintViolation()
            context
                .buildConstraintViolationWithTemplate(
                    "Liczba poprawnych odpowiedzi potrzeba do awansu musi być dodatnia"
                )
                .addPropertyNode("rankingPromotionRules")
                .addConstraintViolation()
            return false
        }

        return true
    }
}
