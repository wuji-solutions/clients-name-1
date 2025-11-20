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
        println("Dispenser has questions: ${dispenser.questions.size}")
        val available =
            dispenser.questions.filter {
                it.difficultyLevel == difficultyLevel &&
                    previousQuestions.none { question -> question.id == it.id }
            }
        println("Available questions: ${available.size} xd")
        if (available.isEmpty()) throw NoMoreQuestionsException()

        return available.random()
    }
}
