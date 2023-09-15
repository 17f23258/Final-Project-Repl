import {WIDTH, HEIGHT} from "./main.js"

const Terrain = {
  points: [],
  rndRes: 192,
  variance: 750,
  minY: 100,
  seedTerrain: function () {
    //generate random amplitudes every n pixels across width

    for (let w = 0; w <= WIDTH; w += this.rndRes){
      this.points[w] = Math.floor(Math.random() * this.variance + this.minY);
    }
  },
  interpolateLinear: function () {
    //use this.rndRes and difference between each point to interpolate

    for (let point = 0; point < this.points.length; point += this.rndRes) {
      let current = this.points[point];
      let next = this.points[point + this.rndRes];
      let dy = next - current;
      for (let p = point; p < point + this.rndRes; p++) {
        this.points[p] = (p - point) * dy / this.rndRes + current;
      }
    }
  },
  tCollision: function () {
    for (let point = 0; point < this.points.length; point += 20){
      add([
        pos(point, HEIGHT - this.points[point]),
        rect(8,35),
        area(),
        //color(255,255,0),
        anchor("top"),
        opacity(0),
        "ground"
      ])
    }
  }, 
  drawTerrain: function () {
    for (let point = 0; point < WIDTH; point += 3) {
      drawLine({
        p1: vec2(point + 2, HEIGHT),
        p2: vec2(point + 2, HEIGHT - Terrain.points[point]),
        width: 3,
        color: rgb(181, 4, 21)
      })
    }/*
    drawLine({
      p1: vec2(0, HEIGHT - this.minY),
      p2: vec2(WIDTH, HEIGHT - this.minY),
      width: 4,
      color: rgb(20, 10, 180)
    })
    drawLine({
      p1: vec2(0, HEIGHT - (this.minY + this.variance)),
      p2: vec2(WIDTH, HEIGHT - (this.minY + this.variance)),
      width: 4,
      color: rgb(20, 10, 180)
    })debugging to show the maximum and minimum possible terrain heights*/
  }

}

export default Terrain;