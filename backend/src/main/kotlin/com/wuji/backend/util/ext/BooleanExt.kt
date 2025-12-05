package com.wuji.backend.util.ext

fun Boolean.toPolish(): String =
    when (this) {
        true -> "Prawda"
        false -> "Fałsz"
    }
