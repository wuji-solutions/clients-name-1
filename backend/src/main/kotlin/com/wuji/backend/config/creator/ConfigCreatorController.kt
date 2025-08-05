package com.wuji.backend.config.creator

import com.wuji.backend.config.dto.GameConfigDto
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/config")
class ConfigCreatorController(
    private val creatorService: ConfigCreatorService
) {

    @PostMapping("/create")
    fun createConfig(
        @RequestBody config: GameConfigDto
    ) {
        TODO("not yet implemented")
    }

    @GetMapping("/read/{config_name}")
    fun readConfig(
        @PathVariable("config_name") configName: String
    ) {
        TODO("not yet implemented")
    }
}