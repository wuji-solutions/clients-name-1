package com.wuji.backend.player.state

import com.wuji.backend.player.NicknameGenerator
import org.springframework.stereotype.Service

@Service
class PlayerService {
    final fun <T : PlayerDetails> createPlayer(
        index: Int,
        details: T
    ): Player<T> {
        return Player(index, NicknameGenerator.generateRandom(), details)
    }
}
