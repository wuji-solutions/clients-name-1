package com.wuji.backend.player.state

import com.wuji.backend.config.DifficultyLevel
import com.wuji.backend.question.common.Question

class ExamPlayerDetails(
    val askedQuestions: MutableList<Question> = mutableListOf(),
    var firstGetCurrentQuestionTime: Long? = null
) : PlayerDetails() {
    fun getPoints(
        pointsPerDifficulty: Map<DifficultyLevel, Int>,
        zeroPointsOnCheating: Boolean
    ): Int =
        answers.sumOf { answer ->
            if (!answer.isCorrect || (answer.cheated && zeroPointsOnCheating)) 0
            else pointsPerDifficulty.getValue(answer.question.difficultyLevel)
        }
}

typealias ExamPlayer = Player<ExamPlayerDetails>
