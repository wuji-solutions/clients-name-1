package com.wuji.backend.question.exam

import com.wuji.backend.events.exam.SSEExamService
import com.wuji.backend.game.GameRegistry
import com.wuji.backend.game.exam.ExamGame
import com.wuji.backend.player.state.ExamPlayer
import com.wuji.backend.question.common.PlayerAnswer
import com.wuji.backend.question.common.Question
import com.wuji.backend.question.common.QuestionService
import org.springframework.stereotype.Service

@Service
class ExamQuestionService(
    val gameRegistry: GameRegistry,
    val sseExamService: SSEExamService
) : QuestionService() {

    private val game: ExamGame
        get() = gameRegistry.getAs(ExamGame::class.java)

    override fun getAnswers(playerIndex: Int): List<PlayerAnswer> {
        return game.findPlayerByIndex(playerIndex).details.answers
    }

    fun getCurrentQuestion(playerIndex: Int): Question =
        game.questionDispenser.currentQuestion(playerIndex)

    fun getQuestionAndMarkTime(
        playerIndex: Int,
        getQuestionFunction: (Int) -> Question
    ): Pair<Question, PlayerAnswer?> {
        val player = game.findPlayerByIndex(playerIndex)
        if (player.details.firstGetCurrentQuestionTime == null) {
            player.details.firstGetCurrentQuestionTime =
                System.currentTimeMillis()
        }
        val question = getQuestionFunction(playerIndex)
        return question to getPlayerAnswer(playerIndex, question.id)
    }

    fun answerExamQuestion(
        playerIndex: Int,
        answerIds: Set<Int>,
        playerCheated: Boolean
    ): Boolean {
        val question = getCurrentQuestion(playerIndex)
        val player = game.findPlayerByIndex(playerIndex)
        player.details.askedQuestions.add(question)

        val firstGetCurrentQuestionTime =
            player.details.firstGetCurrentQuestionTime
                ?: throw IllegalStateException(
                    "Odpowiedziałeś na pytanie bez dostania go wcześniej")
        val answerTime =
            System.currentTimeMillis() - firstGetCurrentQuestionTime

        return answerQuestionWithOverwrite(
                player,
                question,
                answerIds,
                answerTime,
                (playerCheated && game.config.markQuestionOnCheating))
            .also {
                //          reset the time, it will be set on the next getQuestionAndMarkTime()
                player.details.firstGetCurrentQuestionTime = null
            }
            .also { answeredCorrectly ->
                if (answeredCorrectly &&
                    !(playerCheated && game.config.zeroPointsOnCheating))
                    player.details.points +=
                        game.config.pointsPerDifficulty.getValue(
                            question.difficultyLevel)
            }
            .also {
                if (playerCheated && game.config.notifyTeacherOnCheating)
                    notifyTeacherOnCheating(player, question)
            }
            .also { sseExamService.sendNewExamStateEvent(game) }
    }

    fun getPreviousQuestion(playerIndex: Int): Question {
        check(game.config.allowGoingBack) {
            "Nie można cofać się do poprzedniego pytania"
        }
        return game.questionDispenser.previousQuestion(playerIndex)
    }

    fun getNextQuestion(playerIndex: Int): Question =
        game.questionDispenser.nextQuestion(playerIndex)

    fun notifyTeacherOnCheating(player: ExamPlayer, question: Question) {
        sseExamService.sendPlayerCheatedEvent(player, question)
    }

    fun getPlayerAnswer(playerIndex: Int, questionId: Int): PlayerAnswer? {
        val player = game.findPlayerByIndex(playerIndex)
        return player.details.answers.find { it.question.id == questionId }
    }
}
