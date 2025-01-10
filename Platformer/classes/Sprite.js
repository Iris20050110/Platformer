class Sprite {
    constructor(position, imageSrc, frameRate = 1, frameFrequency, scale = 1) {//not scale background
        this.position = position
        this.frameRate = frameRate
        this.currentFrame = 0
        this.elapsedFrames = 0
        this.frameFrequency = frameFrequency
        this.scale = scale
        this.loaded = false
        //default idle image
        this.image = new Image()
        this.image.src = imageSrc
        this.image.onload = () => {
            this.width = this.scale * (this.image.width / this.frameRate)
            this.height = this.scale * (this.image.height)
            this.loaded = true
        }
    }

    draw() {
        if (this.image) {
            // crop the warrior image with cropbox
            const cropbox = {
                position: {
                    x: this.currentFrame * (this.image.width / this.frameRate),
                    y: 0,
                },
                width: this.image.width / this.frameRate,
                height: this.image.height
            }
            c.drawImage(this.image, cropbox.position.x, cropbox.position.y, 
                cropbox.width, cropbox.height, this.position.x, this.position.y, 
                this.width, this.height)
        }
        else return
    }

    update() {
        this.draw()
    }

    updateFrame() {
        this.elapsedFrames++
        if (this.elapsedFrames % this.frameFrequency === 0) {
        if (this.currentFrame < this.frameRate - 1) {
            this.currentFrame++
        }
        else {
            this.currentFrame = 0
        }
    }
}
}
