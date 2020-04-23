// one-shot-rendering.js
import "../css/main.css";

// Create a full screen canvas element and a WebGLRenderingContext.
const regl = require("regl")();

const drawTriangle = regl({
  // The vertex shader tells the GPU where to draw the vertices.
  vert: `
  precision mediump float;

  uniform float scale;
  uniform float pointSize;
  attribute vec2 position;
  attribute vec3 color;
  varying vec3 frag_color;  // varying to pass to the fragment shader

  float z = 0.0;
  float w = 1.0;

  void main () {
    frag_color = color;
    gl_PointSize = pointSize;
    gl_Position = vec4(position * scale, z, w);
  }
  `,

  // The fragment shader tells the GPU what color to draw.
  frag: `
    precision mediump float;
  
    varying vec3 frag_color;  // received from the vertex shader
  
    void main () {
      gl_FragColor = vec4(sqrt(frag_color), 1.0);
    }
  `,

  // Now that the shaders are defined, we pass the vertices to the GPU
  attributes: {
    position: [
      [1.0, -0.75],
      [0.0, 0.0],
      [-1.0, -1.0],
    ],
    color: regl.prop("rgbColors"),
  },

  uniforms: {
    // get the prop pointSize and pass it to the shaders
    pointSize: (context, prop) => prop.pointSize,
    // we can also access the props with this shorthand syntax
    scale: regl.prop("scale"),
  },

  // specify the primitive type (the default is 'triangle')
  primitive: "points",
  // and we tell the GPU how many vertices to draw
  count: 3,
});

// In one-shot rendering the command is executed once and immediately.
drawTriangle({
  pointSize: 10.0,
  scale: 0.5,
  rgbColors: [
    [1.0, 0.0, 0.0],
    [0.0, 1.0, 0.0],
    [0.0, 0.0, 1.0],
  ],
});
