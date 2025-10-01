package com.wuji.backend.game.common.exception

import com.wuji.backend.game.common.GameState
import com.wuji.backend.game.common.toPolish
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

@ResponseStatus(HttpStatus.CONFLICT)
class GameInIncorrectStateException(expected: String, actual: String) :
    RuntimeException(
        "Gra powinna być w stanie: ${expected}, ale jest: $actual") {

    constructor(
        expected: GameState,
        actual: GameState
    ) : this(expected.toPolish(), actual.toPolish())
}
