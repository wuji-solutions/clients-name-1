package com.wuji.backend.reports.common

import java.time.LocalDateTime

abstract class GameReport<ReportT : ReportRow> {
    val gameStartDateTime: LocalDateTime = LocalDateTime.now()
    val rows = ArrayList<ReportT>()

    abstract fun toCSV()

    fun countAnswersPerQuestion(questionId: Int): Int {
        return rows.count { it.playerAnswer.question.id == questionId }
    }
}
