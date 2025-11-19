package com.wuji.backend.dispenser.exception

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

@ResponseStatus(HttpStatus.FORBIDDEN)
class CannotGoBackException :
    RuntimeException(
        "Nie można cofać się do pytań podstawowych lub poprzednich pytań dodatkowych")
