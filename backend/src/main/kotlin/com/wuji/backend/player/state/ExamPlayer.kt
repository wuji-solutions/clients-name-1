package com.wuji.backend.player.state

import com.wuji.backend.question.common.Question

class ExamPlayerDetails(
    val askedQuestions: MutableList<Question> = mutableListOf(),
    var points: Int = 0,
    var firstGetCurrentQuestionTime: Long? = null
) : PlayerDetails()

typealias ExamPlayer = Player<ExamPlayerDetails>
