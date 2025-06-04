package com.wuji.backend.game.quiz

import com.wuji.backend.game.quiz.dto.JoinQuizRequestDto
import com.wuji.backend.question.Question
import jakarta.servlet.http.HttpSession
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/games/quiz")
class QuizController(private val quizService: QuizService) {

    @GetMapping("/questions/{questionId}")
    fun getQuestion(@PathVariable questionId: Int): ResponseEntity<Question> {
        return ResponseEntity.ok(quizService.getNthQuestion(questionId))
    }

    @PostMapping("/questions/{questionId}/{answerId}")
    fun answerQuestion(@PathVariable questionId: Int, @PathVariable answerId: Int, httpSession: HttpSession): ResponseEntity<Boolean> {
        val quizPlayerState = httpSession.getAttribute("playerState") ?: ""
        val correct = quizService.answerQuestion(quizPlayerState, questionId, answerId)

        return ResponseEntity.ok(correct)
    }

    @PostMapping("/join")
    fun joinGame(httpSession: HttpSession, @RequestBody requestDto: JoinQuizRequestDto): ResponseEntity<Any> {
        val nickname = httpSession.getAttribute("nickname") ?: ""
        val playerState = quizService.joinGame(requestDto.index, nickname)
        httpSession.setAttribute("playerState", playerState)
        return ResponseEntity.ok(nickname)
    }
}
