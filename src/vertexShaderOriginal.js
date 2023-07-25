const vertexShader = `
uniform float u_time;
uniform float uRadius;
uniform float u_music;
uniform float u_distort;
varying float vDistance;

// Source: https://github.com/dmnsgn/glsl-rotate/blob/main/rotation-3d-y.glsl.js
mat3 rotation3dY(float angle) {
  float musicScale = pow((2.0*(2.0+u_music)), 2.0)/30.0;
  float s = musicScale*sin(angle)/2.0;
  float c = musicScale*cos(angle)/2.0;
  return mat3(
    c, 0.0, -s,
    0.0, 0.1, 0.0,
    s, 0.0, c
  );
}


void main() {
  float distanceFactor = pow(uRadius - distance(position, vec3(0.0)), 1.5);
  float size = distanceFactor * 0.5 + 8.0;
  vec3 particlePosition = position * rotation3dY(u_time * 0.3 * distanceFactor);

  vDistance = distanceFactor;

  vec4 modelPosition = modelMatrix * vec4(particlePosition, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  gl_PointSize = size;
  // Size attenuation;

  gl_PointSize *= size*(1.0 / - viewPosition.z);
}

`

export default vertexShader
