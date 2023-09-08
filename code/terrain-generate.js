import {WIDTH, HEIGHT} from "./main.js"

let points = seedTerrain();
interpolateLinear(points);

const seedTerrain = () => {
  //generate random amplitudes every n pixels across width
  //interpolate linearly between points
  //return the array of points for drawTerrain
}

const interpolateLinear = (array) => {
  return interpolatedArray;
}

export const drawTerrain = () => {
  
  for (let point = 0; point < )
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