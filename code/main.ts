import kaboom from "kaboom"
import "kaboom/global"
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

function addBtn(txt, p, f) {
  // add a parent background object
  const btn = add([
    rect(240, 80, { radius: 8 }),
    pos(p),
    area(),
    scale(1),
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
    btn.scale = vec2(1.2)
    setCursor("pointer")
  })

  // onHoverEnd() comes from area() component
  // it runs once when the object stopped being hovered
  btn.onHoverEnd(() => {
    btn.scale = vec2(1)
  })

  // onClick() comes from area() component
  // it runs once when the object is clicked
  btn.onClick(f)

  return btn

}

scene("practice", () => {

  onDraw(() => {
    Terrain.drawTerrain()
  })

  Terrain.seedTerrain()
  Terrain.interpolateLinear()
  Terrain.tCollision()
  
  onLoad(() => {
    add([
      pos(250, 250),
      text("Press \"esc\" to return to menu"),
      lifespan(2, { fade: 0.5 })
    ])
  })

  const bean = add([
    sprite("bean"),
    pos(80, HEIGHT - (Terrain.points[80] + 27)),
    rotate(0),
    anchor("center"),
    {
      SPEED_HIGH: 150,
      SPEED_LOW: 45,
      power: 0
    }
  ])

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
    go("practice")
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
  
  const newBullet = (position, angle) => {
    add([
      sprite("bullet"),
      pos(position),
      //offscreen({ destroy: true }),
      area(),
      anchor("center"),
      body(),
      rotate(angle),
      move(vec2(Math.cos(angle / 180 * Math.PI), Math.sin(angle / 180 * Math.PI)), (bean.power + 20) * 8.3),              //Calculating movement vector
      "bullet"
    ])
  }

  const angle = add([            //UI for displaying the angle of player
    text(Math.floor(bean.angle).toString()),
    pos(24, 24)
  ])

  const power = add([          //UI to display power of the shot
    text(Math.floor(bean.power).toString()),
    pos(100, 24)
  ])

  onKeyDown("space", () => {
    if (get("bullet").length == 0) {
      let endOfBarrel = vec2(bean.pos.x + 85 * Math.cos(-0.15 + bean.angle / 180 * Math.PI), bean.pos.y + 92 * Math.sin(-0.15 + bean.angle / 180 * Math.PI)) //Find the position of the end of the barrel to add bullets
      let bullet = newBullet(endOfBarrel, bean.angle)
    }
  })

  onUpdate(() => {
    angle.text = Math.abs(Math.floor(bean.angle)).toString()  //Update player angle UI
    power.text = Math.floor(bean.power).toString()

    if (get("bullet").length > 0) {
      if (get("bullet")[0].pos.x > WIDTH) {
        destroyAll("bullet")
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

scene("multiplayer-menu", () => {
  addBtn("Join Game", vec2(250, 150), () => { })
  addBtn("Create Game", vec2(250, 250), () => { })
  addBtn("Return", vec2(250, 350), () => { go("main-menu") })
})

scene("main-menu", () => {
  addBtn("Practice", vec2(250, 250), () => { go("practice") })
  addBtn("Multiplayer", vec2(250, 350), () => { go("multiplayer-menu") })
})

go("main-menu")