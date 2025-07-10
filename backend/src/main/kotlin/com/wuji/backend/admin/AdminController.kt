package com.wuji.backend.admin

import com.wuji.backend.game.quiz.QuizService
import com.wuji.backend.game.quiz.dto.QuizGameCreateRequestDto
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@Validated
@RequestMapping("/manage")
class AdminController(
    private val quizService: QuizService
) {

    @PostMapping("/create/quiz")
    fun createQuizGame(
        @Valid @RequestBody requestDto: QuizGameCreateRequestDto,
        authentication: Authentication?,
    ): ResponseEntity<Any> {
        quizService.createGame(requestDto.name, requestDto.config, requestDto.questions)
        return ResponseEntity.ok().build()
    }
}