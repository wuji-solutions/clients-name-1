package com.wuji.backend.question.common

data class Answer(val id: Int, val text: String, val feedback: String? = null) {
    companion object {
        private var counter: Int = 0

        fun create(content: String, feedback: String? = null): Answer {
            counter += 1
            return Answer(counter, content, feedback)
        }
    }
}

data class PlayerAnswer(
    val question: Question,
    val selectedIds: Set<Int>,
    val answerTimeInMilliseconds: Long,
    val cheated: Boolean
) {
    val isCorrect = question.areCorrectAnswerIds(selectedIds)
}
