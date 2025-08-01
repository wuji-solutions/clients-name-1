package com.wuji.backend.events.common

import com.wuji.backend.player.state.Player
import com.wuji.backend.player.state.PlayerDetails
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.CopyOnWriteArrayList
import org.springframework.stereotype.Service
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter

open class SSEService {

    private val emitterMap =
        ConcurrentHashMap<String, CopyOnWriteArrayList<SseEmitter>>()

    fun addEmitter(channel: String): SseEmitter {
        val emitter = SseEmitter(Long.MAX_VALUE)
        val emitters =
            emitterMap.computeIfAbsent(channel) { CopyOnWriteArrayList() }

        emitters.add(emitter)

        emitter.onCompletion { emitters.remove(emitter) }
        emitter.onTimeout { emitters.remove(emitter) }
        emitter.onError {
            emitters.remove(emitter)
            emitter.completeWithError(it)
        }

        return emitter
    }

    fun sendEvent(channel: String, data: Any) {
        val emitters = emitterMap[channel] ?: return
        val deadEmitters = mutableListOf<SseEmitter>()

        emitters.forEach { emitter ->
            try {
                emitter.send(SseEmitter.event().data(data))
            } catch (_: Exception) {
                deadEmitters.add(emitter)
            }
        }

        emitters.removeAll(deadEmitters)
    }
}

@Service
class SSEUsersService : SSEService() {
    fun sendPlayersList(data: Set<Player<PlayerDetails>>) {
        sendEvent("users", data)
    }
}
