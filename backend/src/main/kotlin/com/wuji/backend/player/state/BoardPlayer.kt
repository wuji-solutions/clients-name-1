package com.wuji.backend.player.state

import com.wuji.backend.config.DifficultyLevel
import com.wuji.backend.game.board.TileIndex
import com.wuji.backend.question.common.Question

const val DEFAULT_POSITION = 0

class BoardPlayerDetails(
    var currentTileIndex: TileIndex = DEFAULT_POSITION,
    val categoryToDifficulty: MutableMap<Category, DifficultyLevel> =
        mutableMapOf<Category, DifficultyLevel>().withDefault {
            DifficultyLevel.EASY
        },
    val askedQuestions: MutableList<Question> = mutableListOf(),
) : PlayerDetails()

typealias BoardPlayer = Player<BoardPlayerDetails>

typealias Category = String
