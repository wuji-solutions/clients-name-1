package com.wuji.backend.parser

import com.wuji.backend.config.DifficultyLevel
import com.wuji.backend.question.common.Answer
import com.wuji.backend.question.common.Question
import com.wuji.backend.question.common.QuestionType
import com.wuji.backend.question.common.TextFormat
import com.wuji.backend.question.common.TextFormat.PLAIN_TEXT
import java.io.InputStream
import javax.xml.stream.XMLInputFactory
import javax.xml.stream.XMLStreamConstants
import javax.xml.stream.XMLStreamReader
import org.hibernate.validator.internal.util.Contracts.assertNotNull

/**
 * Minimal-but-extendable Moodle XML parser implemented with StAX (no extra
 * deps).
 *
 * Supports common question fields and these types:
 * - multichoice
 * - shortanswer
 * - category (dummy question that sets current category)
 *
 * Notes:
 * - CDATA is handled by [XMLStreamReader.getElementText] automatically.
 * - Unknown/unused tags are skipped safely, so you can extend as needed.
 */
object MoodleXmlParser {

    fun parse(input: InputStream): List<Question> {
        val reader = XMLInputFactory.newFactory().createXMLStreamReader(input)
        reader.use {
            reader.requireStart("quiz")
            val questions = mutableListOf<Question>()
            var currentCategory: String? = null
            while (reader.nextTagOrEnd("quiz")) {
                if (reader.isStart("question")) {
                    val type = reader.getAttr("type")
                    when (type) {
                        "category" -> {
                            currentCategory = parseCategoryQuestion(reader)
                        }
                        else -> {
                            try {
                                questions.add(
                                    parseQuestion(
                                        reader, type, currentCategory))
                            } catch (e: UnsupportedQuestionException) {
                                println(e.message)
                            }
                        }
                    }
                } else {
                    reader.skip()
                }
            }
            return questions
        }
    }

    private fun parseCategoryQuestion(reader: XMLStreamReader): String? {
        reader.requireStart("question")
        var category: String? = null
        while (reader.nextTagOrEnd("question")) {
            when {
                reader.isStart("category") -> {
                    category = parseTextContainer(reader)
                }
                else -> reader.skip()
            }
        }
        return category
    }

    private fun parseQuestion(
        reader: XMLStreamReader,
        type: String?,
        currentCategory: String?
    ): Question {
        requireNotNull(currentCategory) {
            "no category set before a question declaration"
        }

        reader.requireStart("question")
        // Common fields
        var questionText: String? = null
        var questionTextFormat: TextFormat? = null
        var tags = listOf<String>()
        var imageUrl: String? = null
        var imageBase64: String? = null
        val answers = mutableListOf<Answer>()
        val correctAnswerIds = mutableSetOf<Int>()

        while (reader.nextTagOrEnd("question")) {
            when {
                reader.isStart("questiontext") -> {
                    val res = parseFormattedText(reader)
                    questionText = res.first
                    questionTextFormat = res.second
                }
                reader.isStart("tags") -> tags = parseTags(reader)
                reader.isStart("image") -> {
                    imageUrl = reader.readElementText().trim()
                }
                reader.isStart("image_base64") -> {
                    imageBase64 = reader.readElementText().trim()
                }
                reader.isStart("answer") -> {
                    val (answer, isCorrect) = parseAnswer(reader)
                    answers.add(answer)
                    if (isCorrect) correctAnswerIds.add(answer.id)
                }

                else -> reader.skip()
            }
        }
        val questionType: QuestionType =
            when (type) {
                "multichoice",
                "shortanswer" -> QuestionType.TEXT
                else -> throw UnsupportedQuestionException(type)
            }

        assertNotNull(
            questionTextFormat,
            "no question text format set during a question declaration")
        assertNotNull(
            questionText, "no question text set during a question declaration")

        return Question.create(
            currentCategory,
            questionType,
            questionText!!,
            questionTextFormat!!,
            answers,
            correctAnswerIds,
            DifficultyLevel.EASY,
            imageUrl,
            imageBase64,
            tags)
    }

