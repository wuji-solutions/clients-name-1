package com.wuji.backend.game.quiz

import com.wuji.backend.config.QuizConfig
import com.wuji.backend.dispenser.QuizDispenser
import com.wuji.backend.game.GameType
import com.wuji.backend.game.common.AbstractGame
import com.wuji.backend.game.common.GameState
import com.wuji.backend.player.state.QuizPlayer
import com.wuji.backend.player.state.QuizPlayerDetails
import com.wuji.backend.player.state.exception.PlayerNotFoundException
import com.wuji.backend.question.common.Question

class QuizGame(
    name: String,
    config: QuizConfig,
    val questions: List<Question>
) : AbstractGame<QuizPlayerDetails, QuizConfig>(name, GameType.QUIZ, config) {

    val questionDispenser = QuizDispenser(questions.toMutableList())

    var askedQuestions: MutableList<Question> = mutableListOf()
        private set

    override fun start() {
        gameState = GameState.RUNNING
    }

    override fun pause() {
        gameState = GameState.PAUSED
        println("Game paused")
    }

    override fun resume() {
        gameState = GameState.RUNNING
    }

    override fun finish() {
        gameState = GameState.FINISHED
    }

    override fun getReport(): String {
        TODO("Not yet implemented")
    }

    fun findPlayerByIndex(index: Int): QuizPlayer {
        return players.find { player -> player.index == index }
            ?: throw PlayerNotFoundException(index).also {
                println("Player not found: $players")
            }
    }

    fun currentQuestion(): Question = askedQuestions.last()
}
