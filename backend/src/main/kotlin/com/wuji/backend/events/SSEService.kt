package com.wuji.backend.events

import java.util.concurrent.CopyOnWriteArrayList
import org.springframework.stereotype.Service
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter

@Service
class SSEService {
    private val emitters = CopyOnWriteArrayList<SseEmitter>()

    fun addEmitter(): SseEmitter {
        val emitter = SseEmitter(Long.MAX_VALUE)

        emitters.add(emitter)

        emitter.onCompletion { emitters.remove(emitter) }
        emitter.onTimeout { emitters.remove(emitter) }
        emitter.onError { emitters.remove(emitter) }

        return emitter
    }

    fun sendEvent(data: Any) {
        val deadEmitters = mutableListOf<SseEmitter>()

        emitters.forEach { emitter ->
            try {
                emitter.send(SseEmitter.event().data(data))
            } catch (ex: Exception) {
                deadEmitters.add(emitter)
            }
        }

        emitters.removeAll(deadEmitters)
    }
}
