package com.wuji.backend.events.quiz

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter

@RestController
class SSEQuizController(private val sseService: SSEQuizAnswerCounterService) {
    @GetMapping("/sse/answer-counter")
    fun streamEvents(): SseEmitter {
        return sseService.addEmitter()
    }
}
