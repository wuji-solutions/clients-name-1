package com.wuji.backend.admin

import com.wuji.backend.admin.dto.ParsedQuestionsInfo
import com.wuji.backend.config.dto.GameConfigDto
import com.wuji.backend.config.dto.toBoardConfig
import com.wuji.backend.config.dto.toExamConfig
import com.wuji.backend.config.dto.toQuizConfig
import com.wuji.backend.game.board.BoardService
import com.wuji.backend.game.board.dto.BoardGameCreateRequestDto
import com.wuji.backend.game.common.GameServiceDelegate
import com.wuji.backend.game.exam.ExamService
import com.wuji.backend.game.exam.dto.ExamGameCreateRequestDto
import com.wuji.backend.game.quiz.QuizService
import com.wuji.backend.game.quiz.dto.QuizGameCreateRequestDto
import com.wuji.backend.parser.MoodleXmlParser
import com.wuji.backend.player.dto.PlayerDto
import com.wuji.backend.security.IsAdmin
import com.wuji.backend.security.auth.PlayerAuthService
import com.wuji.backend.security.validator.GameCreated
import com.wuji.backend.security.validator.GamePaused
import com.wuji.backend.security.validator.GameRunning
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

@RestController
@Validated
@IsAdmin
@RequestMapping("/manage")
class AdminController(
    private val quizService: QuizService,
    private val boardService: BoardService,
    private val examService: ExamService,
    private val gameServiceDelegate: GameServiceDelegate,
    private val authService: PlayerAuthService
) {

    @PostMapping("/quiz")
    fun createQuizGame(
        @Valid @RequestBody requestDto: QuizGameCreateRequestDto
    ): ResponseEntity<Nothing> {
        quizService.createGame(
            requestDto.name,
            requestDto.config.toQuizConfig(),
            requestDto.config.questionFilePath)
        authService.clearAllSessions()
        return ResponseEntity.ok().build()
    }

    @PostMapping("/board")
    fun createBoardGame(
        @Valid @RequestBody requestDto: BoardGameCreateRequestDto
    ): ResponseEntity<Nothing> {
        boardService.createGame(
            requestDto.name,
            requestDto.config.toBoardConfig(),
            requestDto.config.questionFilePath,
            requestDto.config.numberOfTiles)
        authService.clearAllSessions()
        return ResponseEntity.ok().build()
    }

    @PostMapping("/exam")
    fun createExamGame(
        @Valid @RequestBody requestDto: ExamGameCreateRequestDto
    ): ResponseEntity<Nothing> {
        examService.createGame(
            requestDto.name,
            requestDto.config.toExamConfig(),
            requestDto.config.questionFilePath)
        authService.clearAllSessions()
        return ResponseEntity.ok().build()
    }

    @GetMapping("/parse-questions")
    fun parseQuestions(
        @RequestParam(value = "questionsFilePath", required = true)
        questionsFilePath: String,
    ): ResponseEntity<ParsedQuestionsInfo> {
        return ResponseEntity.ok(MoodleXmlParser.parsedInfo(questionsFilePath))
    }

    @GetMapping("/players")
    fun listPlayers(): ResponseEntity<List<PlayerDto>> {
        return ResponseEntity.ok(gameServiceDelegate.listPlayers())
    }

    @GameCreated
    @PostMapping("/start")
    fun startGame(): ResponseEntity<Nothing> {
        gameServiceDelegate.startGame()
        return ResponseEntity.ok().build()
    }

    @GameRunning
    @PostMapping("/pause")
    fun pauseGame(): ResponseEntity<Nothing> {
        gameServiceDelegate.pauseGame()
        return ResponseEntity.ok().build()
    }

    @GamePaused
    @PostMapping("/resume")
    fun resumeGame(): ResponseEntity<Nothing> {
        gameServiceDelegate.resumeGame()
        return ResponseEntity.ok().build()
    }

    @PostMapping("/finish")
    fun finishGame(): ResponseEntity<Nothing> {
        gameServiceDelegate.finishGame()
        return ResponseEntity.ok().build()
    }

    @PostMapping("/player/kick")
    fun kickPlayer(
        @RequestParam(required = true) index: Int
    ): ResponseEntity<Nothing> {
        authService.removeAuthentication(index)
        gameServiceDelegate.kickPlayer(index)
        return ResponseEntity.ok().build()
    }

    @GetMapping("/config")
    fun getConfig(): ResponseEntity<out GameConfigDto> {
        return ResponseEntity.ok(gameServiceDelegate.getConfigDto())
    }
}
