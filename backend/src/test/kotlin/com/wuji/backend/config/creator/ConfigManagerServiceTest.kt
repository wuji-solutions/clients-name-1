package com.wuji.backend.config.creator

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.wuji.backend.config.dto.QuizConfigDto
import com.wuji.backend.game.GameType
import java.io.File
import java.io.FileNotFoundException
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlin.test.assertFalse
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.io.TempDir

class ConfigManagerServiceTest {
    private lateinit var service: ConfigManagerService
    private lateinit var mapper: ObjectMapper
    @TempDir private lateinit var tempDir: File

    @BeforeEach
    fun setup() {
        mapper = jacksonObjectMapper()
        service =
            ConfigManagerService(
                mapper = jacksonObjectMapper(),
                configPath = tempDir.absolutePath)
    }

    @Test
    fun `createConfig should successfully create a new config`() {
        val config =
            QuizConfigDto(
                totalDurationMinutes = 10,
                questionFilePath = "question.xml",
                questionDurationSeconds = 5,
                endImmediatelyAfterTime = true)
        service.createConfig(config, GameType.QUIZ, "quiz")
        val file = File(tempDir, "quiz/quiz.json")
        assertTrue(file.exists())
        val content = file.readText()
        assertTrue(content.contains("totalDurationMinutes"))
        assertTrue(content.contains("questionFilePath"))
        assertTrue(content.contains("questionDurationSeconds"))
        assertTrue(content.contains("endImmediatelyAfterTime"))
    }

    @Test
    fun `readConfig should load existing quiz config`() {
        val config =
            QuizConfigDto(
                totalDurationMinutes = 15,
                questionFilePath = "questions.xml",
                questionDurationSeconds = 10,
                endImmediatelyAfterTime = false)

        val file = File(tempDir, "quiz/quiz.json")
        file.parentFile.mkdirs()
        mapper.writeValue(file, config)

        val result = service.readConfig(GameType.QUIZ, "quiz")

        assertEquals(config.totalDurationMinutes, result.totalDurationMinutes)
        assertEquals(config.questionFilePath, result.questionFilePath)
        assertEquals(
            config.questionDurationSeconds, result.questionDurationSeconds)
        assertEquals(
            config.endImmediatelyAfterTime, result.endImmediatelyAfterTime)
    }

    @Test
    fun `listConfigs should return config file names`() {
        val dir = File(tempDir, "exam")
        dir.mkdirs()
        File(dir, "exam1.json").writeText("{}")
        File(dir, "exam2.json").writeText("{}")

        val result = service.listConfigs(GameType.EXAM)

        assertEquals(setOf("exam1", "exam2"), result.toSet())
    }

    @Test
    fun `deleteConfig should remove file and return true`() {
        val dir = File(tempDir, "board")
        dir.mkdirs()
        val file = File(dir, "board1.json")
        file.writeText("{}")

        val deleted = service.deleteConfig(GameType.BOARD, "board1")

        assertTrue(deleted)
        assertFalse(file.exists(), "File should be deleted")
    }

    @Test
    fun `readConfig should throw FileNotFoundException when file missing`() {
        val exception =
            assertFailsWith<FileNotFoundException> {
                service.readConfig(GameType.QUIZ, "not_exists")
            }
        assertTrue(exception.message!!.contains("nie istnieje"))
    }

    @Test
    fun `readConfig should throw FileNotFoundException when catalog missing`() {
        val catalogDir = File(tempDir, "exam")
        if (catalogDir.exists()) {
            catalogDir.deleteRecursively()
        }

        assertFailsWith<FileNotFoundException> {
            service.readConfig(GameType.EXAM, "exam1.json")
        }
    }

    @Test
    fun `readConfig should throw FileNotFoundException when file missing in existing catalog`() {
        val catalogDir = File(tempDir, "quiz")
        catalogDir.mkdirs()

        val exception =
            assertFailsWith<FileNotFoundException> {
                service.readConfig(GameType.QUIZ, "missing.json")
            }
        assertTrue(exception.message!!.contains("missing.json"))
    }

    @Test
    fun `listConfigs should throw FileNotFoundException when catalog missing`() {
        val catalogDir = File(tempDir, "board")
        if (catalogDir.exists()) {
            catalogDir.deleteRecursively()
        }

        assertFailsWith<FileNotFoundException> {
            service.listConfigs(GameType.BOARD)
        }
    }
}
