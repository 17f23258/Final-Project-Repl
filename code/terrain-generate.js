import {WIDTH, HEIGHT} from "./main.js"

export const drawTerrain = () => {
  for (let w = 0; w < WIDTH; w += 3){
    drawLine({
      p1: vec2(w, HEIGHT),
      p2: vec2(w, HEIGHT/1.2 - 180*Math.sin(w/75)),
      width: 3,
      color: rgb(255, 0, 0)
    })
  }
}

/*let tPoints = []

export const drawTerrain = () => {
  if (tPoints.length == 0){
    tPoints.push(vec2(0))
    for (let w = 0; w < WIDTH; w += 3){
      tPoints.push(vec2(w,-HEIGHT/2 - 180*Math.sin(w/75)))
    }
    tPoints.push(vec2(WIDTH,0))
  }
  drawPolygon({
    pts: tPoints,
    fill: true,
    pos: vec2(0, HEIGHT)
  })
}*/ //fill component for this method seems to function unexpectedly so discontinued

export const tCollision = () => {
  for (let w = 0; w < WIDTH; w += 16){
    add([
      pos(w, HEIGHT/1.2 - 180*Math.sin(w/75)),
      rect(8,15),
      area(),
      color(255,255,0),
      anchor("top"),
      opacity(0),
      "ground"
    ])
  }
}