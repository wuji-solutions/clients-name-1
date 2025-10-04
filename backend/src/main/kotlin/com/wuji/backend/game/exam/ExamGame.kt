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
    val plannedFinishTimeEpoch =
        timeOfCreationEpoch + config.totalDurationMinutes * 60 * 1000

    val questionDispenser = ExamDispenser()

    override fun start() {
        gameState = GameState.RUNNING
        if (config.selectedQuestionIds.isNotEmpty()) {
            questionDispenser.initialize(
                players, questions, config.selectedQuestionIds.toSet())
        } else {
            questionDispenser.initialize(
                players,
                questions,
                config.requiredQuestionCount,
                config.randomizeQuestions,
                config.enforceDifficultyBalance)
        }
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
