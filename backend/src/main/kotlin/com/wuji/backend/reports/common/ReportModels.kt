package com.wuji.backend.reports.common

import com.wuji.backend.player.state.Player
import com.wuji.backend.player.state.PlayerDetails
import com.wuji.backend.player.state.QuizPlayer
import com.wuji.backend.question.common.PlayerAnswer

sealed class ReportRow {
    abstract val player: Player<out PlayerDetails>
    abstract val playerAnswer: PlayerAnswer

    abstract fun toCSV(): String
}

data class QuizReportRow(
    override val player: QuizPlayer,
    override val playerAnswer: PlayerAnswer,
    val answerTimeInMilliseconds: Long,
) : ReportRow() {
    override fun toCSV(): String {
        TODO("Not implemented yet")
    }
}
