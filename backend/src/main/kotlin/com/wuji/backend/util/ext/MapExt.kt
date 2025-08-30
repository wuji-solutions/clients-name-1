package com.wuji.backend.util.ext

import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.ConcurrentMap

fun <K, V> Map<K, V>.toConcurrentMap(): ConcurrentMap<K, V> =
    ConcurrentHashMap(this)
