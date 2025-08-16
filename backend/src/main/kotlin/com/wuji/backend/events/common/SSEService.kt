package com.wuji.backend.events.common

import com.wuji.backend.events.common.dto.PlayerListEvent
import com.wuji.backend.events.common.dto.SSEEvent
import com.wuji.backend.player.dto.PlayerDto
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.CopyOnWriteArrayList
import org.springframework.stereotype.Service
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter

open class SSEService {

    private val channelToEmitters =
        ConcurrentHashMap<String, CopyOnWriteArrayList<SseEmitter>>()

    fun addEmitter(channel: String): SseEmitter {
        val emitter = SseEmitter(Long.MAX_VALUE)
        val emitters =
            channelToEmitters.computeIfAbsent(channel) {
                CopyOnWriteArrayList()
            }

        emitters.add(emitter)

        emitter.onCompletion { emitters.remove(emitter) }
        emitter.onTimeout { emitters.remove(emitter) }
        emitter.onError {
            emitters.remove(emitter)
            emitter.completeWithError(it)
        }

        return emitter
    }

    fun sendEvent(channel: String, sseEvent: SSEEvent) {
        val emitters = channelToEmitters[channel] ?: return
        val deadEmitters = mutableListOf<SseEmitter>()

        emitters.forEach { emitter ->
            try {
                emitter.send(
                    SseEmitter.event().name(sseEvent.name).data(sseEvent.data))
            } catch (_: Exception) {
                deadEmitters.add(emitter)
            }
        }

        emitters.removeAll(deadEmitters)
    }
}

@Service
class SSEUsersService : SSEService() {
    fun sendPlayers(data: Collection<PlayerDto>) {
        sendEvent(PLAYER_LIST_CHANNEL, PlayerListEvent(data))
    }
}
