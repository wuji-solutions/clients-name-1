package com.wuji.backend.question.common.exception

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

@ResponseStatus(HttpStatus.BAD_REQUEST)
class QuestionNotYetAnsweredException(questionId: Int) :
    RuntimeException(
        "Gracz jeszcze nie odpowiedział na pytanie o id $questionId.")
