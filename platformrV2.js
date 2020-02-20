const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Declare Variables
var CENT_X, CENT_Y, GR_X, GR_Y, MX, MY, HX, HY, enemRange, limit, phase, ONE, caption
var level = 1
var scene = 1
var seq = 1
var mute = false
var numClicks = 0
var GRAVITY = 0

// Load Audio
var Audio = {

    funk: new Audio('funk.mp3'),
    hiblip: new Audio('blip_high.mp3'),
    loblip: new Audio('blip_low.mp3'),
    succ: new Audio('success.mp3')

}

// Menu Selection Grid
var grid = [
   [1,2,3,4,5,6],
   [7,8,9,10,11,12],
   [13,14,15,16,17,18]
]

// Load Images
var logo = new Image()
logo.src = 'platformr-logo.png'

var buttonImg = new Image()

var build = new Image()
build.src = 'build.png'

var move = new Image()
move.src = 'move.png'

var soundImg = new Image()

var menuImg = new Image()
menuImg.src = 'menu.png'

var xImg = new Image()
xImg.src = 'x.png'

var title = new Image()
title.src = 'title.png'

var help = new Image()
help.src = 'question.png'

var guide = new Image()
guide.src = 'guide.png'

function Resize(){

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    CENT_X = canvas.width/2;
    CENT_Y = canvas.height/2;
    GR_X = canvas.width/20;
    GR_Y = canvas.height/20;
    ONE = canvas.width*0.0012
}

Resize()

function Touch(target){

    if (MX>target.x && MX<target.x+target.w && MY > target.y && MY < target.y+target.h){

        return true
    }else{

        return false

    }
}

// Find Distance
function Dist(a,b){

    return (Math.sqrt((a.x-b.x)**2+(a.y-b.y)**2))
}

// Make New Blocks
function newBlock(e){

    MX = e.clientX
    MY = e.clientY

    if (blocks.length-2<limit && !Touch(Button) && scene == 3){

        blocks.push(new Squircle(MX-GR_X*0.5, MY-GR_X/8,GR_X,GR_X/4, GR_X/8, false))

    }
    numClicks += 1
}

// Handle Restart
function Restart(){

    if (level == 17){
        
        player.y = canvas.height
        player.x = canvas.width-40*ONE
    }else{
        player.y = 0
        player.x = 20*ONE
    }

    blocks = [Start, End]
    lava.up = 0
    player.dead = false

    for (y=0;y<Enemies.length;y++){

        var en = Enemies[y]

        if (en.w){

            en.w = en.iw
            en.h = en.ih
            en.x = en.ix
            en.y = en.iy

        }else{

            en.r = en.ir
        }
    }

    for (let f=0;f<3;f++){

        Enemies[f+42].x = Enemies[f+42].ix 
        Enemies[f+42].y = Enemies[f+42].iy
    }

    for (c=0;c<blocks.length;c++){

        var bk = blocks[c]

        bk.x = bk.ix
        bk.y = bk.iy
    }
}


// Initialize Blocks List
var blocks = []

// Shape Functions
function Circle(x,y,r, xspeed, yspeed){

    this.x = x
    this.y = y
    this.r = r

    this.ix = x
    this.iy = y
    this.ir = r

    this.xspeed = xspeed
    this.yspeed = yspeed

    this.draw=function(){

        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, 0, Math.PI*2)
        ctx.closePath()
        ctx.stroke()
    }
}

function Squircle(x,y,w,h,r, strokeOnly){

    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.r = r

    this.ix = x
    this.iy = y
    this.iw = w
    this.ih = h

    this.strokeOnly = strokeOnly

    this.xspeed = 0
    this.yspeed = 0

    this.playerOn = false

    this.draw = function(){

        ctx.beginPath()
        ctx.moveTo(this.x+this.r, this.y)
        ctx.lineTo(this.x+this.w-this.r, this.y)
        ctx.arc(this.x+this.w-this.r, this.y+this.r, this.r, Math.PI*3/2, Math.PI*2)
        ctx.lineTo(this.x+this.w, this.y+this.h-this.r)
        ctx.arc(this.x+this.w-this.r, this.y+this.h-this.r,this.r, 0, Math.PI/2)
        ctx.lineTo(this.x+this.r, this.y+this.h)
        ctx.arc(this.x+this.r, this.y+this.h-this.r, this.r, Math.PI/2, Math.PI)
        ctx.lineTo(this.x, this.y+this.r)
        ctx.arc(this.x+this.r, this.y+this.r, this.r, Math.PI, Math.PI*3/2)
        if (this.strokeOnly){

            ctx.stroke()
        }else{
            ctx.fill()

        }
       
        ctx.closePath()

    }
}

