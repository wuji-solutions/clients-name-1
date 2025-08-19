package com.wuji.backend.player.state

import com.wuji.backend.game.board.TileIndex

const val DEFAULT_POSITION = 0

class BoardPlayerDetails(
    var currentTileIndex: TileIndex = DEFAULT_POSITION,
) : PlayerDetails()

typealias BoardPlayer = Player<BoardPlayerDetails>
