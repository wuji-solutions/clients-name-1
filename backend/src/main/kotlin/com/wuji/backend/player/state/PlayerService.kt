package com.wuji.backend.player.state

import org.springframework.stereotype.Service

@Service
class PlayerService {
    final inline fun <reified T : PlayerDetails> createPlayer(
        index: Int,
        nickname: String,
        details: T
    ): Player<T> {
        return Player(index, nickname, details)
    }
}
