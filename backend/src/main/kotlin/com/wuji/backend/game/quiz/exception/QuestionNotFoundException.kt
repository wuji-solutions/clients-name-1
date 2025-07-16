package com.wuji.backend.game.quiz.exception

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

@ResponseStatus(HttpStatus.BAD_REQUEST)
class QuestionNotFoundException(questionId: Int) :
    IllegalArgumentException("Pytanie o id: $questionId nie istnieje.")