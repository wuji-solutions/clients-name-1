package com.wuji.backend.game.common.exception

import com.wuji.backend.config.GameConfig
import com.wuji.backend.game.GameType
import com.wuji.backend.game.common.AbstractGame
import com.wuji.backend.player.state.PlayerDetails
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

@ResponseStatus(code = HttpStatus.CONFLICT)
class IncorrectGameTypeException(
    expected: GameType,
    actual: Class<out AbstractGame<out PlayerDetails, out GameConfig>>,
) :
    IllegalArgumentException(
        "Niepoprawny rodzaj gry. Oczekiwany: $expected, przekazany: $actual")
