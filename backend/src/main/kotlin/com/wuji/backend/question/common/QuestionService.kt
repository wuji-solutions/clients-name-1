package com.wuji.backend.question.common

interface QuestionService {
    fun getAnswers(playerIndex: Int): List<PlayerAnswer>

    fun answerQuestion(
        playerIndex: Int,
        questionId: Int,
        answerId: Int
    ): Boolean
}
