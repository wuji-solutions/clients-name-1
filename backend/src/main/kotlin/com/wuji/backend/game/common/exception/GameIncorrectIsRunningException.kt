package com.wuji.backend.game.common.exception

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

@ResponseStatus(HttpStatus.BAD_REQUEST)
class GameIncorrectIsRunningException(expected: Boolean, actual: Boolean) :
    IllegalArgumentException(
        "Gra powinna być ${if (expected) "włączona" else "wyłączona"}," +
                " a jest ${if (actual) "włączona" else "wyłączona"}"
    ) {
}