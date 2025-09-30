package com.wuji.backend.util.ext

import com.wuji.backend.question.common.Question

fun <T> List<T>.getOrThrow(id: Int, exceptionProvider: () -> Throwable): T {
    return getOrNull(id) ?: throw exceptionProvider()
}

fun List<Question>.getCategories(): List<String> {
    return this.map { it.category }.distinct()
}
