const startBtn = document.getElementById("start-btn")
const startPage = document.getElementById("start")
const restartBtn = document.getElementById("restart-btn")
const restartPage = document.getElementById("end")
const result = document.getElementById("game-result")
const scoreEl = document.getElementById("score-display")
const canvas = document.querySelector("#game")
const c = canvas.getContext("2d")

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const scaledCanvas = {
    width: canvas.width / 4,
    height: canvas.height / 4
}
let totalScore = 0
const gravity = 0.1
const keys = {
    d : {
        pressed: false
    },
    a : {
        pressed: false
    },
    w : {
        pressed: false
    },
    ArrowLeft : {
        pressed: false
    },
    ArrowRight : {
        pressed: false
    },
    ArrowUp : {
        pressed: false
    }
}
const camara = {
    position: {
        x: 0,
        y: -432 + scaledCanvas.height // 432 is background.image.height
    }
}

//find floor
const floorCollisions2D = [] //a 2D array
for (let i = 0; i < floorCollisions.length; i+=36) { //36 blocks per row
    floorCollisions2D.push(floorCollisions.slice(i, i+36))
}

//find platforms
const platformCollisions2D = []
for (let i = 0; i < platformCollisions.length; i+=36) { //36 blocks per row
    platformCollisions2D.push(platformCollisions.slice(i, i+36))
}

//call CollisionBlock class
const floorCollionBlocks = []
floorCollisions2D.forEach((row, y_index) => {
    row.forEach((el, x_index) => {
        if (el === 202) {
            //16 px per block
            floorCollionBlocks.push(new CollisionBlock({x: x_index * 16, y: y_index * 16})) 
        }
    })
})

const platformCollisionBlocks = []
platformCollisions2D.forEach((row, y_index) => {
    row.forEach((el, x_index) => {
        if (el === 202) {
            //16 px per block
            platformCollisionBlocks.push(new CollisionBlock({x: x_index * 16, y: y_index * 16}, 4))
        }
    })
})


const animations = {
    Idle: {
        imageSrc: './img/warrior/Idle.png',
        frameRate: 8,
        frameFrequency: 3,
      },
      Run: {
        imageSrc: './img/warrior/Run.png',
        frameRate: 8,
        frameFrequency: 5,
      },
      Jump: {
        imageSrc: './img/warrior/Jump.png',
        frameRate: 2,
        frameFrequency: 2,
      },
      Fall: {
        imageSrc: './img/warrior/Fall.png',
        frameRate: 2,
        frameFrequency: 3,
      },
      FallLeft: {
        imageSrc: './img/warrior/FallLeft.png',
        frameRate: 2,
        frameFrequency: 3,
      },
      RunLeft: {
        imageSrc: './img/warrior/RunLeft.png',
        frameRate: 8,
        frameFrequency: 5,
      },
      IdleLeft: {
        imageSrc: './img/warrior/IdleLeft.png',
        frameRate: 8,
        frameFrequency: 3,
      },
      JumpLeft: {
        imageSrc: './img/warrior/JumpLeft.png',
        frameRate: 2,
        frameFrequency: 3,
      },
}

//create background and player objects
const player = new Player({x:0, y:200}, floorCollionBlocks, platformCollisionBlocks, 
    "./img/warrior/Idle.png", animations, 8)
//console.log(player)
const background = new Sprite({x:0, y:0}, "./img/background.png")
const exit = new Sprite({x: 550, y: 370}, "./img/exit.png", 1, 1, 0.07)

//create coins objects
const coins = [
    new Coins({x:16, y:134}, player),
    new Coins({x:112, y:246}, player),
    new Coins({x:112, y:86}, player),
    new Coins({x:208, y:214}, player),
    new Coins({x:208, y:54}, player),
    new Coins({x:304, y:182}, player),
    new Coins({x:448, y:134}, player),
    new Coins({x:448, y:262}, player),
    new Coins({x:448, y:326}, player),
    new Coins({x:496, y:54}, player)
]

const animate = () => {
    window.requestAnimationFrame(animate)
    //canvas of the page
    c.fillStyle = "white"
    c.fillRect(0, 0, canvas.width, canvas.height)

    //scale up 
    c.save()
    c.scale(4, 4)
    c.translate(camara.position.x, camara.position.y)
    background.update()
    exit.update()

    //draw out collision blocks
    //floorCollionBlocks.forEach(block => block.update())
    //platformCollisionBlocks.forEach(block => block.update())

    player.update()
    //default x velocity
    player.velocity.x = 0

    //draw out coins and record scores
    let scores = []
    coins.forEach(el => { 
        el.update()
        scores.push(el.score)
    })
    totalScore = scores.reduce((acc, cur) => acc+cur, 0)
    scoreEl.textContent = `Coins: ${totalScore}`

    //change x velocity when keydown
    if (keys.d.pressed || keys.ArrowRight.pressed) {
        player.switchSprite("Run")
        player.lastDirection = "right"
        player.velocity.x = 2
        player.shouldPanCamaraToRight()
    }
    else if (keys.a.pressed || keys.ArrowLeft.pressed) {
        player.switchSprite("RunLeft")
        player.lastDirection = "left"
        player.velocity.x = -2
        player.shouldPanCamaraToLeft()
    }
    else if (player.velocity.y === 0) {
        if (player.lastDirection === 'right') {
            player.switchSprite('Idle')
        }
        else {
            player.switchSprite('IdleLeft')
        }
      }
    
      if (player.velocity.y < 0) {
        player.shouldPanCamaraToUp()
        if (player.lastDirection === 'right') {
            player.switchSprite('Jump')
        }
        else {
            player.switchSprite('JumpLeft')
        }
      } 
      else if (player.velocity.y > 0) {
        player.shouldPanCamaraToDown()
        if (player.lastDirection === 'right') {
            player.switchSprite('Fall')
        }
        else {
            player.switchSprite('FallLeft')
        }
      }

    c.restore()
}

animate()

window.addEventListener("keydown", (e) => {
    switch(e.key) {
        case "d":
        case "ArrowRight":
            keys.d.pressed = true
            keys.ArrowRight.pressed = true
            break
        case "a":
        case "ArrowLeft":
            keys.a.pressed = true
            keys.ArrowLeft.pressed = true
            break
        case "w":
        case "ArrowUp":
            keys.w.pressed = true
            keys.ArrowUp.pressed = true
            player.velocity.y = -4
    }
})

window.addEventListener("keyup", (e) => {
    switch(e.key) {
        case "d":
        case "ArrowRight":
            player.switchSprite("Idle")
            keys.d.pressed = false
            keys.ArrowRight.pressed = false
            break
        case "a":
        case "ArrowLeft":
            player.switchSprite("IdleLeft")
            keys.a.pressed = false
            keys.ArrowLeft.pressed = false
            break
        case "w":
        case "ArrowUp":
            keys.w.pressed = false
            keys.ArrowUp.pressed = false
            break
    }

})


//game start and game over pages
startBtn.addEventListener("click", () => {
    startPage.style.display = "none"
    canvas.style.display = "block"
    scoreEl.style.display = "block"
})

restartBtn.addEventListener("click", () => {
    restartPage.style.display="none";
    canvas.style.display = "block"
    scoreEl.style.display = "block"
    totalScore = 0
    camara.position.x = 0
    camara.position.y = -432 + scaledCanvas.height
    coins.forEach((coin) => coin.collisionWithPlayer = false)
    player.restart()
})
