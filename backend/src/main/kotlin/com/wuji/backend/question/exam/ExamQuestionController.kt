package com.wuji.backend.question.exam

import com.wuji.backend.game.GameType
import com.wuji.backend.question.common.QuestionController
import com.wuji.backend.question.common.dto.QuestionDto
import com.wuji.backend.question.common.dto.toQuestionDto
import com.wuji.backend.question.exam.dto.ExamAnswerQuestionRequestDto
import com.wuji.backend.security.auth.playerIndex
import com.wuji.backend.security.validator.GameRunning
import com.wuji.backend.security.validator.GameRunningOrFinishing
import com.wuji.backend.security.validator.RequiresGame
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
@RequestMapping("/games/exam/questions")
class ExamQuestionController(
    val questionService: ExamQuestionService,
) : QuestionController {

    @GameRunningOrFinishing
    @GetMapping("/current")
    fun getCurrentQuestion(
        authentication: Authentication,
    ): ResponseEntity<QuestionDto> {
        val index = authentication.playerIndex()
        return ResponseEntity.ok(
            questionService.getQuestionAndMarkTime(index).toQuestionDto())
    }

    @GameRunning
    @GetMapping("/previous")
    fun getPreviousQuestion(
        authentication: Authentication,
    ): ResponseEntity<QuestionDto> {
        val index = authentication.playerIndex()
        return ResponseEntity.ok(
            questionService.getPreviousQuestion(index).toQuestionDto())
    }

    @GameRunning
    @GetMapping("/next")
    fun getNextQuestion(
        authentication: Authentication,
    ): ResponseEntity<QuestionDto> {
        val index = authentication.playerIndex()
        return ResponseEntity.ok(
            questionService.getQuestionAndMarkTime(index).toQuestionDto())
    }

    @GameRunningOrFinishing
    @PostMapping("/answer")
    fun answerQuestion(
        @Valid @RequestBody answerDto: ExamAnswerQuestionRequestDto,
        auth: Authentication
    ): ResponseEntity<Boolean> {
        val index = auth.playerIndex()
        val correct =
            questionService.answerExamQuestion(
                index, answerDto.answerIds, answerDto.playerCheated)

        return ResponseEntity.ok(correct)
    }
}