// Enemies List
var Enemies = [

    // Lv 2: The Circle
    new Circle(CENT_X-GR_X*4, CENT_Y, GR_X*2,0,0),

    // Lv 3: The Three Circles
    new Circle(CENT_X, CENT_Y+GR_Y*3, GR_X*2,0,0),
    new Circle(CENT_X-GR_X*3, CENT_Y-GR_Y*5, GR_X,0,0),
    new Circle(CENT_X+GR_X*3, CENT_Y-GR_Y*6, GR_X*1.5,0,0),

    // Lv 4: The Vertical
    new Circle(CENT_X-GR_X*4, CENT_Y, GR_X,0,-2*ONE),
    new Circle(CENT_X, CENT_Y, GR_X,0,2),
    new Circle(CENT_X+GR_X*4, CENT_Y, GR_X,0,-3*ONE),

    // Lv 5: The One Giant Circle
    new Circle(CENT_X, CENT_Y, GR_X*3,0,0),

    // Lv 6: The Chaos
    new Circle(CENT_X-GR_X*4, CENT_Y, GR_X*0.8,-2*ONE,-2*ONE),
    new Circle(CENT_X, CENT_Y, GR_X*0.7,3*ONE,-3*ONE),
    new Circle(CENT_X+GR_X*4, CENT_Y, GR_X,2*ONE,3*ONE),

    // Lv 7: The Squircle
    new Squircle(CENT_X-GR_X*3, CENT_Y-GR_X*4, GR_X*6, GR_X*6, GR_X/2, true),

    // Lv 8:  The Crunch
    new Squircle(CENT_X-GR_X*7, CENT_Y+GR_X*1.5, GR_X*2, GR_X*3, GR_X/4, true),
    new Squircle(CENT_X+GR_X*1, CENT_Y+GR_X*2.5, GR_X*2, GR_X*2, GR_X/4, true),

    new Squircle(CENT_X-GR_X*3, CENT_Y-GR_X*5, GR_X*2, GR_X*2.5, GR_X/4, true),
    new Squircle(CENT_X+GR_X*5, CENT_Y-GR_X*5, GR_X*2, GR_X*1.5, GR_X/4, true),

    // Lv 9: The Consequences
    new Circle(CENT_X, CENT_Y, GR_X*0.7,Math.random()>0.5? 2*ONE:-2*ONE,Math.random()>0.5? 2*ONE:-2*ONE),
    new Circle(CENT_X, CENT_Y, GR_X*0.7,Math.random()>0.5? 2*ONE:-2*ONE,Math.random()>0.5? 2*ONE:-2*ONE),
    new Circle(CENT_X, CENT_Y, GR_X*0.7,Math.random()>0.5? 2*ONE:-2*ONE,Math.random()>0.5? 2*ONE:-2*ONE),
    new Circle(CENT_X, CENT_Y, GR_X*0.7,Math.random()>0.5? 2*ONE:-2*ONE,Math.random()>0.5? 2*ONE:-2*ONE),
    new Circle(CENT_X, CENT_Y, GR_X*0.7,Math.random()>0.5? 2*ONE:-2*ONE,Math.random()>0.5? 2*ONE:-2*ONE),
    new Circle(CENT_X, CENT_Y, GR_X*0.7,Math.random()>0.5? 2*ONE:-2*ONE,Math.random()>0.5? 2*ONE:-2*ONE),
    new Circle(CENT_X, CENT_Y, GR_X*0.7,Math.random()>0.5? 2*ONE:-2*ONE,Math.random()>0.5? 2*ONE:-2*ONE),
    new Circle(CENT_X, CENT_Y, GR_X*0.7,Math.random()>0.5? 2*ONE:-2*ONE,Math.random()>0.5? 2*ONE:-2*ONE),
    new Circle(CENT_X, CENT_Y, GR_X*0.7,Math.random()>0.5? 2*ONE:-2*ONE,Math.random()>0.5? 2*ONE:-2*ONE),
    new Circle(CENT_X, CENT_Y, GR_X*0.7,Math.random()>0.5? 2*ONE:-2*ONE,Math.random()>0.5? 2*ONE:-2*ONE),
    new Circle(CENT_X, CENT_Y, GR_X*0.7,Math.random()>0.5? 2*ONE:-2*ONE,Math.random()>0.5? 2*ONE:-2*ONE),
    new Circle(CENT_X, CENT_Y, GR_X*0.7,Math.random()>0.5? 2*ONE:-2*ONE,Math.random()>0.5? 2*ONE:-2*ONE),
    new Circle(CENT_X, CENT_Y, GR_X*0.7,Math.random()>0.5? 2*ONE:-2*ONE,Math.random()>0.5? 2*ONE:-2*ONE),
    new Circle(CENT_X, CENT_Y, GR_X*0.7,Math.random()>0.5? 2*ONE:-2*ONE,Math.random()>0.5? 2*ONE:-2*ONE),
    new Circle(CENT_X, CENT_Y, GR_X*0.7,Math.random()>0.5? 2*ONE:-2*ONE,Math.random()>0.5? 2*ONE:-2*ONE),
    new Circle(CENT_X, CENT_Y, GR_X*0.7,Math.random()>0.5? 2*ONE:-2*ONE,Math.random()>0.5? 2*ONE:-2*ONE),
    new Circle(CENT_X, CENT_Y, GR_X*0.7,Math.random()>0.5? 2*ONE:-2*ONE,Math.random()>0.5? 2*ONE:-2*ONE),
    new Circle(CENT_X, CENT_Y, GR_X*0.7,Math.random()>0.5? 2*ONE:-2*ONE,Math.random()>0.5? 2*ONE:-2*ONE),
    new Circle(CENT_X, CENT_Y, GR_X*0.7,Math.random()>0.5? 2*ONE:-2*ONE,Math.random()>0.5? 2*ONE:-2*ONE),
    new Circle(CENT_X, CENT_Y, GR_X*0.7,Math.random()>0.5? 2*ONE:-2*ONE,Math.random()>0.5? 2*ONE:-2*ONE),

    // Lv 10: The Stalkers
    new Squircle(CENT_X-GR_X*7, CENT_Y+GR_X*2, GR_X*1.5, GR_X*1.5, GR_X/3, true),
    new Squircle(CENT_X-GR_X*4, CENT_Y-GR_X*2, GR_X*1.5, GR_X*1.5, GR_X/3, true),
    new Squircle(CENT_X-GR_X*1, CENT_Y+GR_X*2.5, GR_X*1.5, GR_X*1.5, GR_X/3, true),
    new Squircle(CENT_X+GR_X*2, CENT_Y-GR_X*2.5, GR_X*1.5, GR_X*1.5, GR_X/3, true),
    new Squircle(CENT_X+GR_X*5, CENT_Y+GR_X*3, GR_X*1.5, GR_X*1.5, GR_X/3, true),

    // Lv 11: The Leap
    new Circle(CENT_X, CENT_Y, GR_X*2, 3*ONE, 0),

    // Lv 12: The Target
    new Circle(CENT_X, CENT_Y, GR_X, 0, 0),
    new Circle(CENT_X-GR_X*3, CENT_Y-GR_X*2, GR_X*0.6, 0, 0),
    new Circle(CENT_X+GR_X*5, CENT_Y+GR_X, GR_X*0.8, 0, 0),

    // Lv 13: The Shower
    new Circle(CENT_X, CENT_Y-GR_X*3, GR_X, -ONE*0.7, 2*ONE*0.7),
    new Circle(CENT_X-GR_X*2, CENT_Y-GR_X*2, GR_X*1.2,-ONE*0.9, 2*ONE*0.9),
    new Circle(CENT_X+GR_X*7, CENT_Y, GR_X*1.3,- ONE, 2*ONE),
    new Circle(CENT_X+GR_X*2, CENT_Y+GR_X, GR_X*0.5, -ONE*.8, 2*ONE*.8),
    new Circle(CENT_X-GR_X*4, CENT_Y-GR_X*2, GR_X*0.5, -ONE*1.1, 2*ONE*1.1),
    new Circle(CENT_X-GR_X*6, CENT_Y, GR_X*0.8, -ONE*1.3, 2*ONE*1.3),
    new Circle(CENT_X-GR_X, CENT_Y+GR_X*5, GR_X*0.9, -ONE, 2*ONE),
    new Circle(CENT_X+GR_X, CENT_Y+GR_X*4, GR_X*0.7, -ONE, 2*ONE),

    // Lv 14: The Sink
    new Circle(CENT_X+GR_X, CENT_Y+GR_X*3, GR_X*0.8, -ONE*3, 0),
    new Circle(CENT_X+GR_X, CENT_Y-GR_X*2, GR_X*0.8, ONE*3, 0),

    // Lv 15: The Parkour
    new Circle(CENT_X-GR_X*6, CENT_Y-GR_X*4.2, GR_X*0.65, 0,0),
    new Circle(CENT_X-GR_X*2, CENT_Y-GR_X*4.2, GR_X*0.65, 0,0),
    new Circle(CENT_X+GR_X*2, CENT_Y-GR_X*4.2, GR_X*0.65, 0,0),
    new Circle(CENT_X+GR_X*6, CENT_Y-GR_X*4.2, GR_X*0.65, 0,0),

    new Circle(CENT_X-GR_X*6, CENT_Y-GR_X*0.5, GR_X*0.65, 0,0),
    new Circle(CENT_X-GR_X*2, CENT_Y-GR_X*0.5, GR_X*0.65, 0,0),
    new Circle(CENT_X+GR_X*2, CENT_Y-GR_X*0.5, GR_X*0.65, 0,0),
    new Circle(CENT_X+GR_X*6, CENT_Y-GR_X*0.5, GR_X*0.65, 0,0),
    
    new Circle(CENT_X-GR_X*6, CENT_Y+GR_X*3.7, GR_X*0.65, 0,0),
    new Circle(CENT_X-GR_X*2, CENT_Y+GR_X*3.7, GR_X*0.65, 0,0),
    new Circle(CENT_X+GR_X*2, CENT_Y+GR_X*3.7, GR_X*0.65, 0,0),
    new Circle(CENT_X+GR_X*6, CENT_Y+GR_X*3.7, GR_X*0.65, 0,0),

    new Circle(CENT_X-GR_X*4, CENT_Y+GR_X*1.6, GR_X*0.95, 0,0),
    new Circle(CENT_X, CENT_Y+GR_X*1.6, GR_X*0.95, 0,0),
    new Circle(CENT_X+GR_X*4, CENT_Y+GR_X*1.6, GR_X*0.95, 0,0),

    new Circle(CENT_X-GR_X*4, CENT_Y-GR_X*2.35, GR_X*0.95, 0,0),
    new Circle(CENT_X, CENT_Y-GR_X*2.35, GR_X*0.95, 0,0),
    new Circle(CENT_X+GR_X*4, CENT_Y-GR_X*2.35, GR_X*0.95, 0,0),

    // Lv 16: The Climb
    new Circle(CENT_X, CENT_Y, GR_X, 1.5*ONE,-1.5*ONE),
    new Circle(CENT_X-GR_X*3, CENT_Y, GR_X*0.8, 1.5*ONE,1.5*ONE),
    new Circle(CENT_X+GR_X*3, CENT_Y, GR_X*0.7, -1.5*ONE,-1.5*ONE),
    new Circle(CENT_X+GR_X*2, CENT_Y-GR_X*3, GR_X, -1.5*ONE,1.5*ONE),

    // Lv 17: The Inverse
    new Circle(CENT_X+GR_X, CENT_Y+GR_X, GR_X, 2*ONE,-2*ONE),
    new Circle(CENT_X-GR_X, CENT_Y-GR_X, GR_X*1.2, -2*ONE,2*ONE),
    new Circle(CENT_X-GR_X, CENT_Y+GR_X, GR_X*0.7, 2*ONE,2*ONE),
    
    // Lv 18: The Final
    new Circle(CENT_X, CENT_Y, GR_X, -2*ONE, -2*ONE),
    new Circle(CENT_X-GR_X*2, CENT_Y-GR_X*2, GR_X/2, 2.5*ONE, -2.5*ONE)

]

