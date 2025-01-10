class Player extends Sprite {
    constructor(position, collisionBlocks, platformCollisionBlocks, imageSrc,  
        animations, frameRate, scale = 0.5) {
        super(position, imageSrc, frameRate, 3, scale)
        this.velocity = {
            x:0,
            y:1
        }
        this.collisionBlocks = collisionBlocks
        this.platformCollisionBlocks = platformCollisionBlocks
        this.animations = animations
        this.lastDirection = "right"

        this.hitbox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            width: 10,
            height: 10
        }

        for(let key in this.animations) {
            const image = new Image()
            image.src = this.animations[key].imageSrc
            this.animations[key].image = image
        }
        
        this.camarabox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            width: 200,
            height: 80
        }

    }

switchSprite(key) {
    if (this.image === this.animations[key].image || !this.loaded) return
    this.currentFrame = 0
    this.image = this.animations[key].image
    this.frameFrequency = this.animations[key].frameFrequency
    this.frameRate = this.animations[key].frameRate
}

    update() {
        this.updateFrame()
        this.updateHitBox()
        this.updateCamaraBox()

        //c.fillStyle = "rgba(0, 255, 0, 0.3)"
        //c.fillRect(this.camarabox.position.x, this.camarabox.position.y, this.camarabox.width, this.camarabox.height)
        //c.fillStyle = "rgba(0, 255,  0, 0.3)"
        //c.fillRect(this.position.x, this.position.y, this.width, this.height)

        //draw out player
        player.draw()
        this.position.x += this.velocity.x
        this.updateHitBox()
        this.checkHorizontalCollision()
        this.applyGravity()
        this.updateHitBox()
        this.checkVerticalCollision()
    }

    updateCamaraBox() {
        this.camarabox = {
            position: {
                x: this.position.x - 60,
                y: this.position.y
            },
            width: 200,
            height: 80
        }
    }

    updateHitBox() {
            this.hitbox = {
              position: {
                x: this.position.x + 35,
                y: this.position.y + 26,
              },
              width: 14,
              height: 27,
            }
    }

    checkHorizontalCollision() {
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const block = this.collisionBlocks[i]
            if (collision(this.hitbox, block)) {
                if (this.velocity.x > 0) {
                    this.velocity.x = 0
                    const offset = this.position.x - this.hitbox.x + this.hitbox.width
                    //-0.01 to make sure not colliding with the block
                    this.position.x = block.position.x - offset - 0.01
                    break
                }

                if (this.velocity.x < 0) {
                    this.velocity.x = 0
                    const offset = this.hitbox.position.x - this.position.x
                    //+0.01 to make sure not colliding with the block
                    this.position.x = block.position.x + block.width - offset + 0.01
                    break
                }
            }
        }
    }

    applyGravity() {
        this.velocity.y += gravity
        this.position.y += this.velocity.y
    }

    checkVerticalCollision() {
        //for floor collision blocks
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const block = this.collisionBlocks[i]
            if (collision(this.hitbox, block)) {
                if (this.velocity.y > 0) {
                    this.velocity.y = 0
                    const offset = this.hitbox.position.y - this.position.y + this.hitbox.height
                    //-0.01 to make sure not colliding with the block
                    this.position.y = block.position.y - offset - 0.01
                    break
                }

                if (this.velocity.y < 0) {
                    this.velocity.y = 0
                    const offset = this.hitbox.position.y - this.position.y
                    //+0.01 to make sure not colliding with the block
                    this.position.y = block.position.y + block.height - offset + 0.01
                    break
                }
            }
        }

        // for platform collision blocks
    for (let i = 0; i < this.platformCollisionBlocks.length; i++) {
        const platformCollisionBlock = this.platformCollisionBlocks[i]
        if (platformCollision(this.hitbox, platformCollisionBlock)) {
          if (this.velocity.y > 0) {
            this.velocity.y = 0
  
            const offset =
              this.hitbox.position.y - this.position.y + this.hitbox.height
  
            this.position.y = platformCollisionBlock.position.y - offset - 0.01
            break
          }

        }
      }
    }

    shouldPanCamaraToRight() {
        const camaraRightSide = this.camarabox.position.x + this.camarabox.width

        if (this.hitbox.width + this.hitbox.position.x + this.velocity.x >= 576 && 
            collision(this.hitbox, floorCollionBlocks[floorCollionBlocks.length-1])) {
                canvas.style.display = "none"
                scoreEl.style.display = "none"
                restartPage.style.display="block";
                if (totalScore >= 50) {
                    result.innerHTML = `Congratulation, You Win! <br>Coins Collected: ${totalScore}`
                }
                else {
                    result.innerHTML = `Sorry, You Lose... <br>Coins Collected: ${totalScore}`
                }
            }

        if (this.hitbox.width + this.hitbox.position.x + this.velocity.x >= 576) {
            this.velocity.x = 0
        }
        if (camaraRightSide >= 576) {//if camara right side passes the right side of the background image
           return 
        }
        if (camaraRightSide >= canvas.width / 4 + Math.abs(camara.position.x)) {
            //console.log("translate right")
            camara.position.x -= this.velocity.x
        }
    }

    shouldPanCamaraToLeft() {
        if (this.hitbox.position.x + this.velocity.x <= 0) {
            this.velocity.x = 0
        }
        if (this.camarabox.position.x <= 0) {
            return
        }
        if (this.camarabox.position.x <= Math.abs(camara.position.x)) {
            camara.position.x -= this.velocity.x
        }
    }

    shouldPanCamaraToUp() {
        if (this.hitbox.position.y + this.velocity.y <= 0) {
            this.velocity.y = 0
        }
        if (this.camarabox.position.y + this.velocity.y <= 0) {
            return
        }
        if (this.camarabox.position.y <= Math.abs(camara.position.y)) {
            camara.position.y -= this.velocity.y
        }
    }

    shouldPanCamaraToDown() {
        const camaraBottom = this.camarabox.position.y + this.camarabox.height

        if (camaraBottom + this.velocity.y >= 432) {//if camara bottom passes the bottom of the background image
            return
        }
        if (camaraBottom >= canvas.height / 4 + Math.abs(camara.position.y)) {
            camara.position.y -= this.velocity.y
        }
    }

    restart() {
        this.position = {
            x: 0,
            y:200
        }
        this.velocity = {
            x:0,
            y:1
        }
        this.lastDirection = "right"
        this.switchSprite("Idle")
        this.updateCamaraBox()
        this.updateHitBox()
    }
}
