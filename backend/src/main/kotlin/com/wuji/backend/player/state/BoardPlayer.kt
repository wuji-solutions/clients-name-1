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
    var firstGetCurrentQuestionTime: Long? = null,
    var currentQuestion: Question? = null,
    val pointsMap: MutableMap<Int, Int> =
        mutableMapOf(), // QuestionId -> points
    var pointsMultiplier: Int = 1
) : PlayerDetails() {
    val playerState: PlayerState
        get() =
            if (currentQuestion == null) PlayerState.IDLE
            else PlayerState.ANSWERING

    fun points(): Int = pointsMultiplier * pointsMap.values.sum()
}

typealias BoardPlayer = Player<BoardPlayerDetails>

typealias Category = String

enum class PlayerState {
    ANSWERING,
    IDLE
}

fun BoardPlayer.increaseMultiplier() {
    details.pointsMultiplier += 1
}
