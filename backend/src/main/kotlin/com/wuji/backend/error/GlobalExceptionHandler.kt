package com.wuji.backend.error

import jakarta.servlet.http.HttpServletRequest
import java.time.LocalDateTime
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.ErrorResponse
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class GlobalExceptionHandler {
    @ExceptionHandler(Exception::class)
    fun handleException(
        request: HttpServletRequest,
        ex: Exception
    ): ResponseEntity<ErrorResponse> {
        val contentType = request.getHeader("Accept") ?: ""
        if (contentType.contains("text/event-stream")) {
            // For SSE requests, just complete without a response body
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build()
        }
        val responseStatus =
            ex.javaClass.getAnnotation(ResponseStatus::class.java)?.value
                ?: HttpStatus.INTERNAL_SERVER_ERROR
        val errorResponse =
            BasicErrorResponse(
                responseStatus.value(),
                ex.localizedMessage,
                LocalDateTime.now())
        return ResponseEntity.status(responseStatus).body(errorResponse)
    }
}
