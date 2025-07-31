package com.wuji.backend.security.validator

import com.wuji.backend.game.exam.dto.ExamConfigGameCreateRequestDto
import jakarta.validation.ConstraintValidator
import jakarta.validation.ConstraintValidatorContext

class ExamConfigValidator :
    ConstraintValidator<ValidExamConfig, ExamConfigGameCreateRequestDto> {
    override fun isValid(
        dto: ExamConfigGameCreateRequestDto,
        context: ConstraintValidatorContext
    ): Boolean {
        // Jeśli losowanie jest wyłączone, muszą być podane konkretne ID pytań
        if (!dto.randomizeQuestions && dto.selectedQuestionIds.isEmpty()) {
            context.disableDefaultConstraintViolation()
            context
                .buildConstraintViolationWithTemplate(
                    "Lista wybranych pytań musi być podana, jeśli losowe pytania nie są ustawione")
                .addPropertyNode("selectedQuestionIds")
                .addConstraintViolation()
            return false
        }

        // Jeśli losowanie jest włączone, lista ID powinna być pusta
        if (dto.randomizeQuestions && dto.selectedQuestionIds.isNotEmpty()) {
            context.disableDefaultConstraintViolation()
            context
                .buildConstraintViolationWithTemplate(
                    "Lista wybranych pytań musi być pusta, jeśli losowe pytania są ustawione")
                .addPropertyNode("selectedQuestionIds")
                .addConstraintViolation()
            return false
        }

        return true
    }
}