setInterval(()=>{

    for (let f=0;f<3;f++){

        Enemies[f+42].targetX = player.x
        Enemies[f+42].targetY = player.y
    }

},2000)

// Buttons
var Button = new Squircle(canvas.width-GR_X*2.4, canvas.height-GR_X*2.4, GR_X*2,GR_X*2,GR_X)
var startButton = new Squircle(CENT_X-GR_X*2, CENT_Y+GR_X*2, GR_X*4, GR_X*2, GR_X*0.8)
var menuButton = new Squircle(canvas.width-GR_X*1.9, canvas.height-GR_X*1.5, GR_X*1.2,GR_X*1.2,GR_X*0.6)
var helpButton = new Squircle(GR_X*0.7, canvas.height-GR_X*1.5, GR_X*1.2,GR_X*1.2,GR_X*0.6)
var MenuX = new Squircle(GR_X, GR_X, GR_X, GR_X, GR_X)

var muteButton = new Squircle(canvas.width-GR_X*2, GR_X, GR_X*1.2,GR_X*1.2,GR_X*0.6)

// Start & End Blocks
var Start = new Squircle(GR_X/2, CENT_Y, GR_X*1.25,GR_X/4,GR_X/8, false)
blocks.push(Start)

var End = new Squircle(canvas.width-GR_X*1.75, CENT_Y, GR_X*1.25, GR_X/4,GR_X/8,false)
blocks.push(End)

