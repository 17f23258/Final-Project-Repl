import "kaboom/global"
import kaboom from "kaboom"
import Terrain from "./terrain-generate.js"

export const WIDTH = 1920
export const HEIGHT = 1080
const GRAVITY = 450

kaboom({
  width: WIDTH,
  height: HEIGHT,
  background: [69, 65, 65]
})

/*
const recording = record()

onKeyDown(".", () => {
  recording.download({filename: "recording"})
})
*/

setGravity(GRAVITY)

loadBean()
loadPedit("barrel", "sprites/barrel.pedit")
loadPedit("bullet", "sprites/bullet.pedit")
loadPedit("arrow", "sprites/arrow.pedit")

function addBtn(txt, p, f) {
  // add a parent background object
  const btn = add([
    rect(240, 80, { radius: 8 }),
    pos(p),
    area(),
    scale(1.7),
    anchor("center"),
    outline(4),
  ])

  // add a child object that displays the text
  btn.add([
    text(txt),
    anchor("center"),
    color(0, 0, 0),
  ])

  // onHoverUpdate() comes from area() component
  // it runs every frame when the object is being hovered
  btn.onHoverUpdate(() => {
    btn.scale = vec2(2.04)
    setCursor("pointer")
  })

  // onHoverEnd() comes from area() component
  // it runs once when the object stopped being hovered
  btn.onHoverEnd(() => {
    btn.scale = vec2(1.7)
    setCursor("default")
  })

  // onClick() comes from area() component
  // it runs once when the object is clicked
  btn.onClick(f)

  return btn

}

const addWind = (minWind, windVariance) => {
  //generate random number (+ or -) for wind force
  //display wind 
  //add the force to the bullet either through the move command of the bullet or by detecting when the bullet is high up
  let windForce = minWind + Math.floor(Math.random() * windVariance)
  
  add([
    text(Math.abs(windForce).toString()),
    pos(176, 24)
  ])

  add([
    sprite("arrow"),
    pos(186, 20),
    rotate(windForce < 0 ? 180 : 0),
    anchor("center")
  ])

  return windForce
}

const newBullet = (position, angle, power) => {
  return add([
    sprite("bullet"),
    pos(position),
    //offscreen({ destroy: true }),
    area(),
    anchor("center"),
    body(),
    rotate(angle),
    move(vec2(Math.cos(angle / 180 * Math.PI), Math.sin(angle / 180 *     Math.PI)), (power + 20) * 8.3),              //Calculating movement vector
    "bullet"
  ])
}

/*const player = make([
  sprite("bean"),
  pos(80, HEIGHT - (Terrain.points[80] + 27)),
  rotate(0),
  anchor("center"),
  {
    SPEED_HIGH: 150,
    SPEED_LOW: 45,
    power: 0
  }
])*/

const player = make([
  sprite("bean"),
  pos(),
  area(),
  rotate(0),
  anchor("center"),
  {
    SPEED_HIGH: 150,
    SPEED_LOW: 45,
    ROTATE_MIN: -70,
    ROTATE_MAX: 0,
    POS_MIN: 0,
    POS_MAX: WIDTH / 3,
    power: 0
  }
])

const player2 = make([
  sprite("bean"),
  pos(),
  area(),
  rotate(0),
  anchor("center"),
  {
    SPEED_HIGH: 150,
    SPEED_LOW: 45,
    ROTATE_MIN: 0,
    ROTATE_MAX: 70,
    POS_MIN: 2 * WIDTH / 3,
    POS_MAX: WIDTH,
    power: 0
  }
])

