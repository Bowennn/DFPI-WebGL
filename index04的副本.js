const regl = require('regl')()

const glm = require('gl-matrix')
var mat4 = glm.mat4
var projectionMatrix = mat4.create()

var fov = 35 * Math.PI/180 //field of view
var aspect = window.innerWidth / window.innerHeight
mat4.perspective(projectionMatrix, fov, aspect, 0.01, 1000.0)

var viewMatrix = mat4.create()
mat4.lookAt(viewMatrix, [0,0,5], [0,0,0], [0,1,0])

var mouseX = 0
var mouseY = 0

window.addEventListener('mousemove', function(e){
  // console.log('Mouse move', e.clientX, e.clientY)


  var percentX = e.clientX / window.innerWidth //0~1
  var percentY = e.clientY / window.innerHeight //0~1

  percentX = percentX * 2 - 1 //-1~1
  percentY = percentY * 2 - 1 //-1~1

  var moveRange = 100
  mouseX = -percentX * moveRange
  mouseY = percentY * moveRange

  // console.log(percentX, percentY)
})



var currTime = 0


var r = 0.5
var points = [
  [-r, r, 0],
  [r, r, 0],
  [r, -r,0],

  [-r, r, 0],
  [r, -r, 0],
  [-r, -r,0]
]

var colors = [
  [240/255, 128/255, 128/255],
  [230/255, 195/255, 195/255],
  [230/255, 195/255, 195/255],
  [230/255, 195/255, 195/255],
  [240/255, 128/255, 128/255],
  [230/255, 195/255, 195/255]
]

var uvs = [
  [0,0],
  [1,0],
  [1,1],

  [0,0],
  [1,1],
  [0,1],
]


var attributes = {
  position: regl.buffer(points),
  aColor: regl.buffer(colors),
  aUV: regl.buffer(uvs)
}

var uniform = {
  uTime: regl.prop('objTime'),
  uProjectionMatrix: projectionMatrix,
  uViewMatrix: regl.prop('view'),
  uTranslate: regl.prop('translate')
}

var vertexShader = `
precision mediump float;
attribute vec3 position;
attribute vec3 aColor;
attribute vec2 aUV;

uniform float uTime;
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform vec3 uTranslate;

varying vec3 vColor;
varying vec2 vUV;

void main(){
  //creat holder for position
  vec3 pos = position + uTranslate;

  float scale = 0.4;
  float z = sin(uTranslate.x * scale + uTranslate.y * scale + uTime * 5.0);
  pos.z += z * 1.5;


  gl_Position= uProjectionMatrix * uViewMatrix * vec4(pos, 1.0);
  vColor = aColor;
  vUV = aUV;
}
`

var fragShader = `
precision mediump float;  //quality of rendering

uniform vec3 uTranslate;
varying vec3 vColor;
varying vec2 vUV;

void main(){
  vec2 center = vec2(0.5, 0.5);
  float d = distance(vUV, center);

  vec4 colorBg = vec4(1.0, 1.0, 1.0, 0.0);
  vec4 colorDot = vec4(1.0, 0.0, 0.0, 0.2);



  float gradient = smoothstep(0.48, 0.5, d);
  //gradient: 0 ~ 1

  vec4 color = mix(colorDot, colorBg, gradient);
  //gl_FragColor = vec4(color);

  float alpha = 1.0 - gradient;
  alpha *= 0.2;
  gl_FragColor = vec4((uTranslate/5.0) * .5 + .5, alpha);
}
`

console.log('Attribute:', attributes)

const drawTriangle = regl (
  {
  attributes: attributes,
  frag: fragShader,
  vert: vertexShader,
  uniforms: uniform,

  depth:{
    enable: false
  },

  blend: {
  enable: true,
  func: {
    srcRGB: 'src alpha',
    srcAlpha: 'src alpha',
    dstRGB: 'one minus src alpha',
    dstAlpha: 'one minus src alpha',
  },
},

  count: 6
}
)

function clear (){
  regl.clear({
    color: [0, 0, 0, 1]
  })
}

let trace = true

function render () {
  currTime += 0.01
  // var cameraRadius = 1.0
  // var cameraX = Math.sin(currTime) * cameraRadius
  // var  cameraZ = Math.cos(currTime) * cameraRadius

  mat4.lookAt(viewMatrix, [mouseX, mouseY, 65], [0,0,0], [0,1,0])

  clear()

var num = 30
var start = -num /2

for(var k = 0; k < 1; k++) {
  for (var j = 0; j <num; j++){
  for (var i = 0; i < num; i++){
    var obj = {
      objTime: currTime,
      view: viewMatrix,
      translate: [start + j,
        start + i,
        0
      ]
    }
if (trace){
  console.log(obj.translate[0], obj.translate[1])
}
    drawTriangle(obj)
  }}
}

  //console.log ('render')
  //console.log('uTime:', currTime, obj)
  trace = false
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
