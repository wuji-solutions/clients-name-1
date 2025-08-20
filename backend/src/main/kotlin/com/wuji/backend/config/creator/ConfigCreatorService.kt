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
import org.springframework.stereotype.Service

@Service
class ConfigCreatorService() {

    val mapper: ObjectMapper = jacksonObjectMapper()
    var configPath: String =
        "." // need to have a discussion where to store config files

    fun readConfig(
        type: GameType,
        name: String,
    ): GameConfigDto {
        val catalog: String
        val clazz: Class<out GameConfigDto> =
            when (type) {
                GameType.QUIZ -> {
                    catalog = "quiz"
                    QuizConfigDto::class.java
                }
                GameType.EXAM -> {
                    catalog = "exam"
                    ExamConfigDto::class.java
                }
                GameType.BOARD -> {
                    catalog = "board"
                    BoardConfigDto::class.java
                }
            }

        val dir = File("$configPath/$catalog")
        if (!dir.exists() || !dir.isDirectory) {
            throw FileNotFoundException(
                "Katalog konfiguracji $catalog nie istnieje.")
        }

        val file = File(dir, name)
        if (!file.exists() || !file.isFile) {
            throw FileNotFoundException(
                "Plik konfiguracyjny $name nie istnieje w katalogu $catalog.")
        }

        return mapper.readValue(file, clazz)
    }

    fun <T : GameConfigDto> createConfig(
        config: T,
        name: String,
    ) {
        val catalog =
            when (config::class) {
                QuizConfigDto::class -> "quiz"
                BoardConfigDto::class -> "board"
                ExamConfigDto::class -> "exam"
                else ->
                    throw IllegalArgumentException(
                        "Nieobsługiwany typ konfiguracji: ${config::class}")
            }

        val dir = File("$configPath/$catalog")
        if (!dir.exists()) {
            dir.mkdirs()
        }

        val file = File(dir, name)
        mapper.writeValue(file, config)
    }

    fun listConfigs(type: GameType): List<String> {
        val catalog =
            when (type) {
                GameType.QUIZ -> "quiz"
                GameType.EXAM -> "exam"
                GameType.BOARD -> "board"
            }
        val dir = File("$configPath/$catalog")
        if (!dir.exists() || !dir.isDirectory) {
            throw FileNotFoundException(
                "Katalog $configPath/$catalog nie istnieje lub nie jest katalogiem.")
        }
        return dir.listFiles()?.filter { it.isFile }?.map { it.name }
            ?: emptyList()
    }

    fun deleteConfig(type: GameType, name: String): Boolean {
        val catalog: String =
            when (type) {
                GameType.QUIZ -> "quiz"
                GameType.EXAM -> "exam"
                GameType.BOARD -> "board"
            }
        val dir = File("$configPath/$catalog")
        return File(dir, name).delete()
    }
}