// Collision Functions
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

// Initialize Player
var player = new Squircle(30,0,GR_X/4, GR_X/4, GR_X/10)
player.jumping = false
player.dead = false
player.been = 1
player.history = []
player.xadd =  player.w*0.65
player.yadd = player.h*0.5

// Player Trails
setInterval(()=>{

    player.history.push([player.x+player.w/2, player.y+player.h/2])
},50)

setTimeout(()=>{

    setInterval(()=>{

        player.history.shift()
    },50)
  
},300)

// Initialize Lava
var lava = new Squircle(0,canvas.height-20,canvas.width, 20, 0)
lava.up = 0

// Initialize Goal
var goal = new Squircle(0,0,GR_X/2,GR_X/2,GR_X/4)
goal.captured = false

// GAME LOOP
const loop = ()=>{

    if (level <7){
        phase = 1
    }else if (level < 13){

        phase = 2
    }else{

        phase = 3
    }

    if (mute){

        soundImg.src = 'mute.png'
    }else{

        soundImg.src = 'sound.png'
    }

    Audio.funk.play()
 

    // Lava Movement
    lava.h = 20*ONE+lava.up

    if (level == 17){

        lava.y = 0
        lava.h = 15*ONE

    }else{
        lava.y = canvas.height-20*ONE-lava.up

    }

    if (level!= 7 && level != 16){

        lava.up = 0
    }

    // Set Levels
    switch (level){
        case 1:
            enemRange = null
            caption = 'The Beginning'
            limit = 7
            break;
        case 2:
            enemRange = [0,0]
            caption = 'The Circle'
            limit = 8
            break;
        case 3:
            enemRange = [1,3]
            caption = 'The Three Circles'
            limit = 8
            break;
        case 4:
            enemRange = [4,6]
            caption = 'The Vertical'
            limit = 8
            break;
        case 5:
            enemRange = [7,7]
            caption = 'The One Giant Circle'
            limit = 9
            break;
        case 6:
            enemRange = [8,10]
            caption = 'The Chaos'
            limit = 9
            break;
        case 7:
            enemRange = [11,11]
            caption = 'The Squircle'
            limit = 9
            lava.up += 0.15*ONE
            break;
        case 8:
            enemRange = [12,15]
            caption = 'The Crunch'
            limit = 9
            break;
        case 9:
            enemRange = [16,35]
            caption = 'The Consequences'
            limit = 20
            break;
        case 10:
            enemRange = [36,40]
            caption = 'The Stalkers'
            limit = 11
            break;
        case 11:
            enemRange = [41,41]
            caption = 'The Leap'
            limit = 4
            break;
        case 12:
            enemRange = [42,44]
            caption = 'The Target'
            limit = 8
            break;
        case 13:
            enemRange = [45, 52]
            caption = 'The Shower'
            limit = 8
            break;
         case 14:
            enemRange = [53,54]
            caption = 'The Sink'
            limit = 12
            break;
        case 15:
            enemRange = [55,72]
            caption = 'The Parkour'
            limit = 15
            break;
        case 16:
            enemRange = [73,76]
            caption = 'The Climb'
            lava.up += 0.3*ONE
            limit = 8
            break;
        case 17:
            enemRange = [77,79]
            caption = 'The Inverse'
            limit = 7
            break;
        case 18:
            enemRange = [80,81]
            caption = 'The Difficult'
            limit = 7
            break;
    }

    // Special Block Placements
    switch (level){

        default:
            Start.y = CENT_Y
            End.y = CENT_Y
            break;
        case 11:
            Start.y = CENT_Y-GR_X*3
            End.y = CENT_Y+GR_X*2
            break;
        case 16:
            Start.y = CENT_Y+GR_X*3
            End.y = CENT_Y-GR_X*2
            break;
        case 17:
            End.x = GR_X/2,
            Start.x = canvas.width-GR_X*1.75
            break;
    }

    // Player Movement
    player.x += player.xspeed
    player.y += player.yspeed

    player.xspeed *= 0.9
    player.yspeed *= 0.9

    player.yspeed += GRAVITY

    // Player Boundaries
    if (player.x < 0 ||
        player.x > canvas.width-player.w){

        player.xspeed *= -1
    }

    // Player Movement
    if (con.right){

        if (level != 17){
            player.xspeed += 0.3*ONE
        }else{
            player.xspeed -= 0.3*ONE
        }

        player.xadd =  player.w*0.65
        player.yadd = player.h*0.5
    }
    
    if (con.left){
        if (level != 17){
            player.xspeed -= 0.3*ONE
        }else{
            player.xspeed += 0.3*ONE
        }

        player.xadd =  player.w*0.35
        player.yadd = player.h*0.5
    }

    if (con.up && !player.jumping){


        if (level != 17){
            player.yspeed -= 9*ONE
        }else{
            player.yspeed += 9*ONE
        }

        player.jumping= true
    }

    // Death
    if (RectRect(lava, player)){

        player.dead = true
    }

    if (player.dead){

        Audio.hiblip.play()
        Restart()
    }

    // Goal placement

    if (level == 17){

        goal.x = End.x+End.w/2-goal.w/2
        goal.y = End.y+End.h+20*ONE

    }else{
        goal.x = End.x+End.w/2-goal.w/2
        goal.y = End.y-goal.h-20

    }
    
    // Next Level
    if (RectRect(player, goal)){
        if (level == player.been){
            player.been += 1
    
        }

        if (level < 18){
            level += 1
        }else{

            level = 1
        }

        Audio.succ.play()
        Restart()
    }

    // Background
    ctx.clearRect(0,0,canvas.width, canvas.height)

    // Blocks
    for (u=0;u<blocks.length;u++){

        var block = blocks[u]

        var hitbox = {

            x: block.x,
            y: block.y-3*ONE,

            w: block.w,
            h: block.h+6*ONE

        }

        switch (phase){

            case 1:
                ctx.fillStyle = "black"
                break;
            case 2:
                ctx.fillStyle = '#D0D0D0'
                break;
            case 3:
                ctx.fillStyle = 'white'
                break;
        }

       switch (level){
           default:
                break;
            case 14:
                if (block != End){
                    block.y += ONE*0.5
                }
                break;
       }

       if (level != 18){
        block.draw()

       }
      
        if (RectRect(player, hitbox)){

            player.yspeed = 0
            GRAVITY = 0
            player.jumping = false

            if (level == 17){

                player.y = hitbox.y+hitbox.h
            }else{

                player.y = hitbox.y-player.h
            }

            if (level == 18){

                block.draw()
            }

        }else{

            if (level == 17){

                GRAVITY = -0.5*ONE
            }else{
                GRAVITY = 0.5*ONE
            }
        }
    }

    // Lava
    switch (phase){

        case 1:
            ctx.fillStyle = 'red'
            break;
        case 2:
            ctx.fillStyle = 'red'
            break;
        case 3:
            ctx.fillStyle = '#F445FF'
            break;
    }

    lava.draw()

    // Enemies
    if (enemRange){

        for (y=enemRange[0];y<enemRange[1]+1;y++){

            var enem = Enemies[y]

            enem.x += enem.xspeed
            enem.y += enem.yspeed

            // Enemies/Wall Interactions
            if (enemRange[0] == 45){ // The Shower


                if (enem.y > canvas.height+enem.r){

                    enem.y = -enem.r
                }

                if (enem.x < -enem.r){

                    enem.x = canvas.width+enem.r
                
                }
            }else if (enemRange[0]== 73){ // The Climb

                if (enem.y >canvas.height-enem.r-lava.h){
                
                    enem.y = canvas.height-enem.r-lava.h*1.2
                    enem.yspeed *= -1
                 
                }

               if (enem.y < enem.r){

                    enem.yspeed *= -1
               }
            
    
                if (enem.x >canvas.width-enem.r ||
                    enem.x < enem.r){
    
                    enem.xspeed *= -1
                }
              
            }else{
                if (enem.y >canvas.height-enem.r ||
                    enem.y < enem.r){
    
                    enem.yspeed *= -1
                }
    
                if (enem.x >canvas.width-enem.r ||
                    enem.x < enem.r){
    
                    enem.xspeed *= -1
                }

            }
           
            // Enemy Colors
            switch (phase){

                case 1:
                    ctx.strokeStyle = 'red'
                    break;
                case 2:
                    ctx.strokeStyle = 'red'
                    break;
                case 3:
                    ctx.strokeStyle = '#F445FF' // Pink
                    break;
            }
        
            ctx.lineWidth = 15
            enem.draw()

            // Check Enemy Shape
            if (enem.w){

                if (RectRect(player,enem)){

                    player.dead = true
                }
            }else{

                if (RectCirc(player, enem)){

                    player.dead = true
        
                    }
            }

            // Special Cases
            switch (level){

                case 8:
                        enem.h += 0.25*ONE
    
                        if (enem.iy > CENT_Y){
        
                            enem.y -= 0.25*ONE
                        }
                        break;
                case 9:
                        if (blocks.length-2 > y-16){

                            enem.r = GR_X/2
                        }else{

                            enem.r = 0
                           enem.x = Math.random()*canvas.width-GR_X*4+GR_X*2
                           enem.y = canvas.height-GR_X
                        }
                        break;

                case 10:
            
                    if (player.y+ player.h/2 > enem.y+enem.h/2){

                        enem.yspeed = 0.3*ONE
                    }else{

                        enem.yspeed = -0.3*ONE
                    }
                    break;

                case 12:
                    if (enem.targetX < enem.x){

                        enem.xspeed = -enem.r/GR_X*ONE
                    }else{

                        enem.xspeed = enem.r/GR_X*ONE
                    }

                    if (enem.targetY < enem.y){

                        enem.yspeed = -enem.r/GR_X*ONE
                    }else{

                        enem.yspeed =enem.r/GR_X*ONE
                    }

                    if (enem.targetX){
                        
                        ctx.lineWidth = 5
                        ctx.globalAlpha = 0.2
                        ctx.strokeStyle = 'white'
                        ctx.beginPath()
                        ctx.arc(enem.targetX, enem.targetY, GR_X*0.4, 0, Math.PI*2)
                        ctx.closePath()
                        ctx.stroke()

                        ctx.globalAlpha = 0.1
                        ctx.strokeStyle = 'white'
                        ctx.beginPath()
                        ctx.arc(enem.targetX, enem.targetY, GR_X*0.6, 0, Math.PI*2)
                        ctx.closePath()
                        ctx.stroke()

                        ctx.beginPath()
                        ctx.moveTo(enem.targetX-GR_X*0.8, enem.targetY)
                        ctx.lineTo(enem.targetX+GR_X*0.8, enem.targetY)
                        ctx.closePath()
                        ctx.stroke()

                        ctx.beginPath()
                        ctx.moveTo(enem.targetX, enem.targetY-GR_X*0.8)
                        ctx.lineTo(enem.targetX, enem.targetY+GR_X*0.8)
                        ctx.closePath()
                        ctx.stroke()

                        ctx.globalAlpha = 1
                    }
                    break;
       
            }
        }          
    }



    // Sound/Mute Button
    if (Touch(muteButton)){

        if (mute){

            mute = false
        }else{

            mute = true
        }

        MX = 0
        MY = 0

    }

    if (mute){

        Audio.funk.volume = 0
        Audio.hiblip.volume = 0
        Audio.loblip.volume = 0
        Audio.succ.volume = 0

    }else{

        Audio.funk.volume = 1
        Audio.hiblip.volume = 1
        Audio.loblip.volume = 1
        Audio.succ.volume = 1
    }
    
    // Menu Button
    ctx.fillStyle = 'black'
    menuButton.draw()
    ctx.drawImage(menuImg, menuButton.x, menuButton.y, menuButton.w, menuButton.h)
    if (Touch(menuButton)){

        scene = 2

        MX = player.x
        MY = player.y
    }    



    
    // Player
    switch (phase){

        case 1:
            ctx.fillStyle = '#0068FF'
            break;
        case 2:
            ctx.fillStyle = '#0083FF'
            break;
        case 3:
            ctx.fillStyle = '#00A2FF'
            break;
    }

    player.draw()

     // Player Trail
    for(r=0;r<player.history.length; r++){

        ctx.globalAlpha = r/player.history.length
        ctx.beginPath()
        ctx.arc(player.history[r][0], player.history[r][1], player.w/3, 0, Math.PI*2)
        ctx.fill()
        ctx.globalAlpha = 1
    }

    ctx.fillStyle = 'white'
    ctx.beginPath()
    ctx.ellipse(player.x + player.xadd, player.y + player.yadd, player.w/8, player.h/5, 0, 0, Math.PI*2, false)
    ctx.closePath()
    ctx.fill()

    // Goal
    switch (phase){

        case 1:
            ctx.fillStyle = '#FF9C03'
            break;
        case 2: 
            ctx.fillStyle = 'gold'
            break;
        case 3: 
            ctx.fillStyle = 'gold'
            break;
    }

    goal.draw()

    // Playing Scene
    if (scene == 3){
    
        switch (phase){

            case 1:
                ctx.fillStyle = "black"
                break;
            case 2:
                ctx.fillStyle = '#D0D0D0'
                break;
            case 3:
                ctx.fillStyle = 'white'
                break;

        }

        ctx.font = `bold ${ONE*25}px sans-serif`
      
        ctx.fillText(`Level ${level}`, 20*ONE,40*ONE)
        
        if (limit-blocks.length+2 ==1){
        ctx.fillText(`${limit-blocks.length+2} Block Left`, canvas.width-175*ONE, 40*ONE)
        }else{
        ctx.fillText(`${limit-blocks.length+2} Blocks Left`, canvas.width-175*ONE,40*ONE)
        }

        ctx.font = `${ONE*20}px sans-serif`
        ctx.globalAlpha = 0.6
        ctx.fillText(caption, 20*ONE,70*ONE)
        ctx.globalAlpha = 1
    }

    // Start Scene
    if (scene == 1){

        ctx.globalAlpha = 0.7
        ctx.fillStyle = 'black'
        ctx.fillRect(0,0,canvas.width, canvas.height)
        ctx.globalAlpha = 1
       
        ctx.drawImage(logo, CENT_X-logo.width/20, CENT_Y-logo.height/15, logo.width/10, logo.height/10)

        if (Touch(startButton)){

            ctx.fillStyle = '#004CEE'
            setTimeout(()=>{

                scene = 3
            },100)
           
        }else{
            ctx.fillStyle= '#0074FF'

        }
       
        startButton.draw()
        ctx.drawImage(title, startButton.x, startButton.y, startButton.w, startButton.h)
    }

    // Choose Level Menu
    if (scene == 2){

        ctx.globalAlpha = 0.7
        ctx.fillStyle = 'black'
        ctx.fillRect(0,0,canvas.width, canvas.height)
        ctx.globalAlpha = 1

        ctx.drawImage(xImg, MenuX.x, MenuX.y, MenuX.w, MenuX.h)

        ctx.fillStyle = '#E0E0E0'
        muteButton.draw()
        ctx.drawImage(soundImg, muteButton.x, muteButton.y, muteButton.w, muteButton.h)
        
        for (i=0;i<grid.length;i++){

            for (j=0;j<grid[0].length;j++){

                var rect = new Squircle(CENT_X-grid[0].length*GR_X+j*GR_X*2, CENT_Y-grid.length*GR_X+i*GR_X*2, GR_X*2*.9, GR_X*2*.9, GR_X/10)
           
                if (Touch(rect) ){

                    switch(i) {

                        case 0:
                            ctx.fillStyle = '#5CA6FF'
                            break;
                        case 1:
                            ctx.fillStyle = '#0074FF'
                            break;
                         case 2:
                            ctx.fillStyle = '#005BC8'
                            break;
                    }
                    
                    level = grid[i][j]
                    Restart()
                    setTimeout(()=>{
                        scene = 3

                    },200)
                    
                }else{

                    switch(i){

                        case 0:
                            ctx.fillStyle = '#0074FF'
                            break;
                        case 1:
                            ctx.fillStyle = '#005BC8'
                            break;           
                        case 2:
                            ctx.fillStyle = '#004290'
                            break;      
                    }        
                }
               
                rect.draw()

                ctx.fillStyle = 'white'
                ctx.font = `bold ${GR_X*0.6}px Arial`
                if (grid[i][j] < 10){
                    ctx.fillText(grid[i][j], rect.x +rect.w*0.4, rect.y + rect.h*0.65)

                }else{

                    ctx.fillText(grid[i][j], rect.x +rect.w*0.3, rect.y + rect.h*0.65)
                }          
            }
        }

        if (Touch(MenuX)){

            xImg.src = 'x-active.png'

            setTimeout(()=>{
                scene = 3

            },100)
        }else{

            xImg.src = 'x.png'
        }
    }

      // Help Scene
    if (scene == 4){

        ctx.globalAlpha = 0.8
        ctx.fillStyle = 'black'
        ctx.fillRect(0,0,canvas.width, canvas.height)
        ctx.globalAlpha = 1

        ctx.drawImage(xImg, MenuX.x, MenuX.y, MenuX.w, MenuX.h)

        if (Touch(MenuX)){

            xImg.src = 'x-active.png'

            setTimeout(()=>{
                scene = 3

            },100)
        }else{

            xImg.src = 'x.png'
        }


        var one = new Squircle(GR_X, CENT_Y-GR_X*2.5, GR_X*2, GR_X*2, GR_X)
        var two = new Squircle(GR_X*2, CENT_Y, GR_X*2, GR_X*2, GR_X)
        var three = new Squircle(GR_X, CENT_Y+GR_X*2.5, GR_X*1.4, GR_X*1.4, GR_X*0.7)

        ctx.fillStyle = '#0064FF'
        one.draw()
        ctx.drawImage(build, one.x, one.y, one.w, one.h)

        ctx.fillStyle = '#C100FF'
        two.draw()
        ctx.drawImage(move, two.x, two.y, two.w, two.h)

        ctx.fillStyle = 'black'
        three.draw()
        ctx.drawImage(menuImg, three.x, three.y, three.w, three.h)

        ctx.fillStyle = 'white'
        ctx.font = `bold ${GR_X/2}px sans-serif`
        ctx.fillText('BUILD MODE', one.x+one.w*1.2, one.y+one.h/3)
        ctx.fillText('MOVE MODE', two.x+two.w*1.2, two.y+two.h/3)

        ctx.font = `${GR_X/2}px sans-serif`
        ctx.fillText('Tap to place blocks! But be careful, you only have a limited amount.', one.x+one.w*1.2, one.y+one.h*2/3)
        ctx.fillText('Drag to move the player! Drag upwards to jump.', two.x+two.w*1.2, two.y+two.h*2/3)
        ctx.fillText('All the levels are accessible via the Menu panel, if you want.', three.x+three.w*1.2, three.y+three.h/2)

    }

    switch(phase){

        case 1:
            ctx.fillStyle = 'black'
            break;
        case 2:
            ctx.fillStyle = 'white'
            break;
        case 3:
            ctx.fillStyle = 'white'
            break;
    }

    ctx.beginPath()
    ctx.arc(HX, HY, 10, 0, Math.PI*2)
    ctx.closePath()
    ctx.fill()
}

