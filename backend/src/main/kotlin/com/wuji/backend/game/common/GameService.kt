package com.wuji.backend.game.common

import com.wuji.backend.player.state.Player
import com.wuji.backend.player.state.PlayerDetails

interface GameService {
    //    fun createGame() //    TODO: how to pass args into it
    fun joinGame(index: Any, nickname: Any): Player<out PlayerDetails>
    fun startGame()
    fun pauseGame()
    fun resumeGame()
    fun stopGame()
    fun getRaport(): String
}