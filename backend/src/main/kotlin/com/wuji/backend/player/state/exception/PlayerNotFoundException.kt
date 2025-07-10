package com.wuji.backend.player.state.exception

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
class PlayerNotFoundException(index: Int) : RuntimeException("Nie znaleziono gracza o indexie ucznia $index.")
