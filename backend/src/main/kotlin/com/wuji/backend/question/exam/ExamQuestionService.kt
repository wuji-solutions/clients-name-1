package com.wuji.backend.question.exam

import com.wuji.backend.events.exam.SSEExamService
import com.wuji.backend.game.GameRegistry
import com.wuji.backend.game.exam.ExamGame
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

    fun getQuestion(playerIndex: Int): Question {
        return game.questionDispenser.getCurrentQuestion(playerIndex)
    }

    fun getQuestionAndMarkTime(playerIndex: Int): Question {
        val player = game.findPlayerByIndex(playerIndex)
        if (player.details.firstGetCurrentQuestionTime == null) {
            player.details.firstGetCurrentQuestionTime =
                System.currentTimeMillis()
        }
        return getQuestion(playerIndex)
    }

    fun answerExamQuestion(
        playerIndex: Int,
        answerIds: Set<Int>,
        playerCheated: Boolean
    ): Boolean {
        val question = getQuestion(playerIndex)
        val player = game.findPlayerByIndex(playerIndex)
        player.details.askedQuestions.add(question)

        val firstGetCurrentQuestionTime =
            player.details.firstGetCurrentQuestionTime
                ?: throw IllegalStateException(
                    "It appears you answered the question before retrieving it first")
        val answerTime =
            System.currentTimeMillis() - firstGetCurrentQuestionTime

        return answerQuestion(
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
                    notifyTeacherOnCheating(playerIndex, question.id)
            }
    }

    fun getPreviousQuestion(playerIndex: Int): Question {
        check(game.config.allowGoingBack) {
            "Nie można cofać się do poprzedniego pytania"
        }
        TODO()
    }

    fun getNextQuestion(playerIndex: Int): Question {
        val nextQuestion = game.questionDispenser.moveToNextQuestion()
        return nextQuestion
    }

    fun notifyTeacherOnCheating(playerIndex: Int, questionId: Int) {
        val player = game.findPlayerByIndex(playerIndex)
        sseExamService.sendPlayerCheatedEvent(player, questionId)
    }
}