const con = {

    left:false,
    right:false,
    up:false,
    down: false,
    space: false,
    keyListener:function(event) {
  
      var key_state = (event.type == "keydown")?true:false;
  
      switch(event.keyCode) {
  
        case 37:// left
          con.left = key_state;
          break;
        case 65: // A
            con.left = key_state;
          break;
        case 38:// up
          con.up = key_state;
          break;
        case 87:// up
          con.up = key_state;
          break;
        case 39:// right
          con.right = key_state;
          break;
        case 68:
            con.right = key_state;
          break; 
        case 40: // down
          con.down = key_state;
          break;
        case 83:
            con.right = key_state;
          break; 
        case 32: // spacebar
          con.space = key_state;
          break;
      }
    }
}





setInterval(loop, 1000/60)

window.addEventListener('resize', Resize, false)
window.addEventListener('orientationchange', Resize, false)
window.addEventListener("click", newBlock, false)
window.addEventListener("keydown", con.keyListener)
window.addEventListener("keyup", con.keyListener)
window.addEventListener("mousemove", e => {

    HX = e.clientX
    HY = e.clientY
})



//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////

const bg = document.getElementById("bg")
const bgx = bg.getContext("2d")

function resizebg(){

    bg.width = window.innerWidth;
    bg.height = window.innerHeight;

}

