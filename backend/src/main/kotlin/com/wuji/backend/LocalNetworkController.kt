package com.wuji.backend

import LocalNetworkService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/ip")
class LocalNetworkController(
    private val service: LocalNetworkService = LocalNetworkService()
) {
    @GetMapping
    fun getIp(): ResponseEntity<String> {
        return ResponseEntity.ok(service.getLocalIP())
    }
}