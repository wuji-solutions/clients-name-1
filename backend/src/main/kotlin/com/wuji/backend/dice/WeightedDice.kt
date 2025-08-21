package com.wuji.backend.dice

import com.wuji.backend.player.state.BoardPlayer
import kotlin.random.Random

class WeightedDice : GameDice<BoardPlayer> {
    override fun roll(player: BoardPlayer): Int {
        // TODO: implement
        return Random.nextInt(4)
    }
}
