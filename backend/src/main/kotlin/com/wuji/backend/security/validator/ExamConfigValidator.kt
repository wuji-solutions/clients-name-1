package com.wuji.backend.security.validator

import com.wuji.backend.config.dto.ExamConfigDto
import jakarta.validation.ConstraintValidator
import jakarta.validation.ConstraintValidatorContext

class ExamConfigValidator :
    ConstraintValidator<ValidExamConfig, ExamConfigDto> {
    override fun isValid(
        dto: ExamConfigDto,
        context: ConstraintValidatorContext
    ): Boolean {
        if (!dto.randomizeQuestions && dto.selectedQuestionIds.isEmpty()) {
            context.disableDefaultConstraintViolation()
            context
                .buildConstraintViolationWithTemplate(
                    "Lista wybranych pytań musi być podana, jeśli losowe pytania nie są ustawione")
                .addPropertyNode("selectedQuestionIds")
                .addConstraintViolation()
            return false
        }

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
