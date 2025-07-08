package com.wuji.backend.question.common.exception

class InvalidQuestionCorrectAnswerIdException(
    correctAnswerId: Int
) : IllegalArgumentException("Nie ma odpowiedzi z id $correctAnswerId.")
