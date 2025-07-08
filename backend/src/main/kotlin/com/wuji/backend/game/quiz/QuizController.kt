package com.wuji.backend.game.quiz

import com.wuji.backend.game.common.GameController
import com.wuji.backend.game.common.dto.JoinGameRequestDto
import com.wuji.backend.game.quiz.dto.QuizGameCreateRequestDto
import com.wuji.backend.player.auth.PlayerAuthService
import jakarta.servlet.http.HttpServletRequest
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
@RequestMapping("/games/quiz")
class QuizController(private val quizService: QuizService, private val playerAuthService: PlayerAuthService) :
    GameController {

    @PostMapping("/create")
    fun createGame(
        @Valid @RequestBody requestDto: QuizGameCreateRequestDto,
        authentication: Authentication,
    ): ResponseEntity<Any> {
        quizService.createGame()
        return ResponseEntity.ok().build()
    }

    @PostMapping("/join")
    override fun joinGame(
        @Valid @RequestBody requestDto: JoinGameRequestDto,
        request: HttpServletRequest
    ): ResponseEntity<Any> {
        val participant = playerAuthService.authenticate(requestDto.index, request)
        quizService.joinGame(participant.index, participant.nickname)
        
        return ResponseEntity.ok(participant.nickname)
    }

}
