package com.wuji.backend.game.common

import com.wuji.backend.player.state.Player
import com.wuji.backend.player.state.PlayerDetails

interface GameService {
    //    fun createGame() //    TODO: how to pass args into it

    // Not sure if this is relevant as this 'GameService' is pretty much admin-only other than joining game
    fun joinGame(index: Any, nickname: Any): Player<out PlayerDetails>
    fun startGame()
    fun pauseGame()
    fun resumeGame()
    fun stopGame()
    fun getRaport(): String
}