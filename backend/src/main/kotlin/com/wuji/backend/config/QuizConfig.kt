package com.wuji.backend.config

import jakarta.xml.bind.annotation.XmlElement
import jakarta.xml.bind.annotation.XmlRootElement

@XmlRootElement(name = "quizConfig")
data class QuizConfig(
    @XmlElement
    override val totalDurationMinutes: Int,
    @XmlElement
    override val endImmediatelyAfterTime: Boolean,
    @XmlElement
    override val questionFilePath: String,
    @XmlElement
    override val questionDurationSeconds: Int,
) : GameConfig
