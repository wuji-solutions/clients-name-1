package com.wuji.backend.security.validator

import com.wuji.backend.config.dto.ExamConfigDto
import com.wuji.backend.parser.MoodleXmlParser
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

        val parsedInfo = MoodleXmlParser.parsedInfo(dto.questionFilePath)
        if (dto.requiredQuestionCount > parsedInfo.questions.size) {
            context.disableDefaultConstraintViolation()
            context
                .buildConstraintViolationWithTemplate(
                    "Liczba wymaganych pytań jest większa niż liczba pytań w pliku")
                .addPropertyNode("requiredQuestionCount")
                .addConstraintViolation()
            return false
        }

        return true
    }
}
