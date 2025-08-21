package com.wuji.backend.question.board

import com.wuji.backend.game.GameRegistry
import com.wuji.backend.game.board.BoardGame
import com.wuji.backend.question.common.PlayerAnswer
import com.wuji.backend.question.common.Question
import com.wuji.backend.question.common.QuestionService
import org.springframework.stereotype.Service

@Service
class BoardQuestionService(
    val gameRegistry: GameRegistry,
) : QuestionService() {

    private val game: BoardGame
        get() = gameRegistry.getAs(BoardGame::class.java)

    override fun getAnswers(playerIndex: Int): List<PlayerAnswer> {
        return game.findPlayerByIndex(playerIndex).details.answers
    }

    fun getQuestion(playerIndex: Int): Question {
        val player = game.findPlayerByIndex(playerIndex)
        val currentTileIndex = player.details.currentTileIndex
        val tile = game.tiles[currentTileIndex]
        val difficulty =
            player.details.categoryToDifficulty.getValue(tile.category)
        val previousQuestions = player.details.askedQuestions.toSet()

        return game.questionDispenser.getQuestion(
            tile.category, difficulty, previousQuestions)
    }

    fun answerBoardQuestion(playerIndex: Int, answerIds: Set<Int>): Boolean {
        val question = getQuestion(playerIndex)
        val player = game.findPlayerByIndex(playerIndex)
        player.details.askedQuestions.add(question)

        return answerQuestion(player, question, answerIds).also {
            checkForDifficultyPromotion(playerIndex)
        }
    }

    fun checkForDifficultyPromotion(playerIndex: Int) {
        val question = getQuestion(playerIndex)
        val player = game.findPlayerByIndex(playerIndex)

        val correctAnswersNeeded =
            game.config.rankingPromotionRules.getValue(question.category)
        val correctAnswers =
            player.details.askedQuestions.count { q ->
                q.category == question.category &&
                    q.difficultyLevel == question.difficultyLevel
            }

        if (correctAnswers == correctAnswersNeeded) {
            player.details.categoryToDifficulty[question.category] =
                player.details.categoryToDifficulty
                    .getValue(question.category)
                    .next()
        }
    }
}
