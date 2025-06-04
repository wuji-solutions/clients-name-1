package com.wuji.backend.user

data class User(
    val index: Int,
    val nickname: String,
) {
    fun displayName() = nickname

    override fun toString(): String = "$nickname [$index]"
}
