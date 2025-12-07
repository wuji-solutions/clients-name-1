package com.wuji.backend.game.board

import com.wuji.backend.game.GameType
import com.wuji.backend.game.board.dto.BoardStateDto
import com.wuji.backend.game.board.dto.MovePlayerResponseDto
import com.wuji.backend.game.common.GameController
import com.wuji.backend.player.dto.BoardPlayerDto
import com.wuji.backend.player.dto.BoardPlayerDto.Companion.toBoardPlayerDto
import com.wuji.backend.player.dto.PlayerDto
import com.wuji.backend.security.auth.PlayerAuthService
import com.wuji.backend.security.auth.playerIndex
import com.wuji.backend.security.validator.RequiresGame
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@Validated
@RequiresGame(GameType.BOARD)
@RequestMapping("/games/board")
class BoardController(
    playerAuthService: PlayerAuthService,
    private val boardService: BoardService
) : GameController(playerAuthService) {

    override fun performJoinGame(index: Int, nickname: String) {
        boardService.joinGame(index, nickname)
    }

    @GetMapping("/player")
    override fun getPlayer(
        authentication: Authentication
    ): ResponseEntity<BoardPlayerDto> {
        val playerIndex = authentication.playerIndex()
        return ResponseEntity.ok(
            boardService
                .getPlayer(playerIndex)
                .toBoardPlayerDto(boardService.getCategories()))
    }

    @GetMapping("/state")
    fun getBoardState(): ResponseEntity<BoardStateDto> {
        return ResponseEntity.ok(boardService.getBoardState())
    }

    @PostMapping("/player/move")
    fun movePlayer(
        authentication: Authentication
    ): ResponseEntity<MovePlayerResponseDto> {
        val playerIndex = authentication.playerIndex()
        val responseDto = boardService.movePlayer(playerIndex)
        return ResponseEntity.ok(responseDto)
    }

    @GetMapping("/leaderboard")
    fun getLeaderboard(): ResponseEntity<List<PlayerDto>> {
        return ResponseEntity.ok(boardService.getLeaderboard())
    }
}