resizebg()

var Circs = []

function Circ(x,y,r){

    this.x = x
    this.y = y
    this.r = r
    this.xspeed = Math.random()+0.5
    this.yspeed = Math.random()+0.5
    this.ixspeed = this.xspeed
    this.iyspeed = this.iyspeed
    this.alpha = Math.random()*0.3
    this.up = Math.random()>0.5? true: false

}

for (u=0;u<20;u++){

    var c = new Circ(Math.random()*bg.width, Math.random()*bg.height, Math.random()*bg.width/30+bg.width/30)
    Circs.push(c)

}

const bgloop = () =>{

bgx.clearRect(0,0,canvas.width, canvas.height)

bgx.globalAlpha = 1

switch (phase){

    case 1:
        bgx.fillStyle = "#D0D0D0"
        break;
    case 2:
        bgx.fillStyle = 'black'
        break;
    case 3:
        bgx.fillStyle = '#1D0059'
        break;
}

bgx.fillRect(0,0,canvas.width, canvas.height)

    for (t=0;t<Circs.length;t++){

        var circ = Circs[t]

        circ.x += circ.xspeed
        circ.y += circ.yspeed

        bgx.globalAlpha = circ.alpha


        switch (phase){

            case 1:
                bgx.fillStyle = 'black'
                break;
            case 2:
                bgx.fillStyle = '#A0A0A0'
                break;
            case 3:
                bgx.fillStyle = '#A386FA'
                break;
        }

    
        bgx.beginPath()
        bgx.arc(circ.x, circ.y, circ.r, 0, Math.PI*2)
        bgx.closePath()
        bgx.fill()

        if (circ.x > bg.width+circ.r){

            circ.x = -circ.r
        }

        if (circ.y > bg.height+circ.r){

            circ.y = -circ.r
        }
    }
}

setInterval(()=>{

for (r=0;r<Circs.length;r++){

    var cir = Circs[r]

    if (cir.up){

        cir.alpha += 0.01

    }else{

    cir.alpha -= 0.01}

    if (cir.alpha > 0.29){

        cir.up = false

    }

    if (cir.alpha < 0.01){

        cir.up = true
    }
}

},100)

setInterval(bgloop, 1000/60)

window.addEventListener('resize', resizebg, false)
window.addEventListener('orientationchange', resizebg, false)