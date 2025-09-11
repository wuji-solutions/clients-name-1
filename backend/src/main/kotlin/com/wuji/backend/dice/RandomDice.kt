package com.wuji.backend.dice

import com.wuji.backend.player.state.BoardPlayer
import kotlin.random.Random

class RandomDice : GameDice<BoardPlayer> {
    override fun roll(player: BoardPlayer): Int {
        return Random.nextInt(1,7)
    }
}
