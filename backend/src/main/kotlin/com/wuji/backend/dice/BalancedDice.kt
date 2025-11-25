package com.wuji.backend.dice

import com.wuji.backend.config.DifficultyLevel
import com.wuji.backend.game.board.Tile
import com.wuji.backend.player.state.BoardPlayer
import com.wuji.backend.player.state.Category
import kotlin.math.ln
import kotlin.random.Random

/**
 * A balanced dice that ensures players progress evenly across different
 * categories.
 *
 * Uses the Gumbel-Max sampling for weighted sampling
 *
 * instead of explicitly computing probabilities, we add Gumbel noise to
 * log-weights and pick the maximum. This is mathematically equivalent to
 * weighted sampling but more elegant and numerically stable.
 *
 * roll weight = difficulty score * recency multiplier
 */
class BalancedDice(
    private val tiles: List<Tile>,
    private val random: Random = Random.Default
) : GameDice<BoardPlayer> {

    companion object {
        private const val MIN_ROLL = 1
        private const val MAX_ROLL = 6

        // higher score = more likely to be selected
        private val DIFFICULTY_SCORES =
            mapOf(
                    DifficultyLevel.EASY to 2.0,
                    DifficultyLevel.MEDIUM to 1.5,
                    DifficultyLevel.HARD to 1.0)
                .withDefault { 2.0 }

        private val RECENCY_PENALTIES =
            listOf(
                0.05, // current category: 95% penalty
                0.5, // last category: 50% penalty
                0.7, // ywo steps back: 30% penalty
                0.9 // three steps back: 10% penalty
                )
    }

    override fun roll(player: BoardPlayer): Int {
        val currentPosition = player.details.currentTileIndex
        val categoryDifficulties = player.details.categoryToDifficulty
        val categoryHistory = getCategoryHistory(player)

        // all possible rolls
        val scoredRolls =
            (MIN_ROLL..MAX_ROLL).map { rollValue ->
                val targetTileIndex = (currentPosition + rollValue) % tiles.size
                val targetCategory = tiles[targetTileIndex].category
                val score =
                    calculateScore(
                        targetCategory, categoryDifficulties, categoryHistory)

                ScoredRoll(rollValue, score)
            }

        return gumbelMaxSample(scoredRolls)
    }

    private fun gumbelMaxSample(scoredRolls: List<ScoredRoll>): Int {
        return scoredRolls
            .map { roll ->
                val logWeight = ln(roll.score)
                val gumbelNoise = sampleGumbel()
                val noisedScore = logWeight + gumbelNoise

                GumbelNoisedRoll(roll.value, noisedScore)
            }
            .maxByOrNull { it.noisedScore }
            ?.value ?: MIN_ROLL
    }

    /**
     * uses the inverse CDF method: If U ~ Uniform(0,1), then -log(-log(U)) ~
     * Gumbel(0,1)
     */
    private fun sampleGumbel(): Double {
        val u = random.nextDouble()
        return -ln(-ln(u))
    }

    private fun calculateScore(
        category: Category,
        categoryDifficulties: Map<Category, DifficultyLevel>,
        categoryHistory: List<Category>
    ): Double {
        val difficulty = categoryDifficulties.getValue(category)
        val baseScore = DIFFICULTY_SCORES.getValue(difficulty)
        val recencyMultiplier = getRecencyMultiplier(category, categoryHistory)

        return baseScore * recencyMultiplier
    }

    private fun getCategoryHistory(player: BoardPlayer): List<Category> {
        return player.details.answers
            .asReversed()
            .map { it.question.category }
            .distinct()
            .take(RECENCY_PENALTIES.size)
    }

    private fun getRecencyMultiplier(
        category: Category,
        categoryHistory: List<Category>
    ): Double {
        val positionInHistory = categoryHistory.indexOf(category)

        return if (positionInHistory == -1) {
            1.0
        } else {
            RECENCY_PENALTIES.getOrElse(positionInHistory) { 1.0 }
        }
    }

    private data class ScoredRoll(val value: Int, val score: Double)

    private data class GumbelNoisedRoll(
        val value: Int,
        val noisedScore: Double
    )
}
