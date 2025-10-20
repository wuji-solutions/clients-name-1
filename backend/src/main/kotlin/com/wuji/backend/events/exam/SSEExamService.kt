package com.wuji.backend.events.exam

import com.wuji.backend.events.common.ADMIN_EXAM_CHANNEL
import com.wuji.backend.events.common.SSEService
import com.wuji.backend.events.exam.dto.ExamPlayerStateDto
import com.wuji.backend.events.exam.dto.NewExamStateDto
import com.wuji.backend.events.exam.dto.NewExamStateEvent
import com.wuji.backend.events.exam.dto.PlayerCheatedDto
import com.wuji.backend.events.exam.dto.PlayerCheatedEvent
import com.wuji.backend.game.exam.ExamGame
import com.wuji.backend.player.state.Player
import com.wuji.backend.player.state.PlayerDetails
import com.wuji.backend.question.common.Question
import com.wuji.backend.question.common.dto.toQuestionDto
import com.wuji.backend.reports.common.GameStats
import org.springframework.stereotype.Service
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter

@Service
class SSEExamService : SSEService() {
    fun addAdminEventsEmitter(): SseEmitter = addEmitter(ADMIN_EXAM_CHANNEL)

    fun sendPlayerCheatedEvent(
        player: Player<out PlayerDetails>,
        question: Question
    ) {
        sendEvent(
            ADMIN_EXAM_CHANNEL,
            PlayerCheatedEvent(
                PlayerCheatedDto(
                    player.nickname, player.index, question.toQuestionDto())))
    }

    fun sendNewExamStateEvent(game: ExamGame) {
        val stateDtos =
            game.players
                .map { player ->
                    val correctAnswers =
                        GameStats.countCorrectAnswersForPlayer(
                            game, player.index)
                    val incorrectAnswers =
                        GameStats.countIncorrectAnswersForPlayer(
                            game, player.index)
                    ExamPlayerStateDto(
                        player.index,
                        player.nickname,
                        player.details.getPoints(
                            game.config.pointsPerDifficulty,
                            game.config.zeroPointsOnCheating),
                        correctAnswers,
                        incorrectAnswers)
                }
                .toList()
        sendEvent(
            ADMIN_EXAM_CHANNEL,
            NewExamStateEvent(
                NewExamStateDto(game.config.requiredQuestionCount, stateDtos)))
    }
}
