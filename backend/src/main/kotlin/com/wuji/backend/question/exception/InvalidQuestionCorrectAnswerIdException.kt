package com.wuji.backend.question.exception

class InvalidQuestionCorrectAnswerIdException(
    correctAnswerId: Int
) : IllegalArgumentException("Nie ma odpowiedzi z indexem $correctAnswerId.")
