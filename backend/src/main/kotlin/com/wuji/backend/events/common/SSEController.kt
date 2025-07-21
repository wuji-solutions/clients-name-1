package com.wuji.backend.events.common

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter

@RestController
class SSEController(private val sseUsersService: SSEUsersService) {

    @GetMapping("/sse/users")
    fun streamEvents(): SseEmitter {
        return sseUsersService.addEmitter()
    }

}