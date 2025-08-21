package com.wuji.backend.game.quiz

import com.wuji.backend.game.GameType
import com.wuji.backend.game.common.GameController
import com.wuji.backend.game.common.dto.JoinGameRequestDto
import com.wuji.backend.game.quiz.dto.QuizSummaryResponseDto
import com.wuji.backend.player.dto.PlayerDto
import com.wuji.backend.player.dto.PlayerDto.Companion.toDto
import com.wuji.backend.security.IsAdmin
import com.wuji.backend.security.RequiresGame
import com.wuji.backend.security.auth.PlayerAuthService
import com.wuji.backend.security.auth.playerIndex
import jakarta.servlet.http.HttpServletRequest
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@Validated
@RequiresGame(gametype = GameType.QUIZ)
@RequestMapping("/games/quiz")
class QuizController(
    private val quizService: QuizService,
    private val playerAuthService: PlayerAuthService
) : GameController {

    @PostMapping("/join")
    override fun joinGame(
        @Valid @RequestBody requestDto: JoinGameRequestDto,
        request: HttpServletRequest
    ): ResponseEntity<Any> {
        val participant =
            playerAuthService.authenticate(requestDto.index, request)
        quizService.joinGame(participant.index, participant.nickname)

        return ResponseEntity.ok(participant.nickname)
    }

    @GetMapping("/player")
    override fun getPlayer(
        authentication: Authentication
    ): ResponseEntity<PlayerDto> {
        val playerIndex = authentication.playerIndex()
        return ResponseEntity.ok(quizService.getPlayer(playerIndex).toDto())
    }

    @IsAdmin
    @GetMapping("/summarize")
    fun summarizeGame(): ResponseEntity<QuizSummaryResponseDto> {
        return ResponseEntity.ok(quizService.getGameSummary())
    }
}
