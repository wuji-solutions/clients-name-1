package com.wuji.backend.config.creator

import com.wuji.backend.config.BoardConfig
import com.wuji.backend.config.ExamConfig
import com.wuji.backend.config.GameConfig
import com.wuji.backend.config.QuizConfig
import com.wuji.backend.config.dto.GameConfigDto
import com.wuji.backend.game.GameType
import jakarta.xml.bind.JAXBContext
import jakarta.xml.bind.Marshaller
import org.springframework.stereotype.Service

@Service
class ConfigCreatorService(
    val gameTypeToMarshaller: Map<GameType, Marshaller> = mapOf(
        GameType.QUIZ to JAXBContext.newInstance(QuizConfig::class.java).createMarshaller(),
        GameType.EXAM to JAXBContext.newInstance(ExamConfig::class.java).createMarshaller(),
        GameType.BOARD to JAXBContext.newInstance(BoardConfig::class.java).createMarshaller(),
    )
) {
    val configPath: String = "." // need to have a discussion where to store config files

    fun readConfig(): GameConfigDto {
        TODO("not yet implemented")
    }
    fun createConfig(
        config: GameConfig,
    ) {
        TODO("not yet implemented")
    }
}