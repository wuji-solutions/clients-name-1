package com.wuji.backend.admin

import com.wuji.backend.config.dto.toQuizConfig
import com.wuji.backend.game.common.GameServiceDelegate
import com.wuji.backend.game.quiz.QuizService
import com.wuji.backend.game.quiz.dto.QuizGameCreateRequestDto
import com.wuji.backend.player.dto.PlayerDto
import com.wuji.backend.security.GameCreated
import com.wuji.backend.security.GamePaused
import com.wuji.backend.security.GameRunning
import com.wuji.backend.security.IsAdmin
import com.wuji.backend.security.auth.PlayerAuthService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

@RestController
@Validated
@IsAdmin
@RequestMapping("/manage")
class AdminController(
    private val quizService: QuizService,
    private val gameServiceDelegate: GameServiceDelegate,
    private val authService: PlayerAuthService
) {

    @PostMapping("/quiz")
    fun createQuizGame(
        @Valid @RequestBody requestDto: QuizGameCreateRequestDto
    ): ResponseEntity<Nothing> {
        quizService.createGame(
            requestDto.name,
            requestDto.config.toQuizConfig(),
            requestDto.questions)
        return ResponseEntity.ok().build()
    }

    @GetMapping("/players")
    fun listPlayers(): ResponseEntity<List<PlayerDto>> {
        return ResponseEntity.ok(gameServiceDelegate.listPlayers())
    }

    @GameCreated
    @PostMapping("/start")
    fun startGame(): ResponseEntity<Nothing> {
        gameServiceDelegate.startGame()
        return ResponseEntity.ok().build()
    }

    @GameRunning
    @PostMapping("/pause")
    fun pauseGame(): ResponseEntity<Nothing> {
        gameServiceDelegate.pauseGame()
        return ResponseEntity.ok().build()
    }

    @GamePaused
    @PostMapping("/resume")
    fun resumeGame(): ResponseEntity<Nothing> {
        gameServiceDelegate.resumeGame()
        return ResponseEntity.ok().build()
    }

    @PostMapping("/finish")
    fun finishGame(): ResponseEntity<Nothing> {
        gameServiceDelegate.finishGame()
        return ResponseEntity.ok().build()
    }

    @PostMapping("/player/kick")
    fun kickPlayer(
        @RequestParam(required = true) index: Int,
        @RequestParam(required = true) nickname: String
    ): ResponseEntity<Nothing> {
        authService.removeAuthentication(index)
        gameServiceDelegate.kickPlayer(index, nickname)
        return ResponseEntity.ok().build()
    }
}
