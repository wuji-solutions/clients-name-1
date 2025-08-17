package com.wuji.backend

import com.wuji.backend.security.IsAdmin
import com.wuji.backend.security.auth.Participant
import com.wuji.backend.security.auth.PlayerAuthService
import jakarta.servlet.http.HttpServletRequest
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class TestController {

    @IsAdmin @GetMapping("/admin-test") fun adminOnly(): String = "OK"
}

@RestController
class LocalhostController {
    @GetMapping("/sse/hello") fun helloLocalhost(): String = "Hello Localhost"
}

@RestController
class JoinedController {
    @GetMapping("/sse/hello/world") fun helloJoined(): String = "Hello Joined"

    @GetMapping("/games/hello/world")
    fun helloJoined2(): String = "Hello Joined2"

    @GetMapping("/games/hello/world/123")
    fun helloJoined3(): String = "Hello Joined3"
}

@RestController
@RequestMapping("/test-auth")
class AuthorizedController(private val playerAuthService: PlayerAuthService) {

    @PostMapping("/{index}")
    fun authenticate(
        @PathVariable index: Int,
        request: HttpServletRequest
    ): Participant {
        return playerAuthService.authenticate(index, request)
    }

    @GetMapping("/authenticated")
    fun authenticated(auth: Authentication): String = "Authenticated"

    @DeleteMapping("/{index}")
    fun removeAuthentication(@PathVariable index: Int) {
        playerAuthService.removeAuthentication(index)
    }
}

@RestController
class PublicController {
    @PostMapping("/games/test/join") fun helloWorld(): String = "Hello World"
}
