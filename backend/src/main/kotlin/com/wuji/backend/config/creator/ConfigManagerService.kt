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
class ConfigManagerService() {
    val pattern = Regex("^[a-zA-Z0-9]+\\.json$")
    val mapper: ObjectMapper = jacksonObjectMapper()
    var configPath: String =
        "." // need to have a discussion where to store config files

    fun readConfig(
        type: GameType,
        name: String,
    ): GameConfigDto {
        val catalog = getCatalogFromGameType(type)
        val clazz = getClassFromGameType(type)

        val dir = File(getPath(catalog))
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
        require(checkFileName(name))
        val catalog = getCatalogFromDtoClass(config)

        val dir = File(getPath(catalog))
        if (!dir.exists()) {
            dir.mkdirs()
        }

        val file = File(dir, name)
        mapper.writeValue(file, config)
    }

    fun listConfigs(type: GameType): List<String> {
        val catalog = getCatalogFromGameType(type)
        val dir = File(getPath(catalog))
        if (!dir.exists() || !dir.isDirectory) {
            throw FileNotFoundException(
                "Katalog $configPath/$catalog nie istnieje lub nie jest katalogiem.")
        }
        return dir.listFiles()?.filter { it.isFile }?.map { it.name }
            ?: emptyList()
    }

    fun deleteConfig(type: GameType, name: String): Boolean {
        val catalog = getCatalogFromGameType(type)
        val dir = File(getPath(catalog))
        return File(dir, name).delete()
    }

    private fun getCatalogFromGameType(type: GameType): String {
        return when (type) {
            GameType.QUIZ -> "quiz"
            GameType.EXAM -> "exam"
            GameType.BOARD -> "board"
        }
    }

    private fun <T : GameConfigDto> getCatalogFromDtoClass(config: T): String {
        return when (config::class) {
            QuizConfigDto::class -> "quiz"
            BoardConfigDto::class -> "board"
            ExamConfigDto::class -> "exam"
            else ->
                throw IllegalArgumentException(
                    "Nieobsługiwany typ konfiguracji: ${config::class}")
        }
    }

    private fun getClassFromGameType(type: GameType): Class<out GameConfigDto> {
        return when (type) {
            GameType.QUIZ -> QuizConfigDto::class.java
            GameType.EXAM -> ExamConfigDto::class.java
            GameType.BOARD -> BoardConfigDto::class.java
        }
    }

    private fun checkFileName(name: String) = pattern.matches(name)
    private fun getPath(catalog: String) = "$configPath/$catalog"
}
