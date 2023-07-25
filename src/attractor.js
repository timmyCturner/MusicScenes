import * as THREE from 'three';
import Random from 'canvas-sketch-util/random';

export function createAttractor(length, start) {
  const positions = [];

  const p = start ? start : Random.onSphere(1);
  for (let i = 0; i < length; i++) {
    positions.push(new THREE.Vector3().fromArray(p));
  }

  const currentPosition = new THREE.Vector3().fromArray(p);

  return [positions, currentPosition];
}

export function updateAttractor(currentPosition, scale, simulation, timeStep) {
  const [dx, dy, dz] = simulation(currentPosition.toArray(), timeStep);

  currentPosition.add(new THREE.Vector3(dx, dy, dz));

  const normalizedPosition = currentPosition
    .clone()
    .normalize()
    .multiplyScalar(scale);

  return normalizedPosition;
}

/**
 * Different attractor types
 */

 export function upDownAttractor([x, y, z], timestep) {
   const a = 3;
   const b = 2.7;
   const c = 1.7;
   const d = 2;
   const e = 9;

   const dx = 0;
   const dy = (c * y - x * z + z) * timestep;
   const dz = 0;

   return [dx, dy, dz];
 }


export function dadrasAttractor([x, y, z], timestep) {
  const a = 3;
  const b = 2.7;
  const c = 1.7;
  const d = 2;
  const e = 9;

  const dx = (y - a * x + b * y * z) * timestep;
  const dy = (c * y - x * z + z) * timestep;
  const dz = (d * x * y - e * z) * timestep;

  return [dx, dy, dz];
}
export function halversonAttractor([x, y, z], timestep) {
    const a = 1.89;


    const dx = (-(a*x)-(4*y)-(4*z)-(y*y))* timestep;
    const dy = (-(a*y)-(4*z)-(4*x)-(z*z))* timestep;
    const dz = (-(a*z)-(4*x)-(4*y)-(x*x))* timestep;


    return [dx, dy, dz];
  }

export function rosslerAttractor([x, y, z], timestep) {
    // const a = 0.2;
    // const b = 1;
    // const c = 5.7;
    const a = 0.25;
    const b = 0.2;
    const c = 5.7;
    const dx = (-(y+z))* timestep*5;
    const dy = (x + a * y)* timestep*5;
    const dz = (b + (z * (x - c)))* timestep*5;


    return [dx, dy, dz];
  }

  // export function choasUnified3([x, y, z], timestep){
  //   const a = 32.48;
  //   const b = 45.84;
  //   const c = 1.18;
  //   const d = 0.13;
  //   const e = 0.57;
  //   const f = 14.7;
  //
  //   const dx = (a*(y-x)+(d*x*z))* timestep;
  //   const dy = ((b*x)-(x*z)+(f*y))* timestep;
  //   const dz = ((c*z)+(x*y)-(e*x*x))* timestep;
  //
  //
  //   return [dx, dy, dz];
  //
  //
  //
  // }

export function aizawaAttractor([x, y, z], timestep) {
  const a = 0.95;
  const b = 0.7;
  const c = 0.6;
  const d = 3.5;
  const e = 0.25;
  const f = 0.1;

  const dx = ((z - b) * x - d * y) * timestep;
  const dy = (d * x + (z - b) * y) * timestep;
  const dz =
    (c + a * z - (z * z * z) / 3 - x * x + f * z * (x * x * x)) * timestep;

  return [dx, dy, dz];
}

export function arneodoAttractor([x, y, z], timestep) {
  const a = -5.5;
  const b = 3.5;
  const d = -1;

  const dx = y * timestep;
  const dy = z * timestep;
  const dz = (-a * x - b * y - z + d * Math.pow(x, 3)) * timestep;

  return [dx, dy, dz];
}

export function dequanAttractor([x, y, z], timestep) {
  const a = 40.0;
  const b = 1.833;
  const c = 0.16;
  const d = 0.65;
  const e = 55.0;
  const f = 20.0;

  const dx = (a * (y - x) + c * x * z) * timestep;
  const dy = (e * x + f * y - x * z) * timestep;
  const dz = (b * z + x * y - d * x * x) * timestep;

  return [dx, dy, dz];
}

export function lorenzAttractor([x, y, z], timestep) {
  const beta = 8 / 3;
  const rho = 28;
  const sigma = 10;

  const dx = sigma * (y - x) * timestep;
  const dy = (x * (rho - z) - y) * timestep;
  const dz = (x * y - beta * z) * timestep;

  return [dx, dy, dz];
}


export function lorenzMod2Attractor([x, y, z], timestep) {
  const a = 0.9;
  const b = 5.0;
  const c = 9.9;
  const d = 1.0;

  const dx = (-a * x + y * y - z * z + a * c) * timestep;
  const dy = (x * (y - b * z) + d) * timestep;
  const dz = (-z + x * (b * y + z)) * timestep;

  return [dx, dy, dz];
}
