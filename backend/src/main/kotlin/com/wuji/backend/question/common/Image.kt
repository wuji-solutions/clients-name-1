package com.wuji.backend.question.common

class Image(var image: String, val type: ImageType)

data class ImageDto(
    val image: String,
)

fun Image.toImageDto() = ImageDto(this.image)

enum class ImageType {
    BASE64,
    URL
}
