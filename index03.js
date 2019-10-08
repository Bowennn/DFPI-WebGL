const regl = require('regl')()

const glm = require('gl-matrix')
var mat4 = glm.mat4
var projectionMatrix = mat4.create()

var fov = 45 * Math.PI/180 //field of view
var aspect = window.innerWidth / window.innerHeight
mat4.perspective(projectionMatrix, fov, aspect, 0.01, 1000.0)

var viewMatrix = mat4.create()
mat4.lookAt(viewMatrix, [0,0,5], [0,0,0], [0,1,0])

var currTime = 0


var r = 0.1
var points = [
  [-r, -r, 0],
  [r, -r, 0],
  [-r, r,0],
  [r, -r, 0],
  [r, r, 0],
  [-r, r,0]


]

var colors = [
  [240/255, 128/255, 128/255],
  [230/255, 195/255, 195/255],
  [230/255, 195/255, 195/255],
  [230/255, 195/255, 195/255],
  [240/255, 128/255, 128/255],
  [230/255, 195/255, 195/255]
]


var attributes = {
  position: regl.buffer(points),
  aColor: regl.buffer(colors)
}

var uniform = {
  uTime: regl.prop('objTime'),
  uProjectionMatrix: projectionMatrix,
  uViewMatrix: regl.prop('view')
}

var vertexShader = `
precision mediump float;
attribute vec3 position;
attribute vec3 aColor;

uniform float uTime;
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;

varying vec3 vColor;

void main(){
  //creat holder for position
  vec3 pos = vec3(position);

  float movingRange = 0.0;
  pos.x += sin(uTime) * movingRange;
  pos.y += cos(uTime) * movingRange;

  float scale = sin(uTime) * 0.5 + 0.5;
  pos.xy *= scale;

  gl_Position= uProjectionMatrix * uViewMatrix * vec4(pos, 1.0);
  vColor = aColor;
}
`

var fragShader = `
precision mediump float;

varying vec3 vColor;

void main(){
  gl_FragColor = vec4(vColor, 1.0);
}
`

console.log('Attribute:', attributes)

const drawTriangle = regl (
  {
  attributes: attributes,
  frag: fragShader,
  vert: vertexShader,
  uniforms: uniform,
  count: 6
}
)

function clear (){
  regl.clear({
    color: [253/255, 249/255, 238/255, 1]
  })
}

function render () {
  currTime += 0.01
  var cameraRadius = 1.0
  var cameraX = Math.sin(currTime) * cameraRadius,
      cameraZ = Math.cos(currTime) * cameraRadius

  mat4.lookAt(viewMatrix, [cameraX, 0, cameraZ], [0,0,0], [0,1,0])

  var obj = {
    objTime: currTime,
    view: viewMatrix
  }

  console.log ('render')
  console.log('uTime:', currTime, obj)

  clear()
  drawTriangle(obj)
  window.requestAnimationFrame(render)
}

render()
//console.log('start ksldkasdko')

/*var ary = []
ary.push(1)
ary.push(2)
ary.push(3)
ary.push(4)
ary.push(5) //push means add element
console.log(ary)

var popValue = ary.pop() //pop means clear the element
// ary.shift()
console.log('Pop value :', popValue)
console.log('New arry:', )
*/
