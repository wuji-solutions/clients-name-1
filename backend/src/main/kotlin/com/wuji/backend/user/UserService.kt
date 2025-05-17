package com.wuji.backend.user

import org.springframework.stereotype.Service

@Service
class UserService {

    fun fetchUsers(): List<User> {
        val user1 = User(1, "Krzysiu")
        val user2 = User(2, "Macius")
        val user3 = User(3, "Michael")

        return listOf(user1, user2, user3)
    }
}