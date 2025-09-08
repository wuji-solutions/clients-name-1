package com.wuji.backend.reports.common

import com.wuji.backend.config.GameConfig
import com.wuji.backend.game.GameType
import com.wuji.backend.game.common.AbstractGame
import com.wuji.backend.game.quiz.QuizGame
import com.wuji.backend.player.state.PlayerDetails
import com.wuji.backend.player.state.PlayerIndex

abstract class GameStats {
    companion object {
        fun countPlayersAnsweredForQuestion(
            game: AbstractGame<out PlayerDetails, out GameConfig>,
            questionId: Int
        ): Int =
            game.players.count { player -> player.alreadyAnswered(questionId) }

        fun countCorrectIncorrectAnswers(
            game: AbstractGame<out PlayerDetails, out GameConfig>,
            questionId: Int
        ): Pair<Int, Int> {
            val playersAnswered =
                game.players.filter { player ->
                    player.alreadyAnswered(questionId)
                }
            val correctAnswers =
                playersAnswered.count { player ->
                    player.answerForQuestion(questionId).isCorrect
                }
            return correctAnswers to playersAnswered.size - correctAnswers
        }

        fun countCorrectAnswersForGame(
            game: AbstractGame<out PlayerDetails, out GameConfig>,
            playerIndex: PlayerIndex
        ): Int {
            return when (game.gameType) {
                GameType.QUIZ ->
                    countCorrectAnswersForGame(game as QuizGame, playerIndex)
                GameType.EXAM -> TODO()
                GameType.BOARD -> TODO()
            }
        }

        fun countIncorrectAnswersForGame(
            game: AbstractGame<out PlayerDetails, out GameConfig>,
            playerIndex: PlayerIndex
        ): Int {
            return when (game.gameType) {
                GameType.QUIZ ->
                    countIncorrectAnswersForGame(game as QuizGame, playerIndex)
                GameType.EXAM -> TODO()
                GameType.BOARD -> TODO()
            }
        }

        fun countCorrectAnswersForGame(
            game: QuizGame,
            playerIndex: PlayerIndex
        ): Int {
            val player = game.findPlayerByIndex(playerIndex)
            return game.questions.count { question ->
                player.alreadyAnswered(question.id) &&
                    player.answerForQuestion(question.id).isCorrect
            }
        }

        fun countIncorrectAnswersForGame(
            game: QuizGame,
            playerIndex: PlayerIndex
        ): Int {
            val player = game.findPlayerByIndex(playerIndex)
            return game.questions.count { question ->
                player.alreadyAnswered(question.id) &&
                    !player.answerForQuestion(question.id).isCorrect
            }
        }
    }
}
