package com.wuji.backend

import LocalNetworkService
import io.mockk.every
import io.mockk.mockk
import io.mockk.mockkStatic
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import java.net.InetAddress
import kotlin.test.assertEquals

class LocalNetworkServiceTest {
    private lateinit var service: LocalNetworkService

    @BeforeEach
    fun setUp() {
        service = LocalNetworkService()
    }

    @Test
    fun `getLocalIp should return local host IP`() {
        mockkStatic(InetAddress::class)
        val mockAddress = mockk<InetAddress>()
        every { InetAddress.getLocalHost() } returns mockAddress
        every { mockAddress.hostAddress } returns "192.168.1.42"

        val result = service.getLocalIP()

        assertEquals("192.168.1.42", result)
    }
}