package com.wuji.backend.game.quiz

import com.wuji.backend.question.PlayerAnswer
import com.wuji.backend.question.Question
import com.wuji.backend.game.quiz.exception.QuestionIndexOutOfBoundsException
import com.wuji.backend.player.state.PlayerState
import com.wuji.backend.player.state.PlayerStateService
import com.wuji.backend.player.state.QuizPlayerStateDetails
import com.wuji.backend.util.ext.getOrThrow
import org.springframework.stereotype.Service

@Service
class QuizService(
    private val quizGame: QuizGame,
    private val playerStateService: PlayerStateService
) {
    fun joinGame(index: Any, nickname: Any): PlayerState<QuizPlayerStateDetails> {
        quizGame.players.add(nickname as String)
        return playerStateService.createPlayerState(index, nickname, QuizPlayerStateDetails())
    }

    fun getNthQuestion(n: Int) = quizGame.questions.getOrThrow(n) { QuestionIndexOutOfBoundsException(n, quizGame.questions.size) }

    fun answerQuestion(uncastPlayerState: Any, questionId: Int, answerId: Int): Boolean {
        val question = getNthQuestion(questionId)
        updatePlayerState(uncastPlayerState, question, answerId)

        return question.isCorrectAnswerId(answerId)
    }

    private fun updatePlayerState(uncastPlayerState: Any, question: Question, answerId: Int) {
        val playerAnswer = PlayerAnswer(question, answerId)

        playerStateService.updatePlayerState<QuizPlayerStateDetails>(uncastPlayerState) { playerState ->
            playerState.details.answers.add(playerAnswer)
        }
    }
}
