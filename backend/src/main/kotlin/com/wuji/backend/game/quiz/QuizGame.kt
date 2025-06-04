package com.wuji.backend.game.quiz

import com.wuji.backend.game.common.AbstractGame
import com.wuji.backend.player.state.QuizPlayerDetails
import com.wuji.backend.question.Question

class QuizGame(name: String, config: QuizGameConfig, val questions: List<Question>): AbstractGame<QuizPlayerDetails, QuizGameConfig>(name, config) {
    override fun start() {
        TODO("Not yet implemented")
    }

    override fun stop() {
        TODO("Not yet implemented")
    }

    override fun getRaport(): String {
        TODO("Not yet implemented")
    }
}
