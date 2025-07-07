package com.wuji.backend.events

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter

@RestController
class SSEController(private val sseService: SSEService) {

    @GetMapping("/sse")
    fun streamEvents(): SseEmitter {
        return sseService.addEmitter()
    }
}
