package com.wuji.backend.util.ext

import com.wuji.backend.question.common.Question

fun List<Question>.getCategories(): List<String> {
    return this.map { it.category }.distinct()
}
