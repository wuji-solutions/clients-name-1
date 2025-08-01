package com.wuji.backend.admin

import com.wuji.backend.config.dto.toQuizConfig
import com.wuji.backend.game.common.GameServiceDelegate
import com.wuji.backend.game.quiz.QuizService
import com.wuji.backend.game.quiz.dto.QuizGameCreateRequestDto
import com.wuji.backend.player.dto.PlayerDto
import com.wuji.backend.question.common.dto.QuestionResponseDto
import com.wuji.backend.security.GameCreated
import com.wuji.backend.security.GamePaused
import com.wuji.backend.security.GameRunning
import com.wuji.backend.util.ext.toQuestionDto
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

@RestController
@Validated
@RequestMapping("/manage")
class AdminController(
    private val quizService: QuizService,
    private val gameServiceDelegate: GameServiceDelegate
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

    @GetMapping("/quiz/current-question")
    fun getCurrentQuestion(): ResponseEntity<QuestionResponseDto> {
        return ResponseEntity.ok(quizService.currentQuestion().toQuestionDto())
    }

    @GetMapping("/players")
    fun listPlayers(): ResponseEntity<List<PlayerDto>> {
        return ResponseEntity.ok(gameServiceDelegate.listPlayers())
    }

    @GameCreated
    @PostMapping("/start")
    fun startGame(): ResponseEntity<Nothing> {
        quizService.startGame()
        return ResponseEntity.ok().build()
    }

    @GameRunning
    @PostMapping("/pause")
    fun pauseGame(): ResponseEntity<Nothing> {
        quizService.pauseGame()
        return ResponseEntity.ok().build()
    }

    @GamePaused
    @PostMapping("/resume")
    fun resumeGame(): ResponseEntity<Nothing> {
        quizService.resumeGame()
        return ResponseEntity.ok().build()
    }
}
