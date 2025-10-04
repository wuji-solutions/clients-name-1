package com.wuji.backend.dispenser

import com.wuji.backend.player.state.Player
import com.wuji.backend.player.state.PlayerDetails
import com.wuji.backend.player.state.PlayerIndex
import com.wuji.backend.question.common.Question

class ExamDispenser() : GameDispenser() {
    override val dispensers: MutableMap<PlayerIndex, Dispenser> = mutableMapOf()

    fun initialize(
        players: Set<Player<out PlayerDetails>>,
        questions: List<Question>
    ) {
        for (player in players) {
            dispensers.put(
                player.index, Dispenser(questions.shuffled().toMutableList()))
        }
    }
}
