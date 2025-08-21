package com.wuji.backend.game.board.dto

import com.wuji.backend.game.board.TileIndex
import com.wuji.backend.player.state.PlayerIndex

data class SimpleBoardStateDto(
    val tileStates: List<SimpleTileStateDto>,
)

data class SimpleTileStateDto(
    val tileIndex: TileIndex,
    val players: Set<PlayerIndex>
)
