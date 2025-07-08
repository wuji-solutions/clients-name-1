package com.wuji.backend.game.quiz

import com.wuji.backend.game.common.GameService
import com.wuji.backend.player.state.PlayerService
import com.wuji.backend.player.state.QuizPlayer
import com.wuji.backend.player.state.QuizPlayerDetails
import com.wuji.backend.question.quiz.QuizQuestionService
import org.springframework.stereotype.Service

@Service
class QuizService(
    private val quizGame: QuizGame,
    private val playerService: PlayerService,
    private val questionService: QuizQuestionService
) : GameService {
    override fun joinGame(index: Any, nickname: Any): QuizPlayer {
        return playerService.createPlayer(index, nickname, QuizPlayerDetails())
            .also { player -> quizGame.players.add(player) }
    }

    override fun createGame() {
        TODO("Not yet implemented")
    }

    override fun startGame() {
        questionService.game = quizGame
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

    override fun getRaport(): String {
        TODO("Not yet implemented")
    }
}
