import kaboom from "kaboom"
import "kaboom/global"
import {drawTerrain, Terrain/*, tCollision*/} from "./terrain-generate.js"

export const WIDTH = 1920
export const HEIGHT = 1080
const GRAVITY = 450

kaboom({
  width: WIDTH,
  height: HEIGHT,
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
    drawTerrain()
  })

  //tCollision()
  Terrain.seedTerrain()
  
  onLoad(() => {
    add([
      pos(250, 250),
      text("Press \"esc\" to return to menu"),
      lifespan(2, { fade: 0.5 })
    ])
  })

  const bean = add([
    sprite("bean"),
    pos(80, HEIGHT/1.2 - 180*Math.sin(80/75)),
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
    pos(1500, HEIGHT/1.2 - 180*Math.sin(1500/75)),
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

  const newBullet = (position, angle) => {
    add([
      sprite("bullet"),
      pos(position),
      scale(1, 1),
      offscreen({ destroy: true }),
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