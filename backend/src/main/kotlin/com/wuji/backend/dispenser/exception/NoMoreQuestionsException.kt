package com.wuji.backend.dispenser.exception

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

@ResponseStatus(HttpStatus.NO_CONTENT)
class NoMoreQuestionsException : RuntimeException("Nie ma więcej pytań")
