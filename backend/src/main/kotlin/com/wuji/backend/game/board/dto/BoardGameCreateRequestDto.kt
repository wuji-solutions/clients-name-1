package com.wuji.backend.game.board.dto

import com.wuji.backend.config.dto.BoardConfigDto
import com.wuji.backend.game.board.Tile
import com.wuji.backend.question.common.Question
import jakarta.validation.Valid

data class BoardGameCreateRequestDto(
    val name: String,
    @field:Valid val config: BoardConfigDto,
    val questions: List<Question>,
    val categories: List<String>,
    val tiles: List<Tile>
)
