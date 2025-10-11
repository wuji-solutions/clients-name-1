package com.wuji.backend.game.exam

import com.wuji.backend.game.GameType
import com.wuji.backend.game.common.GameController
import com.wuji.backend.game.common.dto.JoinGameRequestDto
import com.wuji.backend.game.exam.dto.TimeUntilGameFinishDto
import com.wuji.backend.player.dto.ExamPlayerDto
import com.wuji.backend.player.dto.ExamPlayerDto.Companion.toExamPlayerDto
import com.wuji.backend.security.auth.PlayerAuthService
import com.wuji.backend.security.auth.playerIndex
import com.wuji.backend.security.validator.RequiresGame
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
@RequiresGame(GameType.EXAM)
@RequestMapping("/games/exam")
class ExamController(
    private val playerAuthService: PlayerAuthService,
    private val examService: ExamService
) : GameController {
    @PostMapping("/join")
    override fun joinGame(
        @Valid @RequestBody requestDto: JoinGameRequestDto,
        request: HttpServletRequest
    ): ResponseEntity<Any> {
        val participant =
            playerAuthService.authenticate(requestDto.index, request)
        examService.joinGame(participant.index, participant.nickname)

        return ResponseEntity.ok(participant.nickname)
    }

    @GetMapping("/player")
    override fun getPlayer(
        authentication: Authentication
    ): ResponseEntity<ExamPlayerDto> {
        val playerIndex = authentication.playerIndex()
        return ResponseEntity.ok(
            examService.getPlayer(playerIndex).toExamPlayerDto())
    }

    @GetMapping("/time-left")
    fun getTimeUntilFinish(): ResponseEntity<TimeUntilGameFinishDto> {
        return ResponseEntity.ok(examService.getTimeUntilFinish())
    }
}
