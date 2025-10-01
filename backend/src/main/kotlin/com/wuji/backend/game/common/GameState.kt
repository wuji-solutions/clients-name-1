package com.wuji.backend.game.common

enum class GameState {
    CREATED,
    RUNNING,
    PAUSED,
    FINISHED,
}

fun GameState.toPolish(): String {
    return when (this) {
        GameState.CREATED -> "STWORZONA"
        GameState.RUNNING -> "W TOKU"
        GameState.PAUSED -> "ZPAUZOWANA"
        GameState.FINISHED -> "SKONCZONA"
    }
}
