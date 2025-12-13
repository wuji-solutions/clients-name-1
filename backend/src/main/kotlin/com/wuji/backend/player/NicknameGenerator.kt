package com.wuji.backend.player

import java.util.concurrent.locks.ReentrantLock
import kotlin.concurrent.withLock
import org.springframework.stereotype.Component

@Component
class NicknameGenerator {
    private val adjectives =
        arrayOf(
            "Szmaragdowy",
            "Zwinny",
            "Radosny",
            "Sprytny",
            "Pluszowy",
            "Wesoły",
            "Słoneczny",
            "Odważny",
            "Ciekawski",
            "Skoczny")

    private val nouns =
        arrayOf(
            "Lis",
            "Pingwin",
            "Jeż",
            "Smok",
            "Dinozaur",
            "Fenek",
            "Bóbr",
            "Zając",
            "Motyl",
            "Sokół")

    private val nicknameIds =
        (0..adjectives.size * nouns.size - 1).toMutableSet()

    private val lock = ReentrantLock()

    fun next(): String =
        lock.withLock {
            if (nicknameIds.isEmpty())
                nicknameIds.addAll(0..adjectives.size * nouns.size - 1)

            val id = nicknameIds.random()
            nicknameIds.remove(id)

            val row = id.div(adjectives.size)
            val col = id - row * adjectives.size

            return adjectives[row] + nouns[col]
        }
}
