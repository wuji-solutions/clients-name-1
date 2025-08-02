package com.wuji.backend.question.quiz

import com.wuji.backend.events.quiz.SSEQuizService
import com.wuji.backend.game.GameRegistry
import com.wuji.backend.game.quiz.QuizGame
import com.wuji.backend.game.quiz.QuizService
import com.wuji.backend.question.common.PlayerAnswer
import com.wuji.backend.question.common.QuestionService
import com.wuji.backend.question.common.dto.AnswerCountDto
import com.wuji.backend.question.common.dto.AnswersPerQuestionDto
import com.wuji.backend.question.common.dto.QuestionResponseDto
import com.wuji.backend.question.common.dto.toDetailedAnswerDto
import com.wuji.backend.question.common.exception.QuestionAlreadyAnsweredException
import com.wuji.backend.reports.common.GameStats
import com.wuji.backend.util.ext.toQuestionDto
import org.springframework.stereotype.Service

@Service
class QuizQuestionService(
    val gameRegistry: GameRegistry,
    private val sSEQuizService: SSEQuizService,
    private val quizService: QuizService,
) : QuestionService {

    private val game: QuizGame
        get() = gameRegistry.getAs(QuizGame::class.java)

    override fun getAnswers(playerIndex: Int): List<PlayerAnswer> {
        return game.players
            .find { player -> player.index == playerIndex }
            ?.details
            ?.answers ?: emptyList()
    }

    fun getQuestion() = getCurrentQuestion().toQuestionDto()

    override fun answerQuestion(
        playerIndex: Int,
        answerIds: Set<Int>
    ): Boolean {
        val question = getCurrentQuestion()
        val player = game.findPlayerByIndex(playerIndex)

        if (player.alreadyAnswered(question.id)) {
            throw QuestionAlreadyAnsweredException(question.id)
        }
        // TODO update answerTimeInMilliseconds according to internal game timer, when it's built
        val playerAnswer = PlayerAnswer(question, answerIds, 0)
        player.details.answers.add(playerAnswer)
        updatePlayersAnsweredCounter(question.id)
        return question.areCorrectAnswerIds(answerIds)
    }

    fun getNextQuestion(): QuestionResponseDto {
        sSEQuizService.sendNextQuestion()
        return game.questionDispenser.moveNextQuestion().toQuestionDto()
    }

    fun endQuestion() {
        quizService.pauseGame()
    }

    fun getAnswersPerQuestion(): AnswersPerQuestionDto {
        val answerCountList = mutableListOf<AnswerCountDto>()
        val question = getCurrentQuestion()
        for (answer in question.answers) {
            val answerCount =
                gameRegistry.game.players.count {
                    answer.id in it.answerForQuestion(question.id).selectedIds
                }
            answerCountList.add(
                AnswerCountDto(
                    answer.toDetailedAnswerDto(
                        question.inCorrectAnswerIds(answer.id)),
                    answerCount))
        }
        return AnswersPerQuestionDto(answerCountList)
    }

    private fun getCurrentQuestion() =
        game.questionDispenser.getCurrentQuestion()

    private fun updatePlayersAnsweredCounter(questionId: Int) {
        sSEQuizService.sendPlayersAnsweredCounter(
            GameStats.countPlayersAnsweredForQuestion(game, questionId))
    }
}
