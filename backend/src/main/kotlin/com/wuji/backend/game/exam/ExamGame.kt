package com.wuji.backend.game.exam

import com.wuji.backend.config.ExamConfig
import com.wuji.backend.dispenser.ExamDispenser
import com.wuji.backend.game.GameType
import com.wuji.backend.game.common.AbstractGame
import com.wuji.backend.game.common.GameState
import com.wuji.backend.player.state.ExamPlayerDetails
import com.wuji.backend.question.common.Question

class ExamGame(
    name: String,
    config: ExamConfig,
    val questions: List<Question>
) : AbstractGame<ExamPlayerDetails, ExamConfig>(name, GameType.EXAM, config) {

    val questionDispenser = ExamDispenser()

    private var _plannedFinishTimeEpoch: Long? = null
    var plannedFinishTimeEpoch: Long
        get() =
            _plannedFinishTimeEpoch
                ?: throw IllegalStateException(
                    "Zaplanowany czas zakończenia nie został zainicjalizowany")
        set(value) {
            _plannedFinishTimeEpoch = value
        }

    override fun start() {
        gameState = GameState.RUNNING
        if (config.selectedQuestionIds.isEmpty())
            questionDispenser.initialize(
                players,
                questions,
                config.requiredQuestionCount,
                config.randomizeQuestions,
                config.enforceDifficultyBalance)
        else
            questionDispenser.initialize(
                players, questions, config.selectedQuestionIds.toSet())
        _plannedFinishTimeEpoch =
            System.currentTimeMillis() + config.totalDurationMinutes * 60 * 1000
    }

    override fun pause() {
        gameState = GameState.PAUSED
    }

    override fun resume() {
        gameState = GameState.RUNNING
    }

    override fun finish() {
        gameState = GameState.FINISHED
    }
}
