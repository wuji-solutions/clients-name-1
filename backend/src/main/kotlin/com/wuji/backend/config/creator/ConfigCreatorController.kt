package com.wuji.backend.config.creator

import com.wuji.backend.config.dto.BoardConfigDto
import com.wuji.backend.config.dto.ExamConfigDto
import com.wuji.backend.config.dto.GameConfigDto
import com.wuji.backend.config.dto.toBoardConfig
import com.wuji.backend.config.dto.toExamConfig
import com.wuji.backend.config.dto.toQuizConfig
import com.wuji.backend.game.GameType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/config")
class ConfigCreatorController(
    private val creatorService: ConfigCreatorService = ConfigCreatorService(),
) {

    @PostMapping("/create/{config_name}")
    fun createConfig(
        @RequestBody configDto: GameConfigDto,
        @PathVariable("config_name") configName: String
    ): ResponseEntity<String> {
        val config = when (configDto) {
            is ExamConfigDto -> configDto.toExamConfig()
            is BoardConfigDto -> configDto.toBoardConfig()
            else -> configDto.toQuizConfig()
        }
        creatorService.createConfig(config, configName)

        return ResponseEntity.ok("Config $configName utworzony pomyślnie")
    }

    @GetMapping("/read/{type}/{config_name}")
    fun readConfig(
        @PathVariable("config_name") configName: String,
        @PathVariable("type") type: GameType,
    ): ResponseEntity<GameConfigDto> {
        return ResponseEntity.ok(creatorService.readConfig(type, configName))
    }

    @GetMapping("/list/{type}")
    fun listConfig(
        @PathVariable("type") type: GameType,
    ): ResponseEntity<List<String>> {
        return ResponseEntity.ok(creatorService.listConfigs(type))
    }

    @DeleteMapping("/delete/{type}/{config_name}")
    fun deleteConfig(
        @PathVariable("config_name") configName: String,
        @PathVariable("type") type: GameType,
    ): ResponseEntity<Boolean> {
        return if (creatorService.deleteConfig(type, configName)) {
            ResponseEntity.ok().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }
}