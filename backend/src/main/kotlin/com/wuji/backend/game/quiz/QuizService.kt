package com.wuji.backend.game.quiz

import com.wuji.backend.game.common.Question
import com.wuji.backend.game.quiz.exception.QuestionIndexOutOfBoundsException
import com.wuji.backend.util.ext.getOrThrow
import org.springframework.stereotype.Service

@Service
class QuizService(private val questions: List<Question>) {

    fun getNthQuestion(n: Int) = questions.getOrThrow(n) { QuestionIndexOutOfBoundsException(n, questions.size) }
}
