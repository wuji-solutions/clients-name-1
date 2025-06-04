package com.wuji.backend.game.common

abstract class AbstractGame<ConfigT : GameConfig>(
    val name: String,
    private val config: ConfigT
) {
    private val isRunning: Boolean = false

    abstract fun start()
    abstract fun stop()
    abstract fun getRaport(): String
}

open class GameConfig
