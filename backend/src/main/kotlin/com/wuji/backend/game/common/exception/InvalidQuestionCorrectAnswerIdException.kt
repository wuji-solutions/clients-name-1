package com.wuji.backend.game.common.exception

class InvalidQuestionCorrectAnswerIdException(
    correctAnswerId: Int
) : IllegalArgumentException("Nie ma odpowiedzi z indexem $correctAnswerId.")
