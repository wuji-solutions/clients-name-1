package com.wuji.backend.game.common

import com.wuji.backend.game.common.dto.JoinGameRequestDto
import com.wuji.backend.player.NicknameGenerator
import jakarta.servlet.http.HttpServletRequest
import org.springframework.http.ResponseEntity
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder


interface GameController {
    fun joinGame(requestDto: JoinGameRequestDto, request: HttpServletRequest): ResponseEntity<Any>
}
