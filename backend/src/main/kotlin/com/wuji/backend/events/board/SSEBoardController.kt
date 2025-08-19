package com.wuji.backend.events.board

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter

@RestController
@RequestMapping("/sse/board")
class SSEBoardController(private val sseService: SSEBoardService) {
    @GetMapping("/new-state", produces = ["text/event-stream"])
    fun newBoardState(): SseEmitter {
        return sseService.addNewBoardStateEmitter()
    }
}
