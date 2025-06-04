package com.wuji.backend.game.quiz

import com.wuji.backend.player.state.exception.PlayerNotJoinedException
import com.wuji.backend.game.quiz.dto.AnswerQuestionRequestDto
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

    @PostMapping("/questions/{questionId}")
    fun answerQuestion(@PathVariable questionId: Int, @RequestBody answerDto: AnswerQuestionRequestDto, httpSession: HttpSession): ResponseEntity<Boolean> {
        val quizPlayerState = httpSession.getAttribute("index") ?: throw PlayerNotJoinedException()
        val correct = quizService.answerQuestion(quizPlayerState as Int, questionId, answerDto.answerId)

        return ResponseEntity.ok(correct)
    }

    @PostMapping("/join")
    fun joinGame(httpSession: HttpSession, @RequestBody requestDto: JoinQuizRequestDto): ResponseEntity<Any> {
        val nickname = httpSession.getAttribute("nickname") ?: ""
        httpSession.setAttribute("index", requestDto.index)
        quizService.joinGame(requestDto.index, nickname)
        return ResponseEntity.ok(nickname)
    }
}
