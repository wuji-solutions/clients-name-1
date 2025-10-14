package com.wuji.backend.dispenser

import com.wuji.backend.dispenser.exception.NoMoreQuestionsException
import com.wuji.backend.question.common.Question

class PlayerDispenser(
    val baseQuestions: List<Question>,
    val additionalQuestions: List<Question>,
) {
    private var currentBaseIndex = 0

    // combining it into one list makes traversing it much easier. I left constructor arguments as
    // attributes in case we need to distinguish base questions from additional ones
    private val combinedQuestions =
        listOf(baseQuestions, additionalQuestions).flatten()

    fun nextQuestion(): Question =
        if (currentBaseIndex < combinedQuestions.lastIndex) {
            combinedQuestions[++currentBaseIndex]
        } else {
            throw NoMoreQuestionsException()
        }

    fun currentQuestion(): Question = combinedQuestions[currentBaseIndex]

    fun previousQuestion(): Question =
        if (currentBaseIndex > 0) {
            combinedQuestions[--currentBaseIndex]
        } else {
            throw NoMoreQuestionsException()
        }

    fun getCurrentQuestionNumber(): Int = currentBaseIndex

    fun getBaseSize(): Int = baseQuestions.size
}
