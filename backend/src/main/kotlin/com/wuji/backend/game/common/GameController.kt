package com.wuji.backend.game.common

import com.wuji.backend.game.common.dto.JoinGameRequestDto
import com.wuji.backend.player.dto.IPlayerDto
import com.wuji.backend.player.state.exception.PlayerAlreadyJoinedException
import com.wuji.backend.security.auth.PlayerAuthService
import jakarta.servlet.http.HttpServletRequest
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@Validated
@RequestMapping("/games/{game}")
abstract class GameController(
    private val playerAuthService: PlayerAuthService
) {

    protected abstract fun performJoinGame(index: Int, nickname: String)

    @PostMapping("/join")
    fun joinGame(
        @Valid @RequestBody requestDto: JoinGameRequestDto,
        request: HttpServletRequest
    ): ResponseEntity<Any> {
        val participant =
            playerAuthService.authenticate(requestDto.index, request)
        try {
            performJoinGame(participant.index, participant.nickname)
        } catch (e: PlayerAlreadyJoinedException) {
            playerAuthService.removeAuthentication(participant.nickname)
            throw e
        }
        return ResponseEntity.ok(participant.nickname)
    }

    abstract fun getPlayer(
        authentication: Authentication
    ): ResponseEntity<out IPlayerDto>
}
