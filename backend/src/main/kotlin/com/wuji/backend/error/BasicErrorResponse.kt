package com.wuji.backend.error

import java.time.LocalDateTime

data class BasicErrorResponse(
    val status: Int,
    val message: String?,
    val timestamp: LocalDateTime = LocalDateTime.now(),
)
