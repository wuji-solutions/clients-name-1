package com.wuji.backend.events.common.dto

interface SSEEvent {
    val name: String
    val data: Any
}
