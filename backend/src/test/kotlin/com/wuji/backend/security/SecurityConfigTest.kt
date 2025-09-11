package com.wuji.backend.security

import com.wuji.backend.EXTERNAL_IP
import com.wuji.backend.LOCALHOST_IPV4
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.content
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@SpringBootTest
@AutoConfigureMockMvc
class SecurityConfigTest(@Autowired val mockMvc: MockMvc) {
    private val JOINED_URL_2 = "/games/hello/world"

    @Test
    fun `should allow localhost without JOINED`() {
        mockMvc
            .perform(
                MockMvcRequestBuilders.get("/sse/hello").with { req ->
                    req.remoteAddr = LOCALHOST_IPV4
                    req
                })
            .andExpect(status().isOk)
            .andExpect(content().string("Hello Localhost"))
    }

    @Test
    fun `should deny user with JOINED and not localhost`() {
        mockMvc
            .perform(
                MockMvcRequestBuilders.get("/sse/")
                    .with(
                        SecurityMockMvcRequestPostProcessors.user("testuser")
                            .authorities(SimpleGrantedAuthority("JOINED")))
                    .with { req ->
                        req.remoteAddr = EXTERNAL_IP
                        req
                    })
            .andExpect(status().isForbidden)
    }

    @Test
    fun `should allow localhost user`() {
        mockMvc
            .perform(
                MockMvcRequestBuilders.get("/sse/hello/world").with { req ->
                    req.remoteAddr = LOCALHOST_IPV4
                    req
                })
            .andExpect(status().isOk)
            .andExpect(content().string("Hello Joined"))
    }

    @Test
    fun `should deny user that are not localhost`() {
        mockMvc
            .perform(
                MockMvcRequestBuilders.get("/sse/hello/world")
                    .with(SecurityMockMvcRequestPostProcessors.user("testuser"))
                    .with { req ->
                        req.remoteAddr = EXTERNAL_IP
                        req
                    })
            .andExpect(status().isForbidden)
    }

    @Test
    fun `should allow public join endpoint`() {
        mockMvc
            .perform(MockMvcRequestBuilders.post("/games/test/join"))
            .andExpect(status().isOk)
            .andExpect(content().string("Hello World"))
    }

    @Test
    fun `should allow JOINED for games path`() {
        mockMvc
            .perform(
                MockMvcRequestBuilders.get(JOINED_URL_2)
                    .with(
                        SecurityMockMvcRequestPostProcessors.user("testuser")
                            .authorities(SimpleGrantedAuthority("JOINED")))
                    .with { req ->
                        req.remoteAddr = EXTERNAL_IP
                        req
                    })
            .andExpect(status().isOk)
            .andExpect(content().string("Hello Joined2"))
    }

    @Test
    fun `should allow localhost for games path`() {
        mockMvc
            .perform(
                MockMvcRequestBuilders.get(JOINED_URL_2).with { req ->
                    req.remoteAddr = LOCALHOST_IPV4
                    req
                })
            .andExpect(status().isOk)
            .andExpect(content().string("Hello Joined2"))
    }

    @Test
    fun `should deny games path without JOINED and not localhost`() {
        mockMvc
            .perform(
                MockMvcRequestBuilders.get(JOINED_URL_2)
                    .with(SecurityMockMvcRequestPostProcessors.user("testuser"))
                    .with { req ->
                        req.remoteAddr = EXTERNAL_IP
                        req
                    })
            .andExpect(status().isForbidden)
    }

    @Test
    fun `should allow joined user for extended games path`() {
        mockMvc
            .perform(
                MockMvcRequestBuilders.get("/games/hello/world/123")
                    .with(
                        SecurityMockMvcRequestPostProcessors.user("testuser")
                            .authorities(SimpleGrantedAuthority("JOINED")))
                    .with { req ->
                        req.remoteAddr = EXTERNAL_IP
                        req
                    })
            .andExpect(status().isOk)
            .andExpect(content().string("Hello Joined3"))
    }
}
