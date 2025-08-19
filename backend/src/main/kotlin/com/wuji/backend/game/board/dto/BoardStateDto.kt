package com.wuji.backend.game.board.dto

import com.wuji.backend.game.board.TileIndex
import com.wuji.backend.player.dto.PlayerDto

data class BoardStateDto(
    val tileStates: List<TileStateDto>,
)

data class TileStateDto(val tileIndex: TileIndex, val players: Set<PlayerDto>)
