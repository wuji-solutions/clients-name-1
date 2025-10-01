package com.wuji.backend.question.board

import com.wuji.backend.game.GameType
import com.wuji.backend.game.quiz.dto.AnswerQuestionRequestDto
import com.wuji.backend.question.common.QuestionController
import com.wuji.backend.question.common.dto.QuestionDto
import com.wuji.backend.question.common.dto.toQuestionDto
import com.wuji.backend.security.auth.playerIndex
import com.wuji.backend.security.validator.GameRunning
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
@RequiresGame(GameType.BOARD)
@GameRunning
@RequestMapping("/games/board/questions")
class BoardQuestionController(
    val questionService: BoardQuestionService,
) : QuestionController {

    @GetMapping("/current")
    fun getQuestion(
        authentication: Authentication,
    ): ResponseEntity<QuestionDto> {
        val index = authentication.playerIndex()
        return ResponseEntity.ok(
            questionService.getQuestionAndMarkTime(index).toQuestionDto())
    }

    @PostMapping("/answer")
    fun answerQuestion(
        @Valid @RequestBody answerDto: AnswerQuestionRequestDto,
        auth: Authentication
    ): ResponseEntity<Boolean> {
        val index = auth.playerIndex()
        val correct =
            questionService.answerBoardQuestion(index, answerDto.answerIds)

        return ResponseEntity.ok(correct)
    }
}
