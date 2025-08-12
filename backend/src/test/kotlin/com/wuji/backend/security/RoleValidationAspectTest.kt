package com.wuji.backend.security

import com.wuji.backend.EXTERNAL_IP
import com.wuji.backend.LOCALHOST_IPV4
import com.wuji.backend.LOCALHOST_IPV6
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user
import org.springframework.test.web.client.match.MockRestRequestMatchers.content
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@SpringBootTest
@AutoConfigureMockMvc
class RoleValidationAspectTest(@Autowired val mockMvc: MockMvc) {
    private val url = "/admin-test"

    @Test
    fun `allows localhost with ipv4`() {
        mockMvc
            .perform(
                MockMvcRequestBuilders.get(url).with { req ->
                    req.remoteAddr = LOCALHOST_IPV4
                    req
                })
            .andExpect { status().isOk }
            .andExpect { content().string("OK") }
    }

    @Test
    fun `allows localhost with ipv6`() {
        mockMvc
            .perform(
                MockMvcRequestBuilders.get(url).with { req ->
                    req.remoteAddr = LOCALHOST_IPV6
                    req
                })
            .andExpect { status().isOk }
            .andExpect { content().string("OK") }
    }

    @Test
    fun `forbids external user`() {
        mockMvc
            .perform(
                MockMvcRequestBuilders.get(url)
                    .with { req ->
                        req.remoteAddr = EXTERNAL_IP
                        req
                    }
                    .with(user("testuser")))
            .andExpect(status().isForbidden)
    }
}
