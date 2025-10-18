package com.wuji.backend.game.common.exception

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

@ResponseStatus(HttpStatus.BAD_REQUEST)
class NotEnoughPlayersException() :
    RuntimeException("Przynajmniej 1 gracz musi być aby rozpocząć rozgrywkę.")
