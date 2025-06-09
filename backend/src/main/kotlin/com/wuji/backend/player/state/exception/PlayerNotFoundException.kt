package com.wuji.backend.player.state.exception

class PlayerNotFoundException(index: Int): IllegalArgumentException("Nie znaleziono gracza o indexie ucznia $index.")
