package com.wuji.backend.question.common

class Image(var image: String, val type: ImageType)

data class ImageDto(
    val image: String,
    val type: ImageType
)

fun Image.toImageDto() = ImageDto(this.image, this.type)

enum class ImageType {
    BASE64,
    URL
}
