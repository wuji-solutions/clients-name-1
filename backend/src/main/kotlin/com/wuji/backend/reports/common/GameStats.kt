package com.wuji.backend.reports.common

import com.wuji.backend.config.GameConfig
import com.wuji.backend.game.common.AbstractGame
import com.wuji.backend.player.state.PlayerDetails
import org.yaml.snakeyaml.util.Tuple

abstract class GameStats {
    companion object {
        fun countPlayersAnsweredForQuestion(
            game: AbstractGame<out PlayerDetails, out GameConfig>,
            questionId: Int
        ): Int =
            game.players.count { player -> player.alreadyAnswered(questionId) }

        fun countCorrectIncorrectAnswersForQuestion(
            game: AbstractGame<out PlayerDetails, out GameConfig>,
            questionId: Int
        ): Pair<Int,Int> {
            val playersAnswered = game.players.filter { player -> player.alreadyAnswered(questionId) }
            val correctAnswers = playersAnswered
                .count { player -> player.answerForQuestion(questionId).isCorrect }
            return Pair(correctAnswers,playersAnswered.size - correctAnswers)
        }

    }
}
