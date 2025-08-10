package com.wuji.backend

import com.wuji.backend.security.IsAdmin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class TestController {

    @IsAdmin @GetMapping("/admin-test") fun adminOnly(): String = "OK"
}
