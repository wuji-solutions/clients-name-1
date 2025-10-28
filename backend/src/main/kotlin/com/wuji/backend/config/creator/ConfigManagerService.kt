package com.wuji.backend.config.creator

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.wuji.backend.config.dto.BoardConfigDto
import com.wuji.backend.config.dto.ExamConfigDto
import com.wuji.backend.config.dto.GameConfigDto
import com.wuji.backend.config.dto.QuizConfigDto
import com.wuji.backend.game.GameType
import java.io.File
import java.io.FileNotFoundException
import java.nio.file.Path
import java.nio.file.Paths
import org.springframework.stereotype.Service

@Service
class ConfigManagerService(
    private val mapper: ObjectMapper = jacksonObjectMapper(),
    private var configPath: String =
        resolveGlobalConfigPath().toAbsolutePath().toString()
) {

    companion object {
        private const val CONFIG_DIR_NAME = "Konfiguracje"

        fun resolveGlobalConfigPath(): Path {
            val os = System.getProperty("os.name").lowercase()
            return when {
                os.contains("win") ->
                    Paths.get(
                        System.getenv("ProgramData") ?: "C:\\ProgramData",
                        CONFIG_DIR_NAME)

                os.contains("mac") ->
                    Paths.get("/Library/Application Support", CONFIG_DIR_NAME)

                os.contains("nux") ->
                    Paths.get(System.getProperty("user.home"), CONFIG_DIR_NAME)

                else ->
                    Paths.get(System.getProperty("user.home"), CONFIG_DIR_NAME)
            }
        }
    }

    init {
        val baseDir = File(configPath)
        baseDir.mkdirs()

        listOf("quiz", "exam", "board").forEach { subDir ->
            File(baseDir, subDir).mkdirs()
        }
    }

    fun readConfig(type: GameType, name: String): GameConfigDto {
        val dir = File(configPath, getCatalogFromGameType(type))

        if (!dir.exists() || !dir.isDirectory) {
            throw FileNotFoundException(
                "Katalog konfiguracji ${dir.path} nie istnieje.")
        }

        val file = File(dir, addExtension(name))
        if (!file.exists() || !file.isFile) {
            throw FileNotFoundException(
                "Plik konfiguracyjny $name nie istnieje w katalogu ${dir.path}.")
        }

        return mapper.readValue(file, getClassFromGameType(type))
    }

    fun <T : GameConfigDto> createConfig(
        config: T,
        type: GameType,
        name: String
    ) {
        val dir = File(configPath, getCatalogFromGameType(type))
        dir.mkdirs()

        val file = File(dir, addExtension(name))
        mapper.writeValue(file, config)
    }

    fun listConfigs(type: GameType): List<String> {
        val dir = File(configPath, getCatalogFromGameType(type))

        if (!dir.exists() || !dir.isDirectory) {
            throw FileNotFoundException(
                "Katalog ${dir.path} nie istnieje lub nie jest katalogiem.")
        }

        return dir.listFiles()
            ?.filter { it.isFile }
            ?.map { it.nameWithoutExtension } ?: emptyList()
    }

    fun deleteConfig(type: GameType, name: String): Boolean {
        val dir = File(configPath, getCatalogFromGameType(type))
        return File(dir, addExtension(name)).delete()
    }

    private fun getCatalogFromGameType(type: GameType): String =
        when (type) {
            GameType.QUIZ -> "quiz"
            GameType.EXAM -> "exam"
            GameType.BOARD -> "board"
        }

    private fun getClassFromGameType(type: GameType): Class<out GameConfigDto> =
        when (type) {
            GameType.QUIZ -> QuizConfigDto::class.java
            GameType.EXAM -> ExamConfigDto::class.java
            GameType.BOARD -> BoardConfigDto::class.java
        }

    private fun addExtension(name: String) = "$name.json"
}
