package com.wuji.backend.events.exam.dto

data class PlayerCheatedDto(
    val nickname: String,
    val index: Int,
    val questionId: Int
)
