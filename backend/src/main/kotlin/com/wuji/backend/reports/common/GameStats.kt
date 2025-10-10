package com.wuji.backend.reports.common

import com.wuji.backend.config.GameConfig
import com.wuji.backend.game.GameType
import com.wuji.backend.game.common.AbstractGame
import com.wuji.backend.game.quiz.QuizGame
import com.wuji.backend.player.state.Player
import com.wuji.backend.player.state.PlayerDetails
import com.wuji.backend.player.state.PlayerIndex
import com.wuji.backend.question.common.Question
import com.wuji.backend.reports.common.data.AnswerSummary

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

        fun countCorrectAnswersForPlayer(
            game: AbstractGame<out PlayerDetails, out GameConfig>,
            playerIndex: PlayerIndex
        ): Int {
            return when (game.gameType) {
                GameType.QUIZ ->
                    countCorrectAnswersForPlayer(game as QuizGame, playerIndex)
                else -> {
                    val player = game.findPlayerByIndex(playerIndex)
                    player.details.answers.count { !it.isCorrect }
                }
            }
        }

        fun countIncorrectAnswersForPlayer(
            game: AbstractGame<out PlayerDetails, out GameConfig>,
            playerIndex: PlayerIndex
        ): Int {
            return when (game.gameType) {
                GameType.QUIZ ->
                    countIncorrectAnswersForPlayer(
                        game as QuizGame, playerIndex)
                else -> {
                    val player = game.findPlayerByIndex(playerIndex)
                    player.details.answers.count { !it.isCorrect }
                }
            }
        }

        fun countCorrectAnswersForPlayer(
            game: QuizGame,
            playerIndex: PlayerIndex
        ): Int {
            val player = game.findPlayerByIndex(playerIndex)
            return game.questions.count { question ->
                player.alreadyAnswered(question.id) &&
                    player.answerForQuestion(question.id).isCorrect
            }
        }

        fun countIncorrectAnswersForPlayer(
            game: QuizGame,
            playerIndex: PlayerIndex
        ): Int {
            val player = game.findPlayerByIndex(playerIndex)
            return game.questions.count { question ->
                player.alreadyAnswered(question.id) &&
                    !player.answerForQuestion(question.id).isCorrect
            }
        }

        fun sumTotalAnswerTimeInMillis(
            game: AbstractGame<out PlayerDetails, out GameConfig>,
            playerIndex: PlayerIndex
        ): Long {
            val player = game.findPlayerByIndex(playerIndex)
            return player.details.answers.sumOf { answer ->
                answer.answerTimeInMilliseconds
            }
        }

        fun getMaximumAnswersCount(questions: List<Question>): Int =
            questions.maxOf { question -> question.answers.size }

        /**
         * Count how many players answered per each question
         *
         * @return List of AnswerSummary
         */
        fun countAnswersForQuestion(
            question: Question,
            players: List<Player<out PlayerDetails>>
        ): List<AnswerSummary> {
            val answerIdToSummary =
                question.answers.associate { answer ->
                    answer.id to AnswerSummary(answer.id, answer.text, 0)
                }

            players.forEach { player ->
                player.details.answers
                    .firstOrNull { it.question.id == question.id }
                    ?.let { answer ->
                        answer.selectedIds.forEach { answerId ->
                            answerIdToSummary[answerId]?.let { summary ->
                                summary.answerCount++
                            }
                        }
                    }
            }
            return answerIdToSummary.values.toList()
        }
    }
}
