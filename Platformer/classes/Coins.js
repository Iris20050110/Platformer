class Coins extends Sprite {
    constructor(position, player) {
        super(position, "./img/coin.png", 7, 9, 0.08)
        this.collisionWithPlayer = false
        this.player = player
        this.score = 0
    }


    /*draw() {
        c.drawImage(this.image, this.position.x, this.position.y, 
        this.width, this.height)
    }*/

    update() {
        //this.width = 8
        //this.height = 16
        this.updateFrame()
        this.checkPlayerCollision()
        if (!this.collisionWithPlayer) {
            this.draw()
        }
    }

    checkPlayerCollision() {
        if (collision(this.player.hitbox, this)) {
            this.collisionWithPlayer = true
            this.score = 10
        }
    }
}