package com.wuji.backend.admin

import com.wuji.backend.game.GameRegistry
import com.wuji.backend.game.common.GameServiceDelegate
import com.wuji.backend.game.quiz.QuizService
import com.wuji.backend.game.quiz.dto.QuizGameCreateRequestDto
import com.wuji.backend.player.dto.PlayerDto
import com.wuji.backend.security.GameCreated
import com.wuji.backend.security.GamePaused
import com.wuji.backend.security.GameRunning
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

@RestController
@Validated
@RequestMapping("/manage")
class AdminController(
    private val gameRegistry: GameRegistry,
    private val quizService: QuizService,
    private val gameServiceDelegate: GameServiceDelegate
) {

    @PostMapping("/quiz")
    fun createQuizGame(
        @Valid @RequestBody requestDto: QuizGameCreateRequestDto
    ): ResponseEntity<Nothing> {
        quizService.createGame(
            requestDto.name, requestDto.config, requestDto.questions
        )
        return ResponseEntity.ok().build()
    }

    @GetMapping("/players")
    fun listPlayers(): List<PlayerDto> {
        return gameServiceDelegate.listPlayers()
    }

    @GameCreated
    @PostMapping("/start")
    fun startGame(): ResponseEntity<Nothing> {
        gameRegistry.game.start()
        return ResponseEntity.ok().build()
    }

    @GameRunning
    @PostMapping("/pause")
    fun pauseGame(): ResponseEntity<Nothing> {
        gameRegistry.game.pause()
        return ResponseEntity.ok().build()
    }

    @GamePaused
    @PostMapping("/resume")
    fun resumeGame(): ResponseEntity<Nothing> {
        gameRegistry.game.resume()
        return ResponseEntity.ok().build()
    }
}
