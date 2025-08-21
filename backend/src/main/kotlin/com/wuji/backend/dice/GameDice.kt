package com.wuji.backend.dice

import com.wuji.backend.player.state.Player
import com.wuji.backend.player.state.PlayerDetails

interface GameDice<PlayerT : Player<out PlayerDetails>> {
    fun roll(
        player: PlayerT,
    ): Int
}
