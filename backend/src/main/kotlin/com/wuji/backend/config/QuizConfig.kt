package com.wuji.backend.config

import jakarta.xml.bind.annotation.XmlElement
import jakarta.xml.bind.annotation.XmlRootElement

data class QuizConfig(
    override val totalDurationMinutes: Int,
    override val endImmediatelyAfterTime: Boolean,
    override val questionFilePath: String,
    override val questionDurationSeconds: Int,
) : GameConfig
