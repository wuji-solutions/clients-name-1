package com.wuji.backend.game.common

import com.wuji.backend.game.common.dto.JoinGameRequestDto
import com.wuji.backend.player.dto.PlayerDto
import jakarta.servlet.http.HttpServletRequest
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@Validated
@RequestMapping("/games/{game}")
interface GameController {
    fun joinGame(
        @Valid @RequestBody requestDto: JoinGameRequestDto,
        request: HttpServletRequest
    ): ResponseEntity<Any>

    fun getPlayer(authentication: Authentication): ResponseEntity<PlayerDto>
}
