package com.wuji.backend.player.dto

import com.wuji.backend.player.state.ExamPlayer

class ExamPlayerDto(
    override val index: Int,
    override val nickname: String,
    val points: Int,
) : IPlayerDto {
    companion object {
        fun ExamPlayer.toExamPlayerDto(): ExamPlayerDto {
            return ExamPlayerDto(
                index = index, nickname = nickname, points = details.points)
        }
    }
}
