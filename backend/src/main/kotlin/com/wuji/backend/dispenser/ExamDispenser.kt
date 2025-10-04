package com.wuji.backend.dispenser

import com.wuji.backend.config.DifficultyLevel
import com.wuji.backend.player.state.Player
import com.wuji.backend.player.state.PlayerDetails
import com.wuji.backend.player.state.PlayerIndex
import com.wuji.backend.question.common.Question

class ExamDispenser {
    val dispensers: MutableMap<PlayerIndex, PlayerDispenser> = mutableMapOf()

    fun initialize(
        players: Set<Player<out PlayerDetails>>,
        questions: List<Question>,
        requiredQuestionCount: Int,
        randomizeQuestions: Boolean,
        enforceDifficultyBalance: Boolean,
    ) {
        for (player in players) {
            val questions =
                shuffleQuestions(
                    questions, randomizeQuestions, enforceDifficultyBalance)
            dispensers.put(
                player.index,
                PlayerDispenser(
                    questions.subList(0, requiredQuestionCount),
                    questions
                        .subList(requiredQuestionCount, questions.size)
                        .toMutableSet()))
        }
    }

    fun initialize(
        players: Set<Player<out PlayerDetails>>,
        questions: List<Question>,
        selectedQuestionIds: Set<Int>
    ) {
        val baseQuestions =
            questions.filter { selectedQuestionIds.contains(it.id) }

        for (player in players) {
            dispensers.put(
                player.index,
                PlayerDispenser(
                    baseQuestions,
                    questions
                        .filter { !selectedQuestionIds.contains(it.id) }
                        .toMutableSet()))
        }
    }

    fun nextQuestion(playerIndex: PlayerIndex): Question {
        return dispensers[playerIndex]?.nextQuestion()
            ?: throw IndexOutOfBoundsException()
    }

    fun currentQuestion(playerIndex: PlayerIndex): Question =
        dispensers[playerIndex]?.currentQuestion()
            ?: throw IndexOutOfBoundsException()

    fun previousQuestion(playerIndex: PlayerIndex): Question =
        dispensers[playerIndex]?.previousQuestion()
            ?: throw IndexOutOfBoundsException()

    fun shuffleQuestions(
        questions: List<Question>,
        randomizeQuestions: Boolean,
        enforceDifficultyBalance: Boolean
    ): List<Question> {
        return if (randomizeQuestions && !enforceDifficultyBalance) {
            questions.shuffled()
        } else if (randomizeQuestions) {
            shuffleBalanceQuestions(questions)
        } else {
            questions
        }
    }

    fun shuffleBalanceQuestions(questions: List<Question>): List<Question> {
        val result = mutableListOf<Question>()
        val tmp = questions.toMutableList()

        var difficulties = DifficultyLevel.values().toSet().toMutableSet()
        var currentDifficulty =
            difficulties.random().also { difficulties -= it }

        while (tmp.isNotEmpty()) {
            tmp.first { it.difficultyLevel == currentDifficulty }
                .also {
                    result.add(it)
                    tmp.remove(it)
                }

            if (difficulties.isEmpty())
                difficulties = DifficultyLevel.values().toSet().toMutableSet()
            currentDifficulty =
                difficulties.random().also { difficulties -= it }
        }
        return result
    }
}
