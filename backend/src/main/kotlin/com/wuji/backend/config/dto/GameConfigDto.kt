package com.wuji.backend.config.dto

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import com.wuji.backend.config.DEFAULT_END_IMMEDIATELY_AFTER_TIME
import com.wuji.backend.config.DEFAULT_QUESTION_DURATION_SECONDS
import com.wuji.backend.config.DEFAULT_QUESTION_FILE_PATH
import com.wuji.backend.config.DEFAULT_TOTAL_DURATION_MINUTES
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank

@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "type")
@JsonSubTypes(
    JsonSubTypes.Type(value = ExamConfigDto::class, name = "EXAM"),
    JsonSubTypes.Type(value = BoardConfigDto::class, name = "BOARD"),
    JsonSubTypes.Type(value = GameConfigDto::class, name = "QUIZ"))
open class GameConfigDto(
    @field:Min(1, message = "Całkowity czas na rozgrywkę musi być dodatni")
    val totalDurationMinutes: Int = DEFAULT_TOTAL_DURATION_MINUTES,
    @field:NotBlank(message = "Ścieżka do pliku z pytaniami nie może być pusta")
    val questionFilePath: String = DEFAULT_QUESTION_FILE_PATH,
    @field:Min(1, message = "Czas na pojedynczą odpowiedź musi być dodatni")
    val questionDurationSeconds: Int = DEFAULT_QUESTION_DURATION_SECONDS,
    val endImmediatelyAfterTime: Boolean = DEFAULT_END_IMMEDIATELY_AFTER_TIME,
)
