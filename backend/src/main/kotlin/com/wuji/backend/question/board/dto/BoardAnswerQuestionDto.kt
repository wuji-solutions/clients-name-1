package com.wuji.backend.question.board.dto

import com.wuji.backend.player.dto.BoardPlayerDto

data class BoardAnswerQuestionDto(
    val correct: Boolean,
    val player: BoardPlayerDto,
)
