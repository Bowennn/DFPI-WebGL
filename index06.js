const regl = require('regl')()
const strVertex = require('./Shaders/shaderVertex.js')
const strFrag = require('./Shaders/shaderFrag.js')
//console.log('strVertex', strVertex)
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
var aPosition = [
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
  position: regl.buffer(aPosition),
  aColor: regl.buffer(colors),
  aUV: regl.buffer(uvs)
}

var uniform = {
  uTime: regl.prop('objTime'),
  uProjectionMatrix: projectionMatrix,
  uViewMatrix: regl.prop('view'),
  uTranslate: regl.prop('translate')
}



console.log('Attribute:', attributes)

const drawTriangle = regl (
  {
  attributes: attributes,
  frag: strFrag,
  vert: strVertex,
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
