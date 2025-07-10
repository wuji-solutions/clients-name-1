package com.wuji.backend.game.quiz.exception

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

@ResponseStatus(HttpStatus.BAD_REQUEST)
class QuestionIndexOutOfBoundsException(
    requestedIndex: Int,
    totalQuestions: Int
) : IndexOutOfBoundsException(
    "Index $requestedIndex wychodzi poza granice listy z pytaniami. Liczba pytan: $totalQuestions."
)
