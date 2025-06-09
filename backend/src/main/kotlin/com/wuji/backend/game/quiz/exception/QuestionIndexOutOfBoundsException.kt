package com.wuji.backend.game.quiz.exception

class QuestionIndexOutOfBoundsException(
    requestedIndex: Int,
    totalQuestions: Int
) : IndexOutOfBoundsException(
    "Index $requestedIndex wychodzi poza granice listy z pytaniami. Liczba pytan: $totalQuestions."
)
