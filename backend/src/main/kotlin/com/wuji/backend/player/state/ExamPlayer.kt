package com.wuji.backend.player.state

import com.wuji.backend.config.DifficultyLevel
import com.wuji.backend.question.common.Question
import com.wuji.backend.question.common.points

class ExamPlayerDetails(
    val askedQuestions: MutableList<Question> = mutableListOf(),
    var firstGetCurrentQuestionTime: Long? = null
) : PlayerDetails() {
    fun points(
        pointsPerDifficulty: Map<DifficultyLevel, Int>,
        zeroPointsOnCheating: Boolean
    ): Int =
        answers.sumOf { it.points(pointsPerDifficulty, zeroPointsOnCheating) }
}

typealias ExamPlayer = Player<ExamPlayerDetails>
