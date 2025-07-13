package com.wuji.backend.question.common

import com.wuji.backend.security.RunningGame
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@Validated
@RunningGame(isRunning = true)
@RequestMapping("/games/{game}/questions")
interface QuestionController