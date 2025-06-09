package com.wuji.backend.game.quiz

import com.wuji.backend.game.common.GameController
import com.wuji.backend.game.common.dto.JoinGameRequestDto
import com.wuji.backend.game.quiz.dto.AnswerQuestionRequestDto
import com.wuji.backend.player.auth.Participant
import com.wuji.backend.player.auth.PlayerAuthService
import com.wuji.backend.question.Question
import jakarta.servlet.http.HttpServletRequest
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/games/quiz")
class QuizController(private val quizService: QuizService, private val playerAuthService: PlayerAuthService): GameController {

    @GetMapping("/questions/{questionId}")
    fun getQuestion(@PathVariable questionId: Int): ResponseEntity<Question> {
        // dont return answer
        return ResponseEntity.ok(quizService.getNthQuestion(questionId))
    }

    @PostMapping("/questions/{questionId}")
//    /questions/answer?
    fun answerQuestion(@PathVariable questionId: Int, @Valid @RequestBody answerDto: AnswerQuestionRequestDto, auth: Authentication): ResponseEntity<Boolean> {
        val index = (auth.principal as Participant).index
        val correct = quizService.answerQuestion(index, questionId, answerDto.answerId)

//        TODO("Walidacja nie działa (w sensie @Valid)")

        return ResponseEntity.ok(correct)
    }

    @PostMapping("/join")
    override fun joinGame(@Valid @RequestBody requestDto: JoinGameRequestDto, request: HttpServletRequest): ResponseEntity<Any> {
        val participant = playerAuthService.authenticate(requestDto.index, request)
        quizService.joinGame(participant.index, participant.nickname)
//        TODO("Walidacja nie działa (w sensie @Valid)")
        return ResponseEntity.ok(participant.nickname)
    }
}
