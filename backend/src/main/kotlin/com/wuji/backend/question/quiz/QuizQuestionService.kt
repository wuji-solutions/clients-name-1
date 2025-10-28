package com.wuji.backend.question.quiz

import com.wuji.backend.events.quiz.SSEQuizService
import com.wuji.backend.game.GameRegistry
import com.wuji.backend.game.quiz.QuizGame
import com.wuji.backend.game.quiz.QuizService
import com.wuji.backend.question.common.PlayerAnswer
import com.wuji.backend.question.common.Question
import com.wuji.backend.question.common.QuestionService
import com.wuji.backend.question.common.dto.*
import com.wuji.backend.question.quiz.dto.QuizQuestionDto
import com.wuji.backend.question.quiz.dto.toQuizQuestionDto
import com.wuji.backend.reports.common.GameStats
import org.springframework.stereotype.Service

@Service
class QuizQuestionService(
    val gameRegistry: GameRegistry,
    private val sseQuizService: SSEQuizService,
    private val quizService: QuizService,
) : QuestionService() {

    private val game: QuizGame
        get() = gameRegistry.getAs(QuizGame::class.java)

    private var currentQuestionStartTime: Long = 0

    override fun getAnswers(playerIndex: Int): List<PlayerAnswer> {
        return game.players
            .find { player -> player.index == playerIndex }
            ?.details
            ?.answers ?: emptyList()
    }

    fun getQuestion() = getCurrentQuestion().toQuizQuestionDto()

    fun answerQuizQuestion(playerIndex: Int, answerIds: Set<Int>): Boolean {
        val question = getCurrentQuestion()
        val player = game.findPlayerByIndex(playerIndex)
        val answerTime = System.currentTimeMillis() - currentQuestionStartTime

        return answerQuestion(player, question, answerIds, answerTime).also {
            updatePlayersAnsweredCounter(question.id)
        }
    }

    fun getNextQuestion(): QuizQuestionDto {
        val nextQuestion = game.questionDispenser.moveToNextQuestion()
        game.resume()
        sseQuizService.sendNextQuestion()
        currentQuestionStartTime = System.currentTimeMillis()
        return nextQuestion.toQuizQuestionDto()
    }

    fun askedQuestions() = game.askedQuestions

    fun endQuestion() {
        game.askedQuestions.add(getCurrentQuestion())
        sseQuizService.sendEndQuestion()
        quizService.pauseGame()
    }

    fun playerAlreadyAnswered(
        questionId: Int,
        playerIndex: Int
    ): QuestionAlreadyAnsweredResponseDto {
        val player = game.findPlayerByIndex(playerIndex)
        val answerIds =
            if (player.alreadyAnswered(questionId))
                player.answerForQuestion(questionId).selectedIds
            else emptySet()
        return QuestionAlreadyAnsweredResponseDto(
            player.alreadyAnswered(questionId), answerIds)
    }

    fun getAnswersPerQuestion(): AnswersPerQuestionDto {
        val answerCountList = mutableListOf<AnswerCountDto>()
        val currentQuestion = getCurrentQuestion()
        for (answer in currentQuestion.answers) {
            val answerCount =
                gameRegistry.game.players
                    .filter { it.alreadyAnswered(currentQuestion.id) }
                    .count {
                        answer.id in
                            it.answerForQuestion(currentQuestion.id).selectedIds
                    }
            answerCountList.add(
                AnswerCountDto(
                    answer.toDetailedAnswerDto(
                        currentQuestion.inCorrectAnswerIds(answer.id)),
                    answerCount))
        }
        return AnswersPerQuestionDto(answerCountList)
    }

    private fun getCurrentQuestion() =
        game.questionDispenser.getCurrentQuestion()

    private fun updatePlayersAnsweredCounter(questionId: Int) {
        sseQuizService.sendPlayersAnsweredCounter(
            GameStats.countPlayersAnsweredForQuestion(game, questionId))
    }

    private fun Question.toQuizQuestionDto(): QuizQuestionDto {
        val questionNumber = game.questionDispenser.currentQuestionNumber
        val totalQuestions = game.questionDispenser.totalQuestionCount
        return this.toQuizQuestionDto(
            questionNumber = questionNumber, totalQuestions = totalQuestions)
    }
}
