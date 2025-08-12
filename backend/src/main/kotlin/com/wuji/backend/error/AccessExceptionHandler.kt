package com.wuji.backend.error

import jakarta.servlet.http.HttpServletRequest
import java.time.LocalDateTime
import org.springframework.core.Ordered
import org.springframework.core.annotation.Order
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.AccessDeniedException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE)
class AccessExceptionHandler {

    @ExceptionHandler(AccessDeniedException::class)
    fun handleAccessDeniedException(
        request: HttpServletRequest,
        ex: Exception
    ): ResponseEntity<BasicErrorResponse> {
        val errorResponse =
            BasicErrorResponse(
                HttpStatus.FORBIDDEN.value(),
                ex.localizedMessage,
                LocalDateTime.now())
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse)
    }
}
