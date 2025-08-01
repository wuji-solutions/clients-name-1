package com.wuji.backend.question.common

interface QuestionService {
    fun getAnswers(playerIndex: Int): List<PlayerAnswer>

    fun answerQuestion(
        playerIndex: Int,
        answerIds: Set<Int>
    ): Boolean
}
