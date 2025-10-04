package com.wuji.backend.events.exam

import com.wuji.backend.security.IsAdmin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter

@RestController
@RequestMapping("/sse/exam")
class SSEExamController(private val sseService: SSEExamService) {
    @IsAdmin
    @GetMapping("/admin-events", produces = ["text/event-stream"])
    fun newBoardState(): SseEmitter = sseService.addAdminEventsEmitter()
}
