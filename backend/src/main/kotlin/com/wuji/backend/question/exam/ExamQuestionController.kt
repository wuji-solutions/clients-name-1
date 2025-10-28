package com.wuji.backend.question.exam

import com.wuji.backend.game.GameType
import com.wuji.backend.question.common.Question
import com.wuji.backend.question.common.QuestionController
import com.wuji.backend.question.exam.dto.ExamAnswerQuestionRequestDto
import com.wuji.backend.question.exam.dto.ExamQuestionDto
import com.wuji.backend.question.exam.dto.toExamQuestionDto
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
        authentication: Authentication
    ): ResponseEntity<ExamQuestionDto> =
        handleQuestionRequest(
            authentication, questionService::getCurrentQuestion)

    @GameRunning
    @GetMapping("/previous")
    fun getPreviousQuestion(
        authentication: Authentication
    ): ResponseEntity<ExamQuestionDto> =
        handleQuestionRequest(
            authentication, questionService::getPreviousQuestion)

    @GameRunning
    @GetMapping("/next")
    fun getNextQuestion(
        authentication: Authentication
    ): ResponseEntity<ExamQuestionDto> =
        handleQuestionRequest(authentication, questionService::getNextQuestion)

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

    private fun handleQuestionRequest(
        authentication: Authentication,
        questionFetcher: (Int) -> Question
    ): ResponseEntity<ExamQuestionDto> {
        val index = authentication.playerIndex()
        val (question, playerAnswer) =
            questionService.getQuestionAndMarkTime(index, questionFetcher)
        val questionNumber = questionService.getCurrentQuestionNumber(index)
        val totalQuestions = questionService.getBaseQuestionsSize(index)

        return ResponseEntity.ok(
            question.toExamQuestionDto(
                playerAnswer,
                questionNumber,
                totalQuestions,
                questionService.getAllowGoingBack()))
    }
}
