package com.wuji.backend.player.state

import org.springframework.stereotype.Service

@Service
class PlayerService {
    final inline fun <reified T : PlayerDetails> createPlayer(
        index: Any,
        nickname: Any,
        details: T
    ): Player<T> {
        if (index !is Int)
            throw IllegalArgumentException("Index ucznia powinien byc numerem")
        return Player(index, nickname as String, details)
    }
}
