package com.wuji.backend.game.quiz

import com.wuji.backend.question.PlayerAnswer
import com.wuji.backend.question.Question
import com.wuji.backend.game.quiz.exception.QuestionIndexOutOfBoundsException
import com.wuji.backend.player.state.Player
import com.wuji.backend.player.state.PlayerService
import com.wuji.backend.player.state.QuizPlayer
import com.wuji.backend.player.state.QuizPlayerDetails
import com.wuji.backend.player.state.exception.PlayerNotFoundException
import com.wuji.backend.util.ext.getOrThrow
import org.springframework.stereotype.Service

@Service
class QuizService(
    private val quizGame: QuizGame,
    private val playerService: PlayerService
) {
    fun joinGame(index: Any, nickname: Any): Player<QuizPlayerDetails> {
        return playerService.createPlayer(index, nickname, QuizPlayerDetails())
            .also { player -> quizGame.players.add(player) }
    }

    fun getNthQuestion(n: Int) = quizGame.questions.getOrThrow(n) { QuestionIndexOutOfBoundsException(n, quizGame.questions.size) }

    fun answerQuestion(playerIndex: Int, questionId: Int, answerId: Int): Boolean {
        val question = getNthQuestion(questionId)
        val player = quizGame.findPlayerByIndex(playerIndex)

        updatePlayerState(player, question, answerId)

        return question.isCorrectAnswerId(answerId)
    }

    private fun updatePlayerState(player: QuizPlayer, question: Question, answerId: Int) {
        val playerAnswer = PlayerAnswer(question, answerId)

        player.details.answers.add(playerAnswer)
    }

    private fun QuizGame.findPlayerByIndex(id: Int): QuizPlayer {
        return quizGame.players.find { player -> player.index == id } ?: throw PlayerNotFoundException(id)
    }
}
