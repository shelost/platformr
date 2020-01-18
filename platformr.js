const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const CENT_X = canvas.width/2
const CENT_Y = canvas.height/2

var seq = 0


var level = 1

var enemRange = null

if (canvas.height<canvas.width){

    var scl = 0.02*canvas.height

}else{

    var scl = 0.015*canvas.width
}

var GR_X = 0.05*canvas.width
var GR_Y = 0.05*canvas.height

const logo = new Image()
logo.src = "./platformr-logo.png"

const funk = new Audio("funk.mp3")

const highBlip = new Audio("blip_high.mp3")
highBlip.volume = 0.5
const lowBlip = new Audio("blip_low.mp3")

// Shape Functions
function Block(x,y,w,h, initialAlpha){

    return {

        x: x,
        y: y,
        w: w,
        h: h,
        alpha: initialAlpha,

        xspeed: 0,
        yspeed: 0
    }
}

function Circle(x,y,r){

    return {

        x: x,
        y: y,
        r: r,

        xspeed: 0,
        yspeed: 0
    
    }
}

// Level Function
function setLevel(lv){

    activeLevel = lv
    Blocks[0].x = GR_X
    Blocks[0].y = CENT_Y
    Blocks[1].x = lv.endX;
    Blocks[1].y = lv.endY;
    BLOCK_LIM = lv.lim;
}

// Collison Functions
function RectRect(rect1, rect2){

    if (rect1.x > rect2.x-rect1.w && rect1.x < rect2.x + rect2.w && rect1.y > rect2.y-rect1.h && rect1.y < rect2.y + rect2.h){
  
      return true;
  
    }else{
  
      return false;
    }
  }

function RectCirc(rect, circ){

    if ((rect.x+rect.w/2-circ.x)**2+(rect.y+rect.h/2-circ.y)**2<(circ.r+rect.w)**2){
  
      return true;
  
    }else{
  
      return false;
    }
  }
function CircCirc(circ, circ2){

    if (circ.x > circ2.x-circ2.r-circ.r && circ.x < circ2.x + circ2.r + circ.r && circ.y > circ2.y-circ2.r-circ.r && circ.y < circ2.y+circ2.r+circ.r){
  
        return true;
    
      }else{
    
        return false;
      }
}


var Blocks = []

var M_X, M_Y
var M_W = scl*5
var M_H = scl*1.2

const Levels = {

    one: {
        endX: canvas.width-GR_X-M_W,
        endY: CENT_Y,
        lim: 7,
 
    },
    two: {
        endX: canvas.width-GR_X-M_W,
        endY: GR_X,
        lim: 9,   
    },
    three: {

        startY: canvas.height-400,
        endX: canvas.width-150,
        endY: 200,
        lim: 9,
      
    },
    four: {
        endX: canvas.width-GR_X-M_W,
        endY: CENT_Y,
        lim: 8,
      
    },
    five: {
        endX: canvas.width-GR_X-M_W,
        endY: CENT_Y,
        lim: 10,
    },
    six: {
        endX: canvas.width-GR_X-M_W,
        endY: CENT_Y,
        lim: 10,
      
    },
    seven: {
        endX: canvas.width-GR_X-M_W,
        endY: CENT_Y,
        lim: 10,
      
    },

    eight: {
        endX: canvas.width-GR_X-M_W,
        endY: CENT_Y,
        lim: 9
    },
}

var activeLevel = Levels.one

// Start & End Blocks
const Start = new Block(0,0, M_W,M_H, 1)
const End = new Block(0,0, M_W,M_H, 1)

Blocks.push(Start)
Blocks.push(End)

// Create Blocks
window.addEventListener("click", function(e){

    M_X = e.clientX
    M_Y = e.clientY

    if (Blocks.length < BLOCK_LIM+2){

    var b = new Block(M_X-M_W/2, M_Y-M_H/2, M_W, M_H, 0)

    if (b.alpha < 1){

        setInterval(()=> {

            b.alpha += 0.2
        }, 100)
    }

    Blocks.push(b)
}
})

var player = {

    x: 90,
    y: GR_Y*3,
    w: scl*1.2,
    h: scl*1.2,

    xspeed: 0,
    yspeed: 0,

    jumping: false,
    dead: false
}

var goal = {

    x: End.x,
    y: End.y,

    r: 10,

    captured: false
}

const lava = {

    x: 0,
    y: canvas.height-20,

    w: canvas.width,
    h: 20
}

