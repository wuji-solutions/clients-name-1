package com.wuji.backend.security.validator.exception

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

@ResponseStatus(HttpStatus.BAD_REQUEST)
class InvalidGameStateException(message: String) : RuntimeException(message)
