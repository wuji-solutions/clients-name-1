package com.wuji.backend.game.common.dto

import jakarta.validation.constraints.Min

data class JoinGameRequestDto(
    @Min(1, message = "Index ucznia powinien wynosic conajmniej 1.")
    val index: Int
)