    private fun parseAnswer(reader: XMLStreamReader): Pair<Answer, Boolean> {
        reader.requireStart("answer")
        val fraction = reader.getAttr("fraction")?.toIntOrNull()
        var text: String? = null
        var fb: String? = null
        while (reader.nextTagOrEnd("answer")) {
            when {
                reader.isStart("text") -> text = reader.readElementText()
                reader.isStart("feedback") -> fb = parseTextContainer(reader)
                else -> reader.skip()
            }
        }
        if (text != null) {
            return Answer.create(text, fb) to (fraction != null && fraction > 0)
        }
        throw IllegalStateException(
            "There is no answer text set when declaring answer")
    }

    private fun parseTags(reader: XMLStreamReader): MutableList<String> {
        val out = mutableListOf<String>()
        reader.requireStart("tags")
        while (reader.nextTagOrEnd("tags")) {
            if (reader.isStart("tag")) {
                out += parseTextContainer(reader)
            } else reader.skip()
        }
        return out
    }

    private fun parseTextContainer(reader: XMLStreamReader): String {
        // Format: <container><text>value</text></container>
        val containerName = reader.localName
        var value = ""
        while (reader.nextTagOrEnd(containerName)) {
            if (reader.isStart("text")) value = reader.readElementText()
            else reader.skip()
        }
        return value
    }

    private fun parseFormattedText(
        reader: XMLStreamReader
    ): Pair<String, TextFormat> {
        val container = reader.localName // e.g. questiontext, feedback
        val format = TextFormat.from(reader.getAttr("format"))
        var content = ""
        while (reader.nextTagOrEnd(container)) {
            if (reader.isStart("text")) content = reader.readElementText()
            else reader.skip()
        }
        return content to format
    }

    private fun XMLStreamReader.getAttr(name: String): String? =
        (0 until attributeCount)
            .firstOrNull { getAttributeLocalName(it) == name }
            ?.let { getAttributeValue(it) }

    private fun XMLStreamReader.isStart(local: String) =
        eventType == XMLStreamConstants.START_ELEMENT && localName == local

    private fun XMLStreamReader.readElementText(): String = elementText

    private fun XMLStreamReader.requireStart(local: String) {
        // advance to first start if needed
        if (eventType == XMLStreamConstants.START_DOCUMENT) {
            while (hasNext()) {
                val t = next()
                if (t == XMLStreamConstants.START_ELEMENT) break
            }
        }
        check(
            eventType == XMLStreamConstants.START_ELEMENT &&
                localName == local) {
                "Expected <$local> but found $localName ($eventType)"
            }
    }

    /**
     * Move to next START_ELEMENT inside the given parent, or return false when
     * reaching the end tag of parent.
     */
    private fun XMLStreamReader.nextTagOrEnd(parentLocal: String): Boolean {
        while (hasNext()) {
            val t = next()
            when (t) {
                XMLStreamConstants.START_ELEMENT -> return true
                XMLStreamConstants.END_ELEMENT ->
                    if (localName == parentLocal) return false
            }
        }
        return false
    }

    /** Skip current element subtree (assumes at START_ELEMENT). */
    private fun XMLStreamReader.skip() {
        if (eventType != XMLStreamConstants.START_ELEMENT) return
        var depth = 1
        while (hasNext() && depth > 0) {
            when (next()) {
                XMLStreamConstants.START_ELEMENT -> depth++
                XMLStreamConstants.END_ELEMENT -> depth--
            }
        }
    }

    private inline fun <T> XMLStreamReader.use(
        block: (XMLStreamReader) -> T
    ): T {
        try {
            return block(this)
        } finally {
            try {
                close()
            } catch (_: Exception) {
                println("Failed to close XMLStreamReader")
            }
        }
    }

    fun TextFormat.Companion.from(attr: String?): TextFormat =
        when (attr?.lowercase()) {
            "html",
            "moodle_auto_format" ->
                TextFormat
                    .HTML // TODO: testing? prob should get a moodle question file from some
            // professor
            "plain_text" -> PLAIN_TEXT
            "markdown" -> TextFormat.MARKDOWN
            else -> TextFormat.HTML
        }
}
