package com.wuji.backend.game.quiz

import com.wuji.backend.config.QuizConfig
import com.wuji.backend.events.common.SSEUsersService
import com.wuji.backend.game.GameRegistry
import com.wuji.backend.game.common.GameService
import com.wuji.backend.player.dto.PlayerDto
import com.wuji.backend.player.dto.PlayerDto.Companion.toDto
import com.wuji.backend.player.state.PlayerService
import com.wuji.backend.player.state.QuizPlayer
import com.wuji.backend.player.state.QuizPlayerDetails
import com.wuji.backend.question.common.Question
import org.springframework.stereotype.Service

@Service
class QuizService(
    private val gameRegistry: GameRegistry,
    private val playerService: PlayerService,
    private val sseService: SSEUsersService
) : GameService {

    private val quizGame: QuizGame
        get() = gameRegistry.getAs(QuizGame::class.java)

    override fun joinGame(index: Any, nickname: Any): QuizPlayer {
        return playerService
            .createPlayer(index, nickname, QuizPlayerDetails())
            .also { player -> quizGame.players.add(player) }
            .also { sseService.sendPlayers(quizGame.players) }
    }

    override fun listPlayers(): List<PlayerDto> =
        gameRegistry.game.players.map { player -> player.toDto() }

    fun createGame(
        name: String,
        config: QuizConfig,
        questions: List<Question>
    ) {
        gameRegistry.register(QuizGame(name, config, questions))
    }

    fun currentQuestion(): Question = quizGame.currentQuestion()

    override fun startGame() {
        quizGame.start()
    }

    override fun pauseGame() {
        TODO("Not yet implemented")
    }

    override fun resumeGame() {
        TODO("Not yet implemented")
    }

    override fun stopGame() {
        TODO("Not yet implemented")
    }

    override fun getReport(): String {
        TODO("Not yet implemented")
    }
}
