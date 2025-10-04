package com.wuji.backend.security

import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/security")
class SecurityController {

    @GetMapping("/session-status")
    fun sessionStatus(auth: Authentication): ResponseEntity<Any> {
        return ResponseEntity.ok().build()
    }
}
