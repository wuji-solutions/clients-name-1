package com.wuji.backend.game.quiz

import com.wuji.backend.game.common.Question
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/game/quiz")
class QuizController(private val quizService: QuizService) {

    @GetMapping("/questions/{questionId}")
    fun getQuestion(@PathVariable questionId: Int): ResponseEntity<Question> {
        return ResponseEntity.ok(quizService.getNthQuestion(questionId))
    }
}
