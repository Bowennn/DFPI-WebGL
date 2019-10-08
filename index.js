const regl = require('regl')()

var currTime = 0

console.log('regl', regl)

const points = [
  [0, 0.5, 0],
  [-0.5, -0.5, 0],
  [0.5, -0.5,0]
]

var colors = [
  [123/255, 139/255, 111/255],
  [225/255, 205/255, 207/255],
  [193/255, 203/255, 215/255]
]


var attributes = {
  position: regl.buffer(points),
  aColor: regl.buffer(colors)
}

var uniform = {
  time: regl.prop('time')
}

var vertexShader = `
precision mediump float;
attribute vec3 position;
attribute vec3 aColor;
uniform float time;

varying vec3 vColor;

void main(){
  vec3 pos = position;
  pos.x += sin(time) * 0.5;
  gl_Position= vec4(pos, 1.0);
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
  count: 3
}
)

function clear (){
  regl.clear({
    color: [253/255, 249/255, 238/255, 1]
  })
}

function render () {
  currTime += 0.01;
  const obj = {
    time: currTime
  }

  console.log ('render')
  console.log('Time:', currTime, obj)

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
