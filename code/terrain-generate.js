import {WIDTH, HEIGHT} from "./main.js"

export const Terrain = {
  points: [],
  seedTerrain: function () {
    //generate random amplitudes every n pixels across width
    //interpolate linearly between points
    //return the array of points for drawTerrain
    for (let w = 0; w < WIDTH; w++){
      this.points[w] = Math.floor(Math.random() * 1080);
    }
  },
  interpolateLinear: function (array) {
    //return interpolatedArray;
  }
}

export const drawTerrain = () => {
  for (let point = 0; point < WIDTH; point += 3) {
    drawLine({
      p1: vec2(point, HEIGHT),
      p2: vec2(point, HEIGHT - Terrain.points[point]),
      width: 3,
      color: rgb(250, 50, 50)
    })
  }
}

/*
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
} forget about this feature until we can get randomized terrain drawn*/