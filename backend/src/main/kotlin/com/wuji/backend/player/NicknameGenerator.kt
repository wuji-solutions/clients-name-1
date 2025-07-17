package com.wuji.backend.player

import java.security.SecureRandom
import org.springframework.stereotype.Component

@Component
class NicknameGenerator {
    // TODO: change to not be repeatable
    private val rnd: SecureRandom = SecureRandom()

    fun next(): String {
        return (ADJ[rnd.nextInt(ADJ.size)] +
            NOUN[rnd.nextInt(NOUN.size)] +
            (100 + rnd.nextInt(900))) // BystryLis483
    }

    companion object {
        private val ADJ =
            arrayOf("Bystry", "Wesoły", "Cichy", "Gorący", "Szmaragdowy")
        private val NOUN =
            arrayOf("Lis", "Smok", "Pingwin", "Jeż", "Jednorożec")

        fun generateRandom(): String {
            return SecureRandom().let { rnd ->
                (ADJ[rnd.nextInt(ADJ.size)] +
                    NOUN[rnd.nextInt(NOUN.size)] +
                    (100 + rnd.nextInt(900)))
            }
        }
    }
}
