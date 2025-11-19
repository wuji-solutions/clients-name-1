package com.wuji.backend.game.common

import com.wuji.backend.config.GameConfig
import com.wuji.backend.player.dto.PlayerDto
import com.wuji.backend.player.state.Player
import com.wuji.backend.player.state.PlayerDetails

interface GameService {
    //    fun createGame() //    TODO: how to pass args into it

    // Not sure if this is relevant as this 'GameService' is pretty much admin-only other than
    // joining game
    fun joinGame(index: Int, nickname: String): Player<out PlayerDetails>

    fun listPlayers(): List<PlayerDto>

    fun startGame()

    fun pauseGame()

    fun resumeGame()

    fun finishGame()

    fun kickPlayer(index: Int)

    fun hasJoined(index: Int): Boolean

    fun getPlayer(index: Int): Player<out PlayerDetails>

    fun getConfig(): GameConfig
}
