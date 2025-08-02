package com.wuji.backend.events.quiz

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter

@RestController
@RequestMapping("/sse/quiz")
class SSEQuizController(private val sseService: SSEQuizService) {
    @GetMapping("/answer-counter", produces = ["text/event-stream"])
    fun answerCounter(): SseEmitter {
        return sseService.addAnswerCounterEmitter()
    }

    @GetMapping("/next-question", produces = ["text/event-stream"])
    fun nextQuestion(): SseEmitter {
        return sseService.addNextQuestionEmitter()
    }
}
