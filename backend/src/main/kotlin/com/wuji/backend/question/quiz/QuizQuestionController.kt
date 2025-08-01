package com.wuji.backend.question.quiz

import com.wuji.backend.game.quiz.dto.AnswerQuestionRequestDto
import com.wuji.backend.question.common.QuestionController
import com.wuji.backend.question.common.dto.AnswersPerQuestionDto
import com.wuji.backend.question.common.dto.QuestionResponseDto
import com.wuji.backend.security.GameRunning
import com.wuji.backend.security.auth.Participant
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

@RestController
@Validated
@GameRunning
@RequestMapping("/games/quiz/questions")
class QuizQuestionController(
    private val questionService: QuizQuestionService,
) : QuestionController {

    @GetMapping("/current")
    fun getQuestion(): ResponseEntity<QuestionResponseDto> {
        return ResponseEntity.ok(questionService.getQuestion())
    }

    @PostMapping("/answer")
    fun answerQuestion(
        @Valid @RequestBody answerDto: AnswerQuestionRequestDto,
        auth: Authentication
    ): ResponseEntity<Boolean> {
        val index = (auth.principal as Participant).index
        val correct = questionService.answerQuestion(index, answerDto.answerIds)

        return ResponseEntity.ok(correct)
    }

    @PostMapping("/next")
    fun nextQuestion(): ResponseEntity<QuestionResponseDto> {
        return ResponseEntity.ok(questionService.getNextQuestion())
    }

    @PostMapping("/end")
    fun endQuestion(): ResponseEntity<AnswersPerQuestionDto> {
        questionService.endQuestion()
        return ResponseEntity.ok(questionService.getAnswersPerQuestion())
    }
}
