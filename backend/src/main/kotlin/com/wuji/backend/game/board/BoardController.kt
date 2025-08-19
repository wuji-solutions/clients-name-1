package com.wuji.backend.game.board

import com.wuji.backend.game.GameType
import com.wuji.backend.game.board.dto.BoardStateDto
import com.wuji.backend.game.common.GameController
import com.wuji.backend.game.common.dto.JoinGameRequestDto
import com.wuji.backend.security.RequiresGame
import com.wuji.backend.security.auth.PlayerAuthService
import com.wuji.backend.security.auth.playerIndex
import jakarta.servlet.http.HttpServletRequest
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@Validated
@RequiresGame(gametype = GameType.BOARD)
@RequestMapping("/games/board")
class BoardController(
    private val playerAuthService: PlayerAuthService,
    private val boardService: BoardService
) : GameController {

    @PostMapping("/join")
    override fun joinGame(
        @Valid @RequestBody requestDto: JoinGameRequestDto,
        request: HttpServletRequest
    ): ResponseEntity<Any> {
        val participant =
            playerAuthService.authenticate(requestDto.index, request)
        boardService.joinGame(participant.index, participant.nickname)

        return ResponseEntity.ok(participant.nickname)
    }

    @GetMapping("/state")
    fun getBoardState(
        @RequestParam fromTileIndex: Int,
        @RequestParam toTileIndex: Int
    ): ResponseEntity<BoardStateDto> {

        return ResponseEntity.ok(
            boardService.getBoardState(fromTileIndex, toTileIndex))
    }

    @PostMapping("/player/move")
    fun movePlayer(authentication: Authentication) {
        val playerIndex = authentication.playerIndex()
    }
}
