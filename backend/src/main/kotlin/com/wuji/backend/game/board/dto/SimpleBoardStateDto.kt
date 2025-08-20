package com.wuji.backend.game.board.dto

import com.wuji.backend.game.board.TileIndex

data class SimpleBoardStateDto(
    val tileStates: List<SimpleTileStateDto>,
)

data class SimpleTileStateDto(
    val tileIndex: TileIndex,
    val players: Set<PlayerIndex>
)

typealias PlayerIndex = Int
