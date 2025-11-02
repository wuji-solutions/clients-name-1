package com.wuji.backend.parser

class UnsupportedQuestionDifficultyException(difficultyProvided: String?) :
        Exception("Unsupported difficulty provided: $difficultyProvided")