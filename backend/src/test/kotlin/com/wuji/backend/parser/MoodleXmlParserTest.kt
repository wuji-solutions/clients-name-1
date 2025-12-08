package com.wuji.backend.parser

import com.wuji.backend.config.DifficultyLevel
import com.wuji.backend.question.common.QuestionType
import com.wuji.backend.util.ext.getCategories
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test

class MoodleXmlParserTest {

    @Test
    fun `parse multichoice question`() {
        val xml =
            """
            <quiz>
              <question type="category">
                <category><text>Math</text></category>
              </question>
              <question type="multichoice">
                <questiontext format="html">
                  <text>What is 2+2?</text>
                </questiontext>
                <answer fraction="100">
                  <text>4</text>
                  <feedback><text>Correct</text></feedback>
                </answer>
                <answer fraction="0">
                  <text>5</text>
                  <feedback><text>Nope</text></feedback>
                </answer>
                <tags>
                  <tag><text>algebra</text></tag>
                </tags>
              </question>
            </quiz>
        """

        val questions = MoodleXmlParser.parse(xml.byteInputStream())
        assertEquals(1, questions.size)

        val q = questions.first()
        assertEquals("Math", q.category)
        assertEquals(QuestionType.TEXT, q.type)
        assertEquals("What is 2+2?", q.text)
        assertEquals(DifficultyLevel.EASY, q.difficultyLevel)
        assertEquals(2, q.answers.size)

        val correct = q.answers.first { it.id in q.correctAnswerIds }
        assertEquals("4", correct.text)
    }

    @Test
    fun `parse shortanswer question`() {
        val xml =
            """
            <quiz>
              <question type="category">
                <category><text>Geography</text></category>
              </question>
              <question type="shortanswer">
                <questiontext format="plain_text">
                  <text>Capital of France?</text>
                </questiontext>
                <answer fraction="100">
                  <text>Paris</text>
                  <feedback><text>Correct!</text></feedback>
                </answer>
              </question>
            </quiz>
        """

        val questions = MoodleXmlParser.parse(xml.byteInputStream())
        assertEquals(1, questions.size)

        val q = questions.first()
        assertEquals("Geography", q.category)
        assertEquals(QuestionType.TEXT, q.type)
        assertEquals("Capital of France?", q.text)
        assertEquals("Paris", q.answers.first().text)
        assertTrue(q.correctAnswerIds.contains(q.answers.first().id))
    }

    @Test
    fun `unsupported type is skipped`() {
        val xml =
            """
            <quiz>
              <question type="category">
                <category><text>Misc</text></category>
              </question>
              <question type="essay">
                <questiontext format="html">
                  <text>Write an essay</text>
                </questiontext>
              </question>
            </quiz>
        """

        val questions = MoodleXmlParser.parse(xml.byteInputStream())
        assertTrue(questions.isEmpty(), "Unsupported type should not be added")
    }

    @Test
    fun `sample moodle xml file 1`() {
        val resource = this::class.java.getResource("/sample_moodle_xml_1.xml")
        requireNotNull(resource) { "Resource not found" }

        val inputStream = resource.openStream()
        val questions = MoodleXmlParser.parse(inputStream)
        val categories = questions.getCategories()
        assertEquals(1, categories.size)
        assertEquals(2, questions.size)
    }

    @Test
    fun `sample moodle xml file 2`() {
        val resource = this::class.java.getResource("/sample_moodle_xml_2.xml")
        requireNotNull(resource) { "Resource not found" }

        val inputStream = resource.openStream()
        val questions = MoodleXmlParser.parse(inputStream)
        val categories = questions.getCategories()
        assertEquals(1, categories.size)
        assertEquals(2, questions.size)
    }

    @Test
    fun `sample moodle xml file 3`() {
        val resource = this::class.java.getResource("/sample_moodle_xml_3.xml")
        requireNotNull(resource) { "Resource not found" }

        val inputStream = resource.openStream()
        val questions = MoodleXmlParser.parse(inputStream)
        val categories = questions.getCategories()
        assertEquals(1, categories.size)
        assertEquals(7, questions.size)
    }

    @Test
    fun `parse difficulty level`() {
        val xml =
            """
            <quiz>
              <question type="category">
                <category><text>Math</text></category>
              </question>
              <question type="multichoice">
                <questiontext format="html">
                  <text>What is 2+2?</text>
                </questiontext>
                <answer fraction="100">
                  <text>4</text>
                  <feedback><text>Correct</text></feedback>
                </answer>
                <answer fraction="0">
                  <text>5</text>
                  <feedback><text>Nope</text></feedback>
                </answer>
                <difficulty>MedIUm</difficulty>
                <tags>
                  <tag><text>algebra</text></tag>
                </tags>
              </question>
              <question type="category">
                <category><text>Math</text></category>
              </question>
              <question type="multichoice">
                <questiontext format="html">
                  <text>What is 2+2?</text>
                </questiontext>
                <answer fraction="100">
                  <text>4</text>
                  <feedback><text>Correct</text></feedback>
                </answer>
                <answer fraction="0">
                  <text>5</text>
                  <feedback><text>Nope</text></feedback>
                </answer>
                <difficulty>hArD</difficulty>
                <tags>
                  <tag><text>algebra</text></tag>
                </tags>
              </question>
              <question type="multichoice">
                <questiontext format="html">
                  <text>What is 2+2?</text>
                </questiontext>
                <answer fraction="100">
                  <text>4</text>
                  <feedback><text>Correct</text></feedback>
                </answer>
                <answer fraction="0">
                  <text>5</text>
                  <feedback><text>Nope</text></feedback>
                </answer>
                <difficulty>EaSy</difficulty>
                <tags>
                  <tag><text>algebra</text></tag>
                </tags>
              </question>
            </quiz>
        """

        val questions = MoodleXmlParser.parse(xml.byteInputStream())

        var q = questions.first()
        assertEquals(DifficultyLevel.MEDIUM, q.difficultyLevel)

        q = questions.get(1)
        assertEquals(DifficultyLevel.HARD, q.difficultyLevel)

        q = questions.last()
        assertEquals(DifficultyLevel.EASY, q.difficultyLevel)
    }

    @Test
    fun `sample moodle xml base64 images`() {
        val resource =
            this::class.java.getResource("/sample_moodle_xml_base64.xml")
        requireNotNull(resource) { "Resource not found" }

        val inputStream = resource.openStream()
        val questions = MoodleXmlParser.parse(inputStream)
        val question = questions.first()

        assertEquals(question.images?.size, 2)
        assertEquals(question.text, "<p>text under img</p>")
        assertEquals(question.images?.first()?.image, "IMAGE1")
        assertEquals(question.images?.last()?.image, "IMAGE2")
    }

    @Test
    fun `sample moodle xml url images`() {
        val resource =
            this::class.java.getResource("/sample_moodle_xml_url.xml")
        requireNotNull(resource) { "Resource not found" }

        val inputStream = resource.openStream()
        val questions = MoodleXmlParser.parse(inputStream)
        val question = questions.first()

        assertEquals(question.images?.size, 1)
        assertEquals(question.text, "")
        assertEquals(question.images?.first()?.image, "http://fajne.url.jpg")
    }
}