scene("practice", () => {

  onDraw(() => {
    Terrain.drawTerrain()
  })

  Terrain.seedTerrain()
  Terrain.interpolateLinear()
  Terrain.tCollision()
  const wind = addWind(-2, 5)
  
  onLoad(() => {
    add([
      pos(WIDTH / 2, 450),
      text("Press \"esc\" to return to menu"),
      lifespan(2, { fade: 0.5 }),
      anchor("center")
    ])
  })

  const bean = add(player)
  bean.pos = vec2(80, HEIGHT - Terrain.points[80] - 27)
  bean.power = 0
  bean.angle = 0

  const target = add([
    sprite("bean"),
    pos(1500, HEIGHT - (Terrain.points[1500] + 27)),
    area(),
    anchor("center")
  ])

  bean.add([
    sprite("barrel"),
    scale(3, 3),
    pos(0, -60)
  ])

  target.onCollide("bullet", () => {
    addKaboom(target.pos)
    destroy(target)
    destroyAll("bullet")
    wait(1.1, () => {go("practice")})
  })

  onCollide("bullet", "ground", () => {
    destroyAll("bullet")
  })
  
  target.onCollide("nuke", () => {
    addKaboom(target.pos, {scale: 15})
    destroy(target)
    destroyAll("nuke")
    play("explosion")
    wait(3, () => {go("practice")})
  })

  const angle = add([            //UI for displaying the angle of player
    text(Math.floor(bean.angle).toString()),
    pos(24, 24)
  ])

  const power = add([          //UI to display power of the shot
    text(Math.floor(bean.power).toString()),
    pos(100, 24)
  ])

  let bullet
  onKeyDown("space", () => {
    if (get("bullet").length == 0) {
      let endOfBarrel = vec2(bean.pos.x + 85 * Math.cos(-0.15 + bean.angle / 180 * Math.PI), bean.pos.y + 92 * Math.sin(-0.15 + bean.angle / 180 * Math.PI)) //Find the position of the end of the barrel to add bullets
      bullet = newBullet(endOfBarrel, bean.angle, bean.power)
    }
  })

  onUpdate(() => {
    angle.text = Math.abs(Math.floor(bean.angle)).toString()  //Update player angle UI
    power.text = Math.floor(bean.power).toString()

    if (get("bullet").length > 0) {
      if (bullet.pos.x > WIDTH || bullet.pos.x < 0) {
        destroy(bullet)
      }
      if (bullet.pos.y < 300) {
        bullet.pos.x += wind
      }
    }
  })

  let rotationSpeed = bean.SPEED_HIGH

  onKeyDown("alt", () => {
    rotationSpeed = bean.SPEED_LOW  //Slow rotation when holding alt
  })

  onKeyRelease("alt", () => {
    rotationSpeed = bean.SPEED_HIGH  //Normal when alt released
  })

  onKeyDown("a", () => {
    if (bean.pos.x > bean.POS_MIN) {
      bean.pos.x--
      bean.pos.y = HEIGHT - Terrain.points[bean.pos.x] - 27 
    }
  })
  
  onKeyDown("d", () => {
    if (bean.pos.x < bean.POS_MAX) {
      bean.pos.x++
      bean.pos.y = HEIGHT - Terrain.points[bean.pos.x] - 27
    }
  })
  
  onKeyDown("left", () => {
    if (bean.angle > -70) {
      bean.angle += -rotationSpeed * dt() //Rotate left
    }
    else {
      bean.angle = -70  //Stop at 70 degrees anticlockwise
    }
  })

  onKeyDown("right", () => {
    if (bean.angle < 0) {
      bean.angle += rotationSpeed * dt() //Rotate right
    }
    else {
      bean.angle = 0  //Prevent tank rotating the wrong direction
    }
  })

  let smooth = 3;

  onKeyDown("up", () => {
    smooth += 1.2 * dt()
    if (bean.power < 100) {
      bean.power += 0.7 * smooth ** 2 * dt() //Increase power smoothly
    }
    else {
      bean.power = 100  //Maximum power 100
    }
  })

  onKeyRelease("up", () => {
    smooth = 3
  })

  onKeyDown("down", () => {
    smooth += 1.2 * dt()
    if (bean.power > 1) {
      bean.power -= 0.7 * smooth ** 2 * dt()  //Decrease power smoothly
    }
    else {
      bean.power = 0  //Minimum power 0
    }
  })

  onKeyRelease("down", () => {
    smooth = 3
  })

  const cheatInputs = ["up","up","down","down","left","right","left","right","space"]
  let inputs = []
  const cheatCode = (key) => {
    inputs.push(key)
    if (cheatInputs.slice(0,inputs.length).toString() == inputs.toString()) {
      if (inputs.length == cheatInputs.length){
        inputs = []
        dropNuke(0, -300)
      }
    }
    else {
      inputs = []
    }
  }

  const dropNuke = (x, y) => {
    loadSprite("nuke", "/sprites/nuke.png")
    loadSound("explosion", "/sounds/explosion.mp3")
    const nuke = add([
      sprite("nuke"),
      rotate(target.pos.angle(vec2(x,y))),
      scale(0.7),
      pos(x, y),
      anchor("center"),
      area(),
      move(target.pos.angle(vec2(x,y)), 1200),
      "nuke"
    ])
  }
  
  onKeyPress((key) => {
    cheatCode(key)
  })
    
  /*onKeyPress("up", () => {})
  onKeyPress("down", () => {})
  onKeyPress("left", () => {})
  onKeyPress("right", () => {})*/
  
  onKeyDown("escape", () => {
    go("main-menu")
  })

})

