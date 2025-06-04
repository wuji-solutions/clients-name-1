package com.wuji.backend.player.state

import com.wuji.backend.player.state.exception.PlayerDataStorageCorruptionException
import org.springframework.stereotype.Service

@Service
class PlayerStateService {

    final inline fun <reified T : PlayerStateDetails> createPlayerState(
        index: Any,
        nickname: Any,
        details: T
    ): PlayerState<T> {
        if (index !is Int) throw IllegalArgumentException("Index ucznia powinien byc numerem")
        return PlayerState(index, nickname as String, details)
    }
    final inline fun <reified T : PlayerStateDetails> getPlayerState(uncastPlayerState: Any): PlayerState<T> {
        return uncastPlayerState.castToPlayerState<T>()
    }

    final inline fun <reified T : PlayerStateDetails> updatePlayerState(
        uncastPlayerState: Any,
        callback: (PlayerState<T>) -> Unit
    ): PlayerState<T> {
        return uncastPlayerState.castToPlayerState<T>().also(callback)
    }

    @Suppress("UNCHECKED_CAST")
    final inline fun <reified T : PlayerStateDetails> Any.castToPlayerState(): PlayerState<T> {
        if (this !is PlayerState<*>) throw PlayerDataStorageCorruptionException()
        if (this.details !is T) throw PlayerDataStorageCorruptionException()

        return this as PlayerState<T>
    }
}
