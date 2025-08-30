package com.wuji.backend.game.board.dto

import com.wuji.backend.game.board.TileIndex

data class MovePlayerResponseDto(val diceRoll: Int, val newPosition: TileIndex)
