package com.wuji.backend

import com.wuji.backend.security.IsAdmin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
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
class PublicController {
    @PostMapping("/games/test/join") fun helloWorld(): String = "Hello World"
}
