package com.wuji.backend.error

import jakarta.servlet.http.HttpServletRequest
import org.springframework.core.Ordered
import org.springframework.core.annotation.Order
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import java.time.LocalDateTime


@RestControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE)
class ValidationExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleAccessDeniedException(
        request: HttpServletRequest,
        ex: Exception
    ): ResponseEntity<BasicErrorResponse> {
        val errors = mutableListOf<String>()

        (ex as MethodArgumentNotValidException).bindingResult.allErrors.forEach { error ->
            error.defaultMessage.run { if (this != null) errors.add(this) }
        }

        val errorResponse =
            BasicErrorResponse(
                HttpStatus.FORBIDDEN.value(),
                errors.toString().trim('[', ']'),
                LocalDateTime.now()
            )
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse)
    }

}