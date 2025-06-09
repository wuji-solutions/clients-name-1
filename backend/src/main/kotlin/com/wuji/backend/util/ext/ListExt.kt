package com.wuji.backend.util.ext

fun <T> List<T>.getOrThrow(id: Int, exceptionProvider: () -> Throwable): T {
    return getOrNull(id) ?: throw exceptionProvider()
}
