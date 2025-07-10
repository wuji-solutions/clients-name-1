package com.wuji.backend.error

import org.springframework.http.HttpStatus
import org.springframework.http.HttpStatusCode
import org.springframework.http.ProblemDetail
import org.springframework.web.ErrorResponse
import java.time.LocalDateTime

data class BasicErrorResponse (
    val status: Int,
    val message: String?,
    val timestamp: LocalDateTime = LocalDateTime.now(),
) : ErrorResponse {
    override fun getStatusCode(): HttpStatusCode = HttpStatus.valueOf(status)

    override fun getBody(): ProblemDetail {
        val detail = ProblemDetail.forStatusAndDetail(HttpStatus.valueOf(status), message)
        detail.setProperty("timestamp", timestamp)
        return detail
    }

}