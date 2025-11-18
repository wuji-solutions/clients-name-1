package com.wuji.backend.game.board

import com.wuji.backend.config.BoardConfig
import com.wuji.backend.events.board.SSEBoardService
import com.wuji.backend.events.common.SSEEventService
import com.wuji.backend.events.common.SSEUsersService
import com.wuji.backend.game.GameRegistry
import com.wuji.backend.game.board.dto.BoardStateDto
import com.wuji.backend.game.board.dto.MovePlayerResponseDto
import com.wuji.backend.game.board.dto.SimpleBoardStateDto
import com.wuji.backend.game.board.dto.SimpleTileStateDto
import com.wuji.backend.game.board.dto.TileStateDto
import com.wuji.backend.game.common.GameService
import com.wuji.backend.game.common.GameState
import com.wuji.backend.parser.MoodleXmlParser
import com.wuji.backend.player.dto.PlayerDto
import com.wuji.backend.player.dto.PlayerDto.Companion.toDto
import com.wuji.backend.player.state.BoardPlayer
import com.wuji.backend.player.state.BoardPlayerDetails
import com.wuji.backend.player.state.Category
import com.wuji.backend.player.state.Player
import com.wuji.backend.player.state.PlayerDetails
import com.wuji.backend.player.state.PlayerService
import com.wuji.backend.player.state.exception.PlayerAlreadyJoinedException
import com.wuji.backend.player.state.exception.PlayerNotFoundException
import com.wuji.backend.player.state.increaseMultiplier
import com.wuji.backend.util.ext.getCategories
import java.io.File
import java.io.FileNotFoundException
import org.springframework.stereotype.Service

@Service
class BoardService(
    private val gameRegistry: GameRegistry,
    private val sseEventService: SSEEventService,
    private val sseUsersService: SSEUsersService,
    private val sseBoardService: SSEBoardService,
    private val playerService: PlayerService
) : GameService {
    override fun joinGame(
        index: Int,
        nickname: String
    ): Player<out PlayerDetails> {
        if (hasJoined(index))
            throw PlayerAlreadyJoinedException(index, nickname)

        return playerService
            .createPlayer(index, nickname, BoardPlayerDetails())
            .also { player -> game.addPlayer(player) }
            .also { sseUsersService.sendPlayers(listPlayers()) }
    }

    private val game: BoardGame
        get() = gameRegistry.getAs(BoardGame::class.java)

    override fun listPlayers(): List<PlayerDto> =
        game.players.map { player -> player.toDto() }

    override fun startGame() {
        game.start()
        sseEventService.sendGameStart()
    }

    override fun pauseGame() {
        game.pause()
    }

    override fun resumeGame() {
        game.resume()
    }

    override fun finishGame() {
        game.finish()
        sseEventService.sendGameFinish()
    }

    override fun kickPlayer(index: Int) {
        val player = game.findPlayerByIndex(index)
        game.players.remove(player)
        sseEventService.sendPlayerKickedEvent(player.toDto())
    }

    override fun hasJoined(index: Int): Boolean =
        try {
            game.findPlayerByIndex(index)
            true
        } catch (_: PlayerNotFoundException) {
            false
        }

    override fun getPlayer(index: Int): BoardPlayer {
        return game.findPlayerByIndex(index)
    }

    override fun getConfig(): BoardConfig = game.config

    fun getBoardState(): BoardStateDto {
        val tileStateDtos =
            game.boardState.map { stateEntry ->
                TileStateDto(
                    stateEntry.key,
                    stateEntry.value.map { it.toDto() }.toSet(),
                    game.tiles[stateEntry.key].category)
            }
        return BoardStateDto(tileStateDtos)
    }

    fun getSimpleBoardState(): SimpleBoardStateDto {
        val tileStateDtos =
            game.boardState.map { stateEntry ->
                SimpleTileStateDto(
                    stateEntry.key,
                    stateEntry.value.map { it.toDto() }.toSet(),
                )
            }
        return SimpleBoardStateDto(tileStateDtos)
    }

    fun movePlayer(playerIndex: Int): MovePlayerResponseDto {
        val player = game.findPlayerByIndex(playerIndex)
        val steps = game.dice.roll(player)
        val previousTileIndex = player.details.currentTileIndex

        game.movePlayer(player, steps)
        if (previousTileIndex > player.details.currentTileIndex) {
            player.increaseMultiplier()
        }
        sseBoardService.sendNewBoardStateEvent(getSimpleBoardState())
        return MovePlayerResponseDto(steps, player.details.currentTileIndex)
    }

    fun createGame(
        name: String,
        config: BoardConfig,
        questionsFilePath: String,
        numberOfTiles: Int
    ) {
        val questionsFile = File(questionsFilePath)
        if (!questionsFile.exists())
            throw FileNotFoundException(
                "Nie można znaleźć pliku $questionsFilePath")
        if (!questionsFile.isFile)
            throw FileNotFoundException("$questionsFilePath to nie plik")

        val questions = MoodleXmlParser.parse(questionsFile.inputStream())
        val categories = questions.getCategories()
        require(numberOfTiles >= categories.size) {
            "Liczba pól musi być większa lub równa liczbie kategorii"
        }

        val tiles = randomizeTilesNoNeighbours(categories, numberOfTiles)
        gameRegistry.register(
            BoardGame(name, config, categories, questions, tiles))
    }

    /** Randomizes tiles so that no tiles of the same category are neighbours */
    fun randomizeTilesNoNeighbours(
        categories: List<String>,
        numberOfTiles: Int
    ): List<Tile> {
        val result = mutableListOf<Tile>()
        var index = 0
        var tmpCategories = categories.toMutableSet()
        while (index < numberOfTiles) {
            val category = tmpCategories.random()
            tmpCategories.remove(category)

            result.add(Tile(category, index++))
            if (tmpCategories.isEmpty()) {
                tmpCategories = categories.toMutableSet()
            }
        }
        return result
    }

    fun getLeaderboard(): List<PlayerDto> =
        game.getTop5Players().map { it.toDto() }

    fun getCategories(): List<Category> = game.categories
}
