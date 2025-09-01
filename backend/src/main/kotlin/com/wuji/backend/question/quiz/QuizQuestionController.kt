package com.wuji.backend.question.quiz

import com.wuji.backend.game.GameType
import com.wuji.backend.game.quiz.dto.AnswerQuestionRequestDto
import com.wuji.backend.question.common.QuestionController
import com.wuji.backend.question.common.dto.AnswersPerQuestionDto
import com.wuji.backend.question.common.dto.QuestionAlreadyAnsweredResponseDto
import com.wuji.backend.question.common.dto.QuestionDto
import com.wuji.backend.security.GameRunning
import com.wuji.backend.security.IsAdmin
import com.wuji.backend.security.RequiresGame
import com.wuji.backend.security.auth.playerIndex
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

@RestController
@Validated
@RequiresGame(GameType.QUIZ)
@GameRunning
@RequestMapping("/games/quiz/questions")
class QuizQuestionController(
    private val questionService: QuizQuestionService,
) : QuestionController {

    @GetMapping("/current")
    fun getQuestion(): ResponseEntity<QuestionDto> {
        return ResponseEntity.ok(questionService.getQuestion())
    }

    @PostMapping("/answer")
    fun answerQuestion(
        @Valid @RequestBody answerDto: AnswerQuestionRequestDto,
        auth: Authentication
    ): ResponseEntity<Boolean> {
        val index = auth.playerIndex()
        val correct =
            questionService.answerQuizQuestion(index, answerDto.answerIds)

        return ResponseEntity.ok(correct)
    }

    @PostMapping("/next")
    @IsAdmin
    fun nextQuestion(): ResponseEntity<QuestionDto> {
        return ResponseEntity.ok(questionService.getNextQuestion())
    }

    @PostMapping("/end")
    @IsAdmin
    fun endQuestion(): ResponseEntity<AnswersPerQuestionDto> {
        questionService.endQuestion()
        return ResponseEntity.ok(questionService.getAnswersPerQuestion())
    }

    @GetMapping("/{questionId}/already-answered")
    fun playerAlreadyAnswered(
        @PathVariable questionId: Int,
        auth: Authentication
    ): ResponseEntity<QuestionAlreadyAnsweredResponseDto> {
        val index = auth.playerIndex()
        return ResponseEntity.ok(
            questionService.playerAlreadyAnswered(questionId, index))
    }
}
