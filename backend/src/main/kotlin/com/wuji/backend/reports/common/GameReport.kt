package com.wuji.backend.reports.common

import java.time.LocalDateTime

abstract class GameReport<ReportT : ReportRow> {
    val gameStartDateTime: LocalDateTime = LocalDateTime.now()
    private val rows = ArrayList<ReportT>()

    abstract fun toCSV()

    fun addRow(row: ReportT) {
        rows.add(row)
    }
}
