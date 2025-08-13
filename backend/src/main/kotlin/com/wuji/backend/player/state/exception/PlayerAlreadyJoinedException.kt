package com.wuji.backend.player.state.exception

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

@ResponseStatus(HttpStatus.ALREADY_REPORTED)
class PlayerAlreadyJoinedException(nickname: String, index: Int) :
    RuntimeException("Gracz o nicku $nickname i indeksie $index już dołączył.")
