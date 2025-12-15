package com.wuji.backend.player

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test

class NicknameGeneratorTest {

    private val totalNicknames = 100
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

    @Test
    fun `should generate valid nickname`() {
        val generator = NicknameGenerator()

        val nickname = generator.next()

        val match =
            adjectives.any { nickname.startsWith(it) } &&
                nouns.any {
                    nickname.removePrefix(
                        adjectives.find { nickname.startsWith(it) } ?: "") in
                        nouns
                }

        assertTrue(match, "Nickname '$nickname' should match ADJ + NOUN")
    }

    @Test
    fun `should not repeat nickname until pool is exhausted`() {
        val generator = NicknameGenerator()

        val results = mutableSetOf<String>()

        repeat(totalNicknames) {
            val nickname = generator.next()
            assertFalse(
                nickname in results,
                "Nickname '$nickname' was repeated before exhaustion")
            results.add(nickname)
        }

        assertEquals(totalNicknames, results.size)
    }

    @Test
    fun `should reset after exhausting all nicknames`() {
        val generator = NicknameGenerator()

        val firstSet = (1..totalNicknames).map { generator.next() }.toSet()
        assertEquals(totalNicknames, firstSet.size)

        val secondSet = (1..totalNicknames).map { generator.next() }.toSet()
        assertEquals(totalNicknames, secondSet.size)

        assertTrue(firstSet.minus(secondSet).isEmpty())
    }

    @Test
    fun `should generate all possible combinations`() {
        val generator = NicknameGenerator()

        val expected =
            adjectives
                .flatMap { adj -> nouns.map { noun -> adj + noun } }
                .toSet()

        val generated = (1..expected.size).map { generator.next() }.toSet()

        assertEquals(expected, generated)
    }
}
