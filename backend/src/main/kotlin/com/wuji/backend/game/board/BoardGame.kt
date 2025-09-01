package com.wuji.backend.game.board

import com.wuji.backend.config.BoardConfig
import com.wuji.backend.dice.RandomDice
import com.wuji.backend.dispenser.BoardDispenser
import com.wuji.backend.game.GameType
import com.wuji.backend.game.common.AbstractGame
import com.wuji.backend.game.common.GameState
import com.wuji.backend.player.state.BoardPlayer
import com.wuji.backend.player.state.BoardPlayerDetails
import com.wuji.backend.question.common.Question
import com.wuji.backend.util.ext.toConcurrentMap
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.ConcurrentMap

class BoardGame(
    name: String,
    config: BoardConfig,
    val categories: List<String>,
    val questions: List<Question>,
    val tiles: List<Tile>,
) :
    AbstractGame<BoardPlayerDetails, BoardConfig>(
        name, GameType.BOARD, config) {

    val questionDispenser =
        BoardDispenser(categories, questions.toMutableList())

    val dice = RandomDice()

    val boardState: ConcurrentMap<TileIndex, MutableSet<BoardPlayer>> =
        (0 until tiles.size)
            .associateWith { ConcurrentHashMap.newKeySet<BoardPlayer>() }
            .toConcurrentMap()

    override fun start() {
        gameState = GameState.RUNNING
    }

    override fun pause() {
        gameState = GameState.PAUSED
    }

    override fun resume() {
        gameState = GameState.RUNNING
    }

    override fun finish() {
        gameState = GameState.FINISHED
    }

    override fun getReport(): String {
        TODO("Not yet implemented")
    }

    fun addPlayer(player: BoardPlayer) {
        val playersOnTile =
            boardState[0] ?: throw IllegalStateException("Board state is empty")
        playersOnTile.add(player)
    }

    @Synchronized
    fun movePlayer(player: BoardPlayer, steps: Int) {
        val currentTileIndex = player.details.currentTileIndex
        val newTileIndex = (currentTileIndex + steps) % tiles.size

        val currentSet =
            boardState[currentTileIndex]
                ?: throw IllegalStateException(
                    "Tile $currentTileIndex is not initialized in boardState")

        check(currentSet.remove(player)) {
            "Player $player not found on tile $currentTileIndex"
        }

        val newSet =
            boardState[newTileIndex]
                ?: throw IllegalStateException("Board state is empty")
        newSet.add(player)

        player.details.currentTileIndex = newTileIndex
    }

    fun getTop5Players(): List<BoardPlayer> =
        players.sortedByDescending { player -> player.details.points }.take(5)
}
