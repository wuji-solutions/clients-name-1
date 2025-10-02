package com.wuji.backend.game.common

import com.wuji.backend.config.BoardConfig
import com.wuji.backend.config.GameConfig
import com.wuji.backend.config.QuizConfig
import com.wuji.backend.config.dto.GameConfigDto
import com.wuji.backend.config.dto.toBoardConfigDto
import com.wuji.backend.config.dto.toQuizConfigDto
import com.wuji.backend.game.GameRegistry
import com.wuji.backend.game.GameType
import com.wuji.backend.game.board.BoardService
import com.wuji.backend.game.quiz.QuizService
import com.wuji.backend.player.dto.PlayerDto
import com.wuji.backend.player.state.Player
import com.wuji.backend.player.state.PlayerDetails
import com.wuji.backend.reports.ReportsService
import org.springframework.stereotype.Service

@SuppressWarnings("kotlin:S6514")
@Service
class GameServiceDelegate(
    quizService: QuizService,
    boardService: BoardService,
    private val gameRegistry: GameRegistry,
) : GameService {
    private val services =
        mapOf(
            GameType.QUIZ to quizService,
            //        GameType.EXAM to examService,
            GameType.BOARD to boardService)

    private val currentService: GameService
        get() =
            services[gameRegistry.gameType]
                ?: throw IllegalStateException(
                    "Unknown game type: ${gameRegistry.gameType}")

    override fun joinGame(
        index: Int,
        nickname: String
    ): Player<out PlayerDetails> {
        return currentService.joinGame(index, nickname)
    }

    override fun listPlayers(): List<PlayerDto> {
        return currentService.listPlayers()
    }

    override fun startGame() {
        currentService.startGame()
    }

    override fun pauseGame() {
        currentService.pauseGame()
    }

    override fun resumeGame() {
        currentService.resumeGame()
    }

    override fun finishGame() {
        currentService.finishGame()
        ReportsService().writeReports(gameRegistry.game)
    }

    override fun kickPlayer(index: Int, nickname: String) {
        return currentService.kickPlayer(index, nickname)
    }

    override fun hasJoined(index: Int, nickname: String): Boolean {
        return currentService.hasJoined(index, nickname)
    }

    override fun getPlayer(index: Int): Player<out PlayerDetails> {
        return currentService.getPlayer(index)
    }

    override fun getConfig(): GameConfig {
        return currentService.getConfig()
    }

    fun getConfigDto(): GameConfigDto {
        return when (gameRegistry.gameType) {
            GameType.QUIZ -> (getConfig() as QuizConfig).toQuizConfigDto()
            GameType.EXAM -> TODO()
            GameType.BOARD -> (getConfig() as BoardConfig).toBoardConfigDto()
        }
    }

    fun getGameState(): GameState {
        return gameRegistry.game.gameState
    }

    fun getGameType(): GameType {
        return gameRegistry.gameType
    }
}
