package com.wuji.backend.question.common.exception

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

@ResponseStatus(code = HttpStatus.BAD_REQUEST)
class InvalidAnswerIdException(answerId: Int) :
    IllegalArgumentException("Nie ma odpowiedzi z id $answerId.")
