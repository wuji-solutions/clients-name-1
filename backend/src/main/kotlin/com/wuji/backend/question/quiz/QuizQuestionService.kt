package com.wuji.backend.question.quiz

import com.wuji.backend.events.quiz.SSEQuizService
import com.wuji.backend.game.GameRegistry
import com.wuji.backend.game.quiz.QuizGame
import com.wuji.backend.game.quiz.QuizService
import com.wuji.backend.question.common.PlayerAnswer
import com.wuji.backend.question.common.QuestionService
import com.wuji.backend.question.common.dto.AnswerCountDto
import com.wuji.backend.question.common.dto.AnswersPerQuestionDto
import com.wuji.backend.question.common.dto.QuestionAlreadyAnsweredResponseDto
import com.wuji.backend.question.common.dto.QuestionDto
import com.wuji.backend.question.common.dto.toDetailedAnswerDto
import com.wuji.backend.question.common.dto.toQuestionDto
import com.wuji.backend.question.common.exception.InvalidQuestionIdException
import com.wuji.backend.question.common.exception.QuestionAlreadyAnsweredException
import com.wuji.backend.reports.common.GameStats
import org.springframework.stereotype.Service

@Service
class QuizQuestionService(
    val gameRegistry: GameRegistry,
    private val sseQuizService: SSEQuizService,
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
        val invalidQuestionId =
            answerIds.find { answerId ->
                question.answers.none { it.id == answerId }
            }
        if (invalidQuestionId != null) {
            throw InvalidQuestionIdException(invalidQuestionId)
        }
        // TODO update answerTimeInMilliseconds according to internal game timer, when it's built
        val playerAnswer = PlayerAnswer(question, answerIds, 0)
        player.details.answers.add(playerAnswer)
        updatePlayersAnsweredCounter(question.id)
        return question.areCorrectAnswerIds(answerIds)
    }

    fun getNextQuestion(): QuestionDto {
        val nextQuestion = game.questionDispenser.moveNextQuestion()
        sseQuizService.sendNextQuestion()
        return nextQuestion.toQuestionDto()
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
}
