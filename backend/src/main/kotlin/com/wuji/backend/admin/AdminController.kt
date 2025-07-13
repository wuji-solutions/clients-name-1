package com.wuji.backend.admin

import com.wuji.backend.game.GameRegistry
import com.wuji.backend.game.quiz.QuizService
import com.wuji.backend.game.quiz.dto.QuizGameCreateRequestDto
import com.wuji.backend.security.RunningGame
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@Validated
@RequestMapping("/manage")
class AdminController(
    private val gameRegistry: GameRegistry,
    private val quizService: QuizService
) {

    @PostMapping("/quiz")
    fun createQuizGame(
        @Valid @RequestBody requestDto: QuizGameCreateRequestDto
    ): ResponseEntity<Nothing> {
        quizService.createGame(requestDto.name, requestDto.config, requestDto.questions)
        return ResponseEntity.ok().build()
    }

    @RunningGame(isRunning = true)
    @PostMapping("/start")
    fun startGame(): ResponseEntity<Nothing> {
        gameRegistry.game.start()
        return ResponseEntity.ok().build()
    }

    @RunningGame(isRunning = true)
    @PostMapping("/pause")
    fun pauseGame(): ResponseEntity<Nothing> {
        gameRegistry.game.pause()
        return ResponseEntity.ok().build()
    }

    @RunningGame(isRunning = false)
    @PostMapping("/resume")
    fun resumeGame(): ResponseEntity<Nothing> {
        gameRegistry.game.resume()
        return ResponseEntity.ok().build()
    }
}