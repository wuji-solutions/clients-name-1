package com.wuji.backend.security.validator.exception

import com.wuji.backend.game.GameType
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

@ResponseStatus(HttpStatus.CONFLICT)
class InvalidGameTypeException(expected: GameType, actual: GameType) :
    RuntimeException(
        "Wymagana gra to ${expected.toPolish()}, " +
            "a aktualna to ${actual.toPolish()}")