scene("multiplayer", (currentTurn = 1, score = [0,0], newLevel = true) => {

  const getEndOfBarrel = (player) => {
    if (player === player_1) {
      return vec2(player.pos.x + 85 * Math.cos(-0.15 + player.angle / 180 * Math.PI), player.pos.y + 92 * Math.sin(-0.15 + player.angle / 180 * Math.PI))
    }
    else {
      return vec2(player.pos.x - 85 * Math.cos(-0.15 + player.angle / 180 * Math.PI), player.pos.y - 92 * Math.sin(0.20 + player.angle / 180 * Math.PI))
    }
  }
  
  onDraw(() => {
    Terrain.drawTerrain()
  })

  if (newLevel) {
    Terrain.seedTerrain()
    Terrain.interpolateLinear()
  }
  Terrain.tCollision()
  
  let wind = addWind(-3, 6)

  onLoad(() => {
    if (newLevel) {
      add([
        pos(WIDTH / 2, 450),
        text("Press \"esc\" to return to menu"),
        lifespan(2, { fade: 0.5 }),
        anchor("center")
      ]) 
    }
  })
  
  const player_1 = add(player)
  if (newLevel) player_1.pos = vec2(80, HEIGHT - Terrain.points[80] - 27)
  player_1.add([
    sprite("barrel"),
    scale(3, 3),
    pos(0, -60)
  ])
  
  const player_2 = add(player2)
  if (newLevel) player_2.pos = vec2(1500, HEIGHT - Terrain.points[1500] - 27)
  player_2.add([
    sprite("barrel"),
    scale(3, 3),
    pos(0, -65),
    rotate(180),
    anchor("botleft")
  ])

  let currentPlayer = currentTurn == 1 ? player_1 : player_2
  if (newLevel) {
    currentPlayer.power = 0
    currentPlayer.angle = 0
  }

  let awaitTurn = false
  
  onCollide("bullet", "ground", () => {
    destroyAll("bullet")
    awaitTurn = true
    wait(0.7, () => {go("multiplayer", currentPlayer === player_1 ? 2 : 1, score, false)})
  })

  player_1.onCollide("bullet", () => {
    addKaboom(player_1.pos)
    destroy(player_1)
    destroyAll("bullet")
    wait(1.1, () => {go("multiplayer", 1, [score[0], score[1]+1])})
  }) 

  player_2.onCollide("bullet", () => {
    addKaboom(player_2.pos)
    destroy(player_2)
    destroyAll("bullet")
    wait(1.1, () => {go("multiplayer", 2, [score[0]+1, score[1]])})
  })
  
  const angle = add([            //UI for displaying the angle of player
    text(Math.floor(currentPlayer.angle).toString()),
    pos(24, 24)
  ])

  const power = add([          //UI to display power of the shot
    text(Math.floor(currentPlayer.power).toString()),
    pos(100, 24)
  ])

  const scoreCount = add([
    text(score[0] + " : " + score[1]),
    pos(WIDTH / 2, 24)
  ])
  
  onUpdate(() => {
    angle.text = Math.abs(Math.floor(currentPlayer.angle)).toString()  //Update player angle UI
    power.text = Math.floor(currentPlayer.power).toString()

    if (get("bullet").length > 0) {
      if (bullet.pos.x > WIDTH || bullet.pos.x < 0) {
        destroy(bullet)
        go("multiplayer", currentPlayer === player_1 ? 2 : 1, score, false)
      }
      if (bullet.pos.y < 300) {
        bullet.pos.x += wind
      }
    }
  })
  
  let rotationSpeed = player.SPEED_HIGH

  onKeyDown("alt", () => {
    rotationSpeed = player.SPEED_LOW  //Slow rotation when holding alt
  })

  onKeyRelease("alt", () => {
    rotationSpeed = player.SPEED_HIGH  //Normal when alt released
  })
  
  onKeyDown("left", () => {
    if (currentPlayer.angle > currentPlayer.ROTATE_MIN) {
      currentPlayer.angle -= rotationSpeed * dt() //Rotate left
    }
    else {
      currentPlayer.angle = currentPlayer.ROTATE_MIN  //Stop at 70 degrees anticlockwise
    }
  })

  onKeyDown("right", () => {
    if (currentPlayer.angle < currentPlayer.ROTATE_MAX) {
      currentPlayer.angle += rotationSpeed * dt() //Rotate right
    }
    else {
      currentPlayer.angle = currentPlayer.ROTATE_MAX  //Prevent tank rotating the wrong direction
    }
  })

  let smooth = 3
  
  onKeyDown("up", () => {
    smooth += 1.2 * dt()
    if (currentPlayer.power < 100) {
      currentPlayer.power += 0.7 * smooth ** 2 * dt() //Increase power smoothly
    }
    else {
      currentPlayer.power = 100  //Maximum power 100
    }
  })

  onKeyRelease("up", () => {
    smooth = 3
  })

  onKeyDown("down", () => {
    smooth += 1.2 * dt()
    if (currentPlayer.power > 1) {
      currentPlayer.power -= 0.7 * smooth ** 2 * dt()  //Decrease power smoothly
    }
    else {
      currentPlayer.power = 0  //Minimum power 0
    }
  })

  onKeyRelease("down", () => {
    smooth = 3
  })

  let bullet
  onKeyDown("space", () => {
    if (get("bullet").length == 0 && !awaitTurn) {
      bullet = newBullet(getEndOfBarrel(currentPlayer), currentPlayer.angle, currentPlayer === player_1 ? currentPlayer.power : (currentPlayer.power * -1 - 40))
    }
  })

  onKeyDown("a", () => {
    if (currentPlayer.pos.x > currentPlayer.POS_MIN) {
      currentPlayer.pos.x--
      currentPlayer.pos.y = HEIGHT - Terrain.points[currentPlayer.pos.x] - 27 
    }
  })
  
  onKeyDown("d", () => {
    if (currentPlayer.pos.x < currentPlayer.POS_MAX) {
      currentPlayer.pos.x++
      currentPlayer.pos.y = HEIGHT - Terrain.points[currentPlayer.pos.x] - 27
    }
  })
  
  onKeyDown("escape", () => {
    go("main-menu")
  })

  /*
  onKeyDown(".", () => {
    recording.download()
  })
  */
})

scene("multiplayer-menu", () => {
  addBtn("Join Game", vec2(WIDTH / 2, HEIGHT / 4), () => { })
  addBtn("Create Game", vec2(WIDTH / 2, 450), () => { go("multiplayer") })
  addBtn("Return", vec2(WIDTH / 2, 630), () => { go("main-menu") })
})

scene("main-menu", () => {
  addBtn("Practice", vec2(WIDTH / 2, HEIGHT / 4), () => {go("practice")})
  addBtn("Multiplayer", vec2(WIDTH / 2, 450), () => {go("multiplayer")})
})

go("main-menu")