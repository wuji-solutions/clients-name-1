package com.wuji.backend.question.board

import com.wuji.backend.events.board.SSEBoardService
import com.wuji.backend.events.common.dto.toLeaderboardPlayerDto
import com.wuji.backend.game.GameRegistry
import com.wuji.backend.game.board.BoardGame
import com.wuji.backend.question.common.PlayerAnswer
import com.wuji.backend.question.common.Question
import com.wuji.backend.question.common.QuestionService
import org.springframework.stereotype.Service

@Service
class BoardQuestionService(
    val gameRegistry: GameRegistry,
    val sseBoardService: SSEBoardService
) : QuestionService() {

    private val game: BoardGame
        get() = gameRegistry.getAs(BoardGame::class.java)

    override fun getAnswers(playerIndex: Int): List<PlayerAnswer> {
        return game.findPlayerByIndex(playerIndex).details.answers
    }

    fun getQuestion(playerIndex: Int): Question {
        val player = game.findPlayerByIndex(playerIndex)
        val details = player.details
        details.currentQuestion?.let {
            return it
        }

        val currentTileIndex = details.currentTileIndex
        val tile = game.tiles[currentTileIndex]
        val difficulty = details.categoryToDifficulty.getValue(tile.category)
        val previousQuestions = details.askedQuestions.toSet()

        val newQuestion =
            game.questionDispenser.getQuestion(
                tile.category, difficulty, previousQuestions)
        details.currentQuestion = newQuestion

        return newQuestion
    }

    fun getQuestionAndMarkTime(playerIndex: Int): Question {
        val player = game.findPlayerByIndex(playerIndex)
        if (player.details.firstGetCurrentQuestionTime == null) {
            player.details.firstGetCurrentQuestionTime =
                System.currentTimeMillis()
        }
        return getQuestion(playerIndex)
    }

    fun answerBoardQuestion(playerIndex: Int, answerIds: Set<Int>): Boolean {
        val question = getQuestion(playerIndex)
        val player = game.findPlayerByIndex(playerIndex)
        player.details.askedQuestions.add(question)

        val top5Players = game.getTop5Players()
        val minimumPoints = top5Players.last().details.points

        val firstGetCurrentQuestionTime =
            player.details.firstGetCurrentQuestionTime
                ?: throw IllegalStateException(
                    "It appears you answered the question before retrieving it first")
        val answerTime =
            System.currentTimeMillis() - firstGetCurrentQuestionTime

        return answerQuestion(player, question, answerIds, answerTime)
            .also { checkForDifficultyPromotion(playerIndex) }
            .also {
                //          reset the time, it will be set on the next getQuestionAndMarkTime()
                player.details.firstGetCurrentQuestionTime = null
                player.details.currentQuestion = null
            }
            .also { answeredCorrectly ->
                if (answeredCorrectly)
                    player.details.points +=
                        game.config.pointsPerDifficulty.getValue(
                            question.difficultyLevel)
            }
            .also {
                if (player.details.points >= minimumPoints ||
                    top5Players.size < 5)
                    sseBoardService.sendNewLeaderboardStateEvent(
                        game.getTop5Players().map {
                            it.toLeaderboardPlayerDto()
                        },
                        game.config.showLeaderboard)
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
