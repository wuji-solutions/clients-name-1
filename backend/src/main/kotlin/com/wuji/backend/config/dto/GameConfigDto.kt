package com.wuji.backend.config.dto

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import com.wuji.backend.config.DEFAULT_QUESTION_DURATION_SECONDS
import com.wuji.backend.config.DEFAULT_QUESTION_FILE_PATH
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
    @field:NotBlank(message = "Ścieżka do pliku z pytaniami nie może być pusta")
    open val questionFilePath: String = DEFAULT_QUESTION_FILE_PATH,
    @field:Min(1, message = "Czas na pojedynczą odpowiedź musi być dodatni")
    open val questionDurationSeconds: Int = DEFAULT_QUESTION_DURATION_SECONDS,
)
