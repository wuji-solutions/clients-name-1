package com.wuji.backend.question.common

import com.wuji.backend.config.DifficultyLevel
import com.wuji.backend.question.common.dto.toAnswerDto
import com.wuji.backend.question.common.dto.toQuestionDto
import kotlin.test.assertEquals
import org.junit.jupiter.api.Test

class QuestionDtoTest {
    private var question =
        Question(
            id = 1,
            category = "category",
            type = QuestionType.TEXT,
            text = "text",
            textFormat = TextFormat.PLAIN_TEXT,
            answers =
                listOf(
                    Answer(1, "1", null),
                    Answer(2, "2", null),
                    Answer(3, "3", null)),
            correctAnswerIds = setOf(1),
            difficultyLevel = DifficultyLevel.MEDIUM,
            listOf(Image("url1", ImageType.URL)),
            tags = listOf("tag1", "tag2"))

    @Test
    fun `all needed fields of QuestionDto should be included in dto`() {
        val dto = question.toQuestionDto()

        assertEquals(question.id, dto.id)
        assertEquals(question.category, dto.category)
        assertEquals(question.type, dto.type)
        assertEquals(question.text, dto.task)
        assertEquals(question.difficultyLevel, dto.difficultyLevel)
        assertEquals(question.images?.size, dto.images?.size)
        assertEquals(
            question.images?.first()?.image, dto.images?.first()?.image)
        assertEquals(question.answers.map { it.toAnswerDto() }, dto.answers)
    }
}
