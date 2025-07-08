package com.wuji.backend.question.common.exception

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

@ResponseStatus(HttpStatus.BAD_REQUEST)
class QuestionAlreadyAnsweredException(questionId: Int) :
    RuntimeException("Gracz już odpowiedział na pytanie o id $questionId.")