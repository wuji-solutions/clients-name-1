package com.wuji.backend.question.common.dto

import com.wuji.backend.question.common.PlayerAnswer

data class PlayerAnswerDto(val selectedIds: Set<Int>)

fun PlayerAnswer.toDto(): PlayerAnswerDto {
    return PlayerAnswerDto(selectedIds = selectedIds)
}
