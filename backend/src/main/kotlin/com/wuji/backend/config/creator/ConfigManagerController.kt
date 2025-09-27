package com.wuji.backend.config.creator

import com.wuji.backend.config.dto.GameConfigDto
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
class ConfigManagerController(
    private val creatorService: ConfigManagerService = ConfigManagerService(),
) {

    @PostMapping("/{type}/{config_name}")
    fun createConfig(
        @RequestBody configDto: GameConfigDto,
        @PathVariable("config_name") configName: String,
        @PathVariable("type") type: GameType,
    ): ResponseEntity<String> {
        creatorService.createConfig(configDto, type, configName)

        return ResponseEntity.ok("Config $configName utworzony pomyślnie")
    }

    @GetMapping("/{type}/{config_name}")
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

    @DeleteMapping("/{type}/{config_name}")
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
