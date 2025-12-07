package com.wuji.backend.dispenser

import com.wuji.backend.config.DifficultyLevel
import com.wuji.backend.player.state.Player
import com.wuji.backend.player.state.PlayerDetails
import com.wuji.backend.player.state.PlayerIndex
import com.wuji.backend.question.common.Answer
import com.wuji.backend.question.common.Question
import com.wuji.backend.question.common.QuestionType
import com.wuji.backend.question.common.TextFormat

class ExamDispenser {
    companion object {
        private val additionalFeedbackQuestion =
            Question(
                id = 999,
                category = "",
                type = QuestionType.TEXT,
                text = "Jak ci się podobał sprawdzian",
                textFormat = TextFormat.HTML,
                answers =
                    listOf(
                        Answer.create("Bardzo mi się podobał"),
                        Answer.create("Podobał mi się"),
                        Answer.create("Było ok"),
                        Answer.create("Nie podobał mi się"),
                        Answer.create("Wcale mi się nie podobał")),
                correctAnswerIds = setOf(),
                difficultyLevel = DifficultyLevel.EASY,
                images = null,
                tags = listOf(),
            )
    }

    val dispensers: MutableMap<PlayerIndex, PlayerDispenser> = mutableMapOf()

    fun initialize(
        players: Set<Player<out PlayerDetails>>,
        questions: List<Question>,
        requiredQuestionCount: Int,
        randomizeQuestions: Boolean,
        enforceDifficultyBalance: Boolean,
        withAdditionalFeedbackQuestion: Boolean = true,
    ) {
        for (player in players) {
            val questions =
                shuffleQuestions(
                    questions, randomizeQuestions, enforceDifficultyBalance)
            val additionalQuestions =
                questions.subList(requiredQuestionCount, questions.size).let {
                    if (withAdditionalFeedbackQuestion)
                        it + additionalFeedbackQuestion
                    else it
                }
            dispensers.put(
                player.index,
                PlayerDispenser(
                    questions.subList(0, requiredQuestionCount),
                    additionalQuestions,
                ))
        }
    }

    fun initialize(
        players: Set<Player<out PlayerDetails>>,
        questions: List<Question>,
        selectedQuestionIds: Set<Int>,
        withAdditionalFeedbackQuestion: Boolean = true
    ) {
        val baseQuestions =
            questions.filter { selectedQuestionIds.contains(it.id) }
        val additionalQuestions =
            questions
                .filter { !selectedQuestionIds.contains(it.id) }
                .let {
                    if (withAdditionalFeedbackQuestion)
                        it + additionalFeedbackQuestion
                    else it
                }

        for (player in players) {
            dispensers.put(
                player.index,
                PlayerDispenser(baseQuestions, additionalQuestions))
        }
    }

    /**
     * Moves to the next questions and returns it This question will now be
     * current question
     */
    fun nextQuestion(playerIndex: PlayerIndex): Question {
        return dispensers[playerIndex]?.nextQuestion()
            ?: throw IndexOutOfBoundsException()
    }

    fun currentQuestion(playerIndex: PlayerIndex): Question =
        dispensers[playerIndex]?.currentQuestion()
            ?: throw IndexOutOfBoundsException()

    /**
     * Moves to the previous questions and returns it This question will now be
     * current question
     */
    fun previousQuestion(playerIndex: PlayerIndex): Question =
        dispensers[playerIndex]?.previousQuestion()
            ?: throw IndexOutOfBoundsException()

    private fun shuffleQuestions(
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

    private fun shuffleBalanceQuestions(
        questions: List<Question>
    ): List<Question> {
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

    fun getCurrentQuestionNumber(playerIndex: PlayerIndex): Int =
        dispensers[playerIndex]?.getCurrentQuestionNumber()
            ?: throw IndexOutOfBoundsException()

    fun getBaseSize(playerIndex: PlayerIndex): Int =
        dispensers[playerIndex]?.getBaseSize()
            ?: throw IndexOutOfBoundsException()
}
