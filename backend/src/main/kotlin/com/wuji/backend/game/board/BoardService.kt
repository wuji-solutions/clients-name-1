package com.wuji.backend.game.board

import com.wuji.backend.events.common.SSEEventService
import com.wuji.backend.events.common.SSEUsersService
import com.wuji.backend.game.GameRegistry
import com.wuji.backend.game.board.dto.BoardStateDto
import com.wuji.backend.game.board.dto.TileStateDto
import com.wuji.backend.game.common.GameService
import com.wuji.backend.player.dto.PlayerDto
import com.wuji.backend.player.dto.PlayerDto.Companion.toDto
import com.wuji.backend.player.state.BoardPlayer
import com.wuji.backend.player.state.BoardPlayerDetails
import com.wuji.backend.player.state.Player
import com.wuji.backend.player.state.PlayerDetails
import com.wuji.backend.player.state.PlayerService
import com.wuji.backend.player.state.exception.PlayerAlreadyJoinedException
import org.springframework.stereotype.Service

@Service
class BoardService(
    private val gameRegistry: GameRegistry,
    private val sseEventService: SSEEventService,
    private val sseUsersService: SSEUsersService,
    private val playerService: PlayerService
) : GameService {
    override fun joinGame(
        index: Int,
        nickname: String
    ): Player<out PlayerDetails> {
        if (hasJoined(index, nickname))
            throw PlayerAlreadyJoinedException(index, nickname)

        return playerService
            .createPlayer(index, nickname, BoardPlayerDetails())
            .also { player -> game.players.add(player) }
            .also { player -> game.addPlayer(player) }
            .also { sseUsersService.sendPlayers(listPlayers()) }
    }

    private val game: BoardGame
        get() = gameRegistry.getAs(BoardGame::class.java)

    override fun listPlayers(): List<PlayerDto> =
        game.players.map { player -> player.toDto() }

    override fun startGame() {
        game.start()
        sseEventService.sendGameStart()
    }

    override fun pauseGame() {
        game.pause()
    }

    override fun resumeGame() {
        game.resume()
    }

    override fun finishGame() {
        game.finish()
        sseEventService.sendGameFinish()
    }

    override fun getReport(): String {
        TODO("Not yet implemented")
    }

    override fun kickPlayer(index: Int, nickname: String) {
        TODO("Not yet implemented")
    }

    override fun hasJoined(index: Int, nickname: String): Boolean {
        TODO("Not yet implemented")
    }

    fun getBoardState(fromTileIndex: Int, toTileIndex: Int): BoardStateDto {
        val tileStateDtos =
            game.boardState
                .filter { it.key >= fromTileIndex && it.key <= toTileIndex }
                .map { stateEntry ->
                    TileStateDto(
                        stateEntry.key,
                        stateEntry.value.map { it.toDto() }.toSet())
                }
        return BoardStateDto(tileStateDtos)
    }

    fun movePlayer(player: BoardPlayer, steps: Int) {
        TODO("Not yet implemented")
    }
}
