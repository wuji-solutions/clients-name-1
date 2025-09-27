package com.wuji.backend.dispenser

import com.wuji.backend.config.DifficultyLevel
import com.wuji.backend.player.state.Category
import com.wuji.backend.question.common.Question

class BoardDispenser(
    private val categories: List<Category>,
    questions: List<Question>
) : GameDispenser() {

    override val dispensers: MutableMap<Int, Dispenser> = mutableMapOf()

    // TODO: either this or we create (Category, Difficulty) -> Questions map // wouldn't need to
    // filter in getQuestion()
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
                    it !in previousQuestions
            }

        if (available.isEmpty()) {
            return dispenser.questions
                .filter { it.difficultyLevel == difficultyLevel }
                .random()
        }

        return available.random()
    }
}