var Enemies = [

    new Circle(M_W+GR_X*5, CENT_Y, scl*7),

    new Circle(CENT_X-GR_X*3, CENT_Y-GR_Y*4, scl*5),
    new Circle(CENT_X, CENT_Y+GR_Y*4, scl*10),
    new Circle(CENT_X+GR_X*3, CENT_Y-GR_Y*5, scl*6),

    new Circle(CENT_X-GR_X*3, CENT_Y-GR_Y*4, scl*4),
    new Circle(CENT_X, CENT_Y+GR_Y*4, scl*4),
    new Circle(CENT_X+GR_X*3, CENT_Y-GR_Y*5, scl*4),

    new Circle(CENT_X, CENT_Y, scl*18),

    new Circle(CENT_X-GR_X*3, CENT_Y-GR_Y*4, scl*4),
    new Circle(CENT_X, CENT_Y+GR_Y*4, scl*4),
    new Circle(CENT_X+GR_X*3, CENT_Y-GR_Y*5, scl*4),

    
    new Circle(CENT_X, CENT_Y, scl*9),
    new Circle(CENT_X-GR_X*3, CENT_Y-GR_Y*6, scl*5),
    new Circle(CENT_X+GR_X*3, CENT_Y+GR_Y*6, scl*6),
    new Circle(CENT_X-GR_X*3, CENT_Y+GR_Y*6, scl*3),
    new Circle(CENT_X+GR_X*3, CENT_Y-GR_Y*6, scl*4),
    new Block(-15,20,20, canvas.height-40, 1),

    new Block(-15,20,20, canvas.height-60, 1),
    new Block(GR_X*3,20,20, canvas.height-60, 1),
    new Circle(CENT_X, CENT_Y, scl*7),
    new Circle(CENT_X, CENT_Y-GR_Y*7, scl*6),
    new Circle(CENT_X, CENT_Y+GR_Y*7, scl*6),

]

// VARIABLES

var BLOCK_LIM = 10

const con = {

    left:false,
    right:false,
    up:false,
    down: false,
    space: false,
    keyListener:function(event) {
  
      var key_state = (event.type == "keydown")?true:false;
  
      switch(event.keyCode) {
  
        case 37:// left key
          con.left = key_state;
          break;
        case 38:// up key
          con.up = key_state;
          break;
        case 39:// right key
          con.right = key_state;
          break;
        case 40: // down key
          con.down = key_state;
          break;
        case 32: // space bar
          con.space = key_state;
          break;
      }
    }
}

var GRAVITY = scl;


// -------------------------------------------------------
// LOOP LOOP LOOP LOOP LOOP LOOP LOOP LOOP LOOP
// -------------------------------------------------------

