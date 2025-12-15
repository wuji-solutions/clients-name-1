package com.wuji.backend.dispenser

import com.wuji.backend.config.DifficultyLevel
import com.wuji.backend.dispenser.exception.NoMoreQuestionsException
import com.wuji.backend.player.state.Category
import com.wuji.backend.question.common.Question

class BoardDispenser(
    private val categories: List<Category>,
    questions: List<Question>
) : GameDispenser() {

    override val dispensers: MutableMap<Int, Dispenser> = mutableMapOf()

    init {
        categories.forEachIndexed { index, category ->
            val questionsForCategory =
                questions.filter { it.category == category }.toMutableList()
            dispensers[index] = Dispenser(questionsForCategory)
        }
    }

    fun getQuestion(
        category: Category,
        difficultyLevel: DifficultyLevel,
        previousQuestions: Set<Question>
    ): Question {
        val categoryIndex = categories.indexOf(category)
        require(categoryIndex != -1) { "Nieznana kategoria: $category" }

        val dispenser =
            dispensers[categoryIndex]
                ?: throw NoSuchElementException(
                    "Brak dispensera dla kategorii ${category}")
        val available =
            dispenser.questions.filter {
                it.difficultyLevel == difficultyLevel &&
                    previousQuestions.none { question -> question.id == it.id }
            }
        if (available.isEmpty()) {
            val notAnsweredYet =
                dispenser.questions.filter {
                    previousQuestions.none { question -> question.id == it.id }
                }
            if (notAnsweredYet.isEmpty())
                return getQuestionFromRandomCategory(previousQuestions)
            return notAnsweredYet.random()
        }

        return available.random()
    }

    private fun getQuestionFromRandomCategory(
        previousQuestions: Set<Question>
    ): Question {
        val categoryIndices = dispensers.keys.shuffled()

        for (i in categoryIndices) {
            val dispenser = dispensers[i] ?: throw NoSuchElementException()
            val available =
                dispenser.questions.filter {
                    previousQuestions.none { question -> question.id == it.id }
                }
            if (available.isNotEmpty()) return available.random()
        }
        throw NoMoreQuestionsException()
    }
}
