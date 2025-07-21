package com.wuji.backend.game.common

import com.wuji.backend.game.GameRegistry
import com.wuji.backend.game.GameType
import com.wuji.backend.game.quiz.QuizService
import com.wuji.backend.player.dto.PlayerDto
import com.wuji.backend.player.state.Player
import com.wuji.backend.player.state.PlayerDetails
import org.springframework.stereotype.Service

@Service
class GameServiceDelegate(
    private val quizService: QuizService,
    private val gameRegistry: GameRegistry
) : GameService {
    private val services =
        mapOf(
            GameType.QUIZ to quizService,
            //        GameType.EXAM to examService,
            //        GameType.BOARD to boardService
        )

    private val currentService: GameService
        get() =
            services[gameRegistry.gameType]
                ?: throw IllegalStateException(
                    "Unknown game type: ${gameRegistry.gameType}")

    override fun joinGame(
        index: Any,
        nickname: Any
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

    override fun stopGame() {
        currentService.stopGame()
    }

    override fun getRaport(): String {
        return currentService.getRaport()
    }
}
