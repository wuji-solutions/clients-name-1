package com.wuji.backend.game.common

enum class GameState(val polish: String) {
    CREATED("STWORZONA"),
    RUNNING("W TOKU"),
    PAUSED("ZAPAUZOWANA"),
    FINISHED("SKONCZONA"),
    FINISHING("KONCZY SIE")
}
