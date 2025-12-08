package com.wuji.backend.game.board.dto

import com.wuji.backend.config.dto.BoardConfigDto
import jakarta.validation.Valid

data class BoardGameCreateRequestDto(
    val name: String,
    @field:Valid val config: BoardConfigDto
)
