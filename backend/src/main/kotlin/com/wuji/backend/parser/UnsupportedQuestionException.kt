package com.wuji.backend.parser

class UnsupportedQuestionException(questionType: String?) :
    Exception(
        "Unsupported question type when reading the XML file: $questionType")
