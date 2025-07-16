package com.wuji.backend.question.common

import com.wuji.backend.security.GameRunning
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@Validated
@GameRunning
@RequestMapping("/games/{game}/questions")
interface QuestionController
