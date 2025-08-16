package com.wuji.backend.events.common

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter

@RestController
@RequestMapping("/sse")
class SSEEventController(private val sseService: SSEEventService) {
    @GetMapping("/events", produces = ["text/event-stream"])
    fun events(): SseEmitter {
        return sseService.addEventsEmitter()
    }
}
