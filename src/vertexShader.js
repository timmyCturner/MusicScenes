const vertexShader = `
uniform float u_time;
uniform float uRadius;
uniform float u_music;
uniform float u_distort;
varying float vDistance;

// Source: https://github.com/dmnsgn/glsl-rotate/blob/main/rotation-3d-y.glsl.js
mat3 rotation3dY(float angle) {
  float musicScale = pow((2.0*(2.0+u_music)), 2.0)/10.0;
  float s = musicScale*sin(angle);
  float c = musicScale*cos(angle);
  float t = sin(angle * 2.0)*cos(angle*2.0) + 1.0;
  float dis = pow((2.0*(2.0+u_music)), 2.0)/2.5;
  float zOffset = pow(t, 2.0) * dis;

  return mat3(
    c, 0.0, s,
    0.0, zOffset, 0.0,
    s, 0.0, c
  );
}

void main() {
  float distanceFactor = pow(uRadius - distance(position, vec3(0.0)), 1.0);
  float size = distanceFactor * 5.0 + 10.0;

  vec3 particlePosition = position * rotation3dY(u_time * 0.3 * distanceFactor);

  // Add a check to keep the y-coordinate from going below the starting position
  particlePosition.y = max(particlePosition.y, position.y);

  // Apply a wisp-like effect to the particles
  float wispFactor = sin(u_time * 2.0 + position.x * 0.5) * 0.2;
  particlePosition.y += wispFactor;

  vDistance = distanceFactor;

  vec4 modelPosition = modelMatrix * vec4(particlePosition, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  gl_PointSize = size * 5.0;
  // Size attenuation;
  gl_PointSize *= (1.0 / -viewPosition.z);
}

`

export default vertexShader