const loop = () => {

    funk.play()

    // Levels
    switch (level){

        case 1:
            setLevel(Levels.one)

            break;
        case 2:
            setLevel(Levels.two)
            enemRange = [0,0]
            break;
        case 3:
            setLevel(Levels.three)
            enemRange = [1,3]
            break;
        case 4:
            setLevel(Levels.four)
            enemRange = [4,6]
            break;
        case 5:
            setLevel(Levels.five)
            enemRange = [7,7]
            break;
        case 6:
            setLevel(Levels.six)
            enemRange = [8,10]
            break;
        case 7:
            setLevel(Levels.seven)
            enemRange = [11,16]
            break;
        case 8:
            setLevel(Levels.eight)
            enemRange = [17,21]
            break;
      
    }

    // Player Movement
    if (con.left){
        player.xspeed -= scl/28

    }

    if (con.right){
        player.xspeed += scl/28

    }

    if (con.up){

        if (!player.jumping){

            player.yspeed -= scl*0.8;
            player.jumping = true;
        }
    }

    player.x += player.xspeed
    player.y += player.yspeed

    player.xspeed *= 0.9
    player.yspeed *= 0.9

    player.yspeed += GRAVITY

    goal.x = End.x+M_W/2
    goal.y = End.y-M_H

    // NEXT LEVEL
    if (RectCirc(player, goal)){

        goal.captured = true;
        lowBlip.play()
    }

    if (goal.captured){

        level += 1
        player.x = GR_X
        player.y = 20
        goal.captured = false
        Blocks = [Start, End]
    }
    
    // Handle DEATH
    if (player.y > canvas.height-20-player.h){

        player.dead = true
    }
    if (player.dead){

        highBlip.play()
        player.x = GR_X
        player.y = GR_Y*3
        player.dead = false
        Enemies[16].x = -10
        Enemies[17].x = -10
        Enemies[18].x = GR_X*3
        Blocks = [Start, End]
    }

    // Background
    ctx.globalAlpha = 0.5
    ctx.fillStyle = "lightgray"
    ctx.fillRect(0,0,canvas.width,canvas.height)

    // Blocks
    for (y=0;y<Blocks.length;y++){

        var block = Blocks[y]

        var hitbox = {

            x: block.x-5,
            y: block.y-5,

            w: block.w,
            h: block.h/5
        }

        ctx.globalAlpha = block.alpha
       
        ctx.fillStyle = "black"
        ctx.fillRect(block.x, block.y, block.w, block.h)

        if (RectRect(player, hitbox)){

            player.yspeed = 0
            GRAVITY=0

            player.jumping = false;
            
        }else{

            GRAVITY=0.8
        }
    }

    ctx.globalAlpha = 1;

    // ENEMIES
    if (enemRange){

        for (c=enemRange[0]; c<enemRange[1]+1; c++){

            var enem = Enemies[c]
    
            if (enem.r){ // If Circle

                ctx.strokeStyle = "red"
                ctx.lineWidth = 15;
                ctx.beginPath()
                ctx.arc(enem.x, enem.y, enem.r,0 , Math.PI*2)
                ctx.stroke()

                if (enem.y < GR_Y || enem.y > canvas.height-GR_Y){
        
                    enem.yspeed *= -1
                }
                if (enem.x < GR_X || enem.x > canvas.width-GR_X){
            
                    enem.xspeed *= -1
                }   

                if (RectCirc(player, enem)){

                    player.dead = true
                }

            }else{ // If Rectangle

                ctx.fillStyle = "red"
                ctx.fillRect(enem.x, enem.y, enem.w, enem.h)

                if (RectRect(player, enem)){

                    player.dead = true
                }

            } 

            switch (level){

                case 4:

                    if (enem.yspeed > 0){

                            enem.yspeed += 0.5
                    }else{
        
                            enem.yspeed -= 0.5
                    }  
                    break;

                case 6:
                
                    if (enem.yspeed > 0){

                            enem.yspeed += 0.5
                    }else{
        
                            enem.yspeed -= 0.5
                    }  

                    if (enem.xspeed > 0){

                            enem.xspeed += 0.5
                    }else{
        
                            enem.xspeed -= 0.5
                    }  
                    break;

                case 7:
             
                    if (c === 16){

                        enem.xspeed += 0.15
                    }
                    break;

                case 8:
                    if (c === 17 || c === 18){

                        enem.xspeed += 0.15
                    }
                    break;

                default:
                    break;

            }

            enem.x += enem.xspeed
            enem.y += enem.yspeed
            enem.xspeed *= 0.9
            enem.yspeed *= 0.9

               
  
            
        }
    }
    
    // Player
    ctx.fillStyle = "royalblue"
    ctx.fillRect(player.x, player.y, player.w, player.h)

    ctx.fillStyle = "red"
    ctx.fillRect(lava.x, lava.y, lava.w, lava.h)

    
    // Goal
    if (seq % 2 === 0){

        ctx.fillStyle = "#FFD800"
    }else{

        ctx.fillStyle = "#EECA00"
    }
    ctx.strokeStyle = "#A68D00"
    ctx.lineWidth = 5
    ctx.beginPath()
    ctx.arc(goal.x, goal.y, goal.r,0 , Math.PI*2)
    ctx.fill()
    ctx.stroke()

    // Logo
    ctx.drawImage(logo,20,20,logo.width/20, logo.height/20)
    
    // Text
    ctx.fillStyle = "black"
    ctx.font = "20px Arial"
    ctx.fillText(`LEVEL ${level}`, 25,130)

    if (BLOCK_LIM+2 - Blocks.length != 1){

        ctx.fillText(`${BLOCK_LIM+2 - Blocks.length} Blocks Left`, logo.width/26,130)

    }else{

        ctx.fillText(`${BLOCK_LIM+2 - Blocks.length} Block Left`, logo.width/26,130)
    }
    
    window.requestAnimationFrame(loop)
}


setInterval(()=> {

    seq += 1
},500)



window.requestAnimationFrame(loop)
window.addEventListener("keydown", con.keyListener)
window.addEventListener("keyup", con.keyListener)