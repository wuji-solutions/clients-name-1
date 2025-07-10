package com.wuji.backend.game.quiz

import com.wuji.backend.game.GameType
import com.wuji.backend.game.common.AbstractGame
import com.wuji.backend.player.state.QuizPlayer
import com.wuji.backend.player.state.QuizPlayerDetails
import com.wuji.backend.player.state.exception.PlayerNotFoundException
import com.wuji.backend.question.common.Question

class QuizGame(name: String, config: QuizGameConfig, val questions: List<Question>) :
    AbstractGame<QuizPlayerDetails, QuizGameConfig>(name, GameType.QUIZ, config) {
    override fun start() {
        isRunning = true
    }

    override fun stop() {
        isRunning = false
    }

    override fun getRaport(): String {
        TODO("Not yet implemented")
    }

    fun findPlayerByIndex(index: Int): QuizPlayer {
        return players.find { player -> player.index == index }
            ?: throw PlayerNotFoundException(index).also { println("Player not found: $players") }
    }
}
