import * as THREE from 'three';
import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { lerp, mapRange } from 'canvas-sketch-util/math';
import { useMusicStore } from './useMusicStore';

import {
  createAttractor,
  updateAttractor,
  lorenzMod2Attractor,
  halversonAttractor
} from './attractor';

let nextPosition1;
let nextPosition2;
let nextPosition3;
//const RADIUS = 20;
//all items in scene that share nextPosition look at same target, useful for other Scenes
//let nextPosition;
function calculateEquidistantPoints(radius, fixedPoint, movingPoint) {
  // Calculate vector CP
const CP = fixedPoint;

// Normalize vector CP
const uCP = normalizeVector(CP);

// Calculate vector CM
const CM = movingPoint;

// Normalize vector CM
const uCM = normalizeVector(CM);

// Calculate cross product of uCP and uCM
const n = crossProduct(uCP, uCM);

// Normalize vector n
const un = normalizeVector(n);

// Calculate the angle between uCP and uCM
const theta = Math.acos(dotProduct(uCP, uCM));

// Calculate the positions of the other two equidistant points
const angleIncrement = (2 * Math.PI) / 3;
const pointA = calculatePosition(radius, theta, uCP, un);
const pointB = calculatePosition(radius, theta + angleIncrement, uCP, un);
const pointC = calculatePosition(radius, theta + 2 * angleIncrement, uCP, un);

  return [new THREE.Vector3(pointA[0],pointA[1],pointA[2]), new THREE.Vector3(pointB[0],pointB[1],pointB[2]) , new THREE.Vector3(pointC[0],pointC[1],pointC[2])];
}

// Helper function to normalize a vector
function normalizeVector(vector) {
  const magnitude = Math.sqrt(
    vector[0] * vector[0] +
    vector[1] * vector[1] +
    vector[2] * vector[2]
  );
  return [
    vector[0] / magnitude,
    vector[1] / magnitude,
    vector[2] / magnitude
  ];
}

// Helper function to calculate the cross product of two vectors
function crossProduct(vector1, vector2) {
  return [
    vector1[1] * vector2[2] - vector1[2] * vector2[1],
    vector1[2] * vector2[0] - vector1[0] * vector2[2],
    vector1[0] * vector2[1] - vector1[1] * vector2[0]
  ];
}

// Helper function to calculate the dot product of two vectors
function dotProduct(vector1, vector2) {
  return (
    vector1[0] * vector2[0] +
    vector1[1] * vector2[1] +
    vector1[2] * vector2[2]
  );
}

// Helper function to calculate the position of an equidistant point
function calculatePosition(radius, angle, uCP, un) {
  const cosTheta = Math.cos(angle);
  const sinTheta = Math.sin(angle);

  const x = radius * (cosTheta * uCP[0] + sinTheta * un[0]);
  const y = radius * (cosTheta * uCP[1] + sinTheta * un[1]);
  const z = radius * (cosTheta * uCP[2] + sinTheta * un[2]);

  return [x, y, z];
}


// function getStepToTarget(start, target, speed) {
//   let dx = target.x - start.x;
//   let dy = target.y - start.y;
//   let dz = target.z - start.z;
//
//   return new THREE.Vector3(dx,dy,dz).normalize().multiplyScalar(speed);
// }

export function EyeOrb(props, width = 0.5, opacity = 0.25) {

  // const radius = 1;
  // const fixedPoint = [1, 0, 0];
  // const movingPoint = [0, 1, 0];
  //
  // const equidistantPoints = calculateEquidistantPoints(radius, fixedPoint, movingPoint);
  // console.log(equidistantPoints);

  let nextPosition;
  let targetPosition;
  //let targetStep;
  // let isFired = false;
  // let inProgress= false;


  const group = useRef();
  const melody = useRef(0);
  const material = useRef();
  //const materialRed = useRef();

  const { nodes, materials } = useGLTF(
    '/eyeOrb.glb'
    // 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/low-poly-spaceship/model.gltf'
  );

  const line = useRef(0);
  //const laser = useRef(0);

  const [positions, currentPosition] = useMemo(
    () => createAttractor(30, [0, props.radius, 0]),
    []
  );

  //let targetPositions = positions
  useEffect(()=>
    useMusicStore.subscribe(
      (value) => {
        melody.current = value;
      },
      (state) => state.melody
    ),[]
  )


  useFrame(() => {
    if(melody.current){
      material.current.uniforms.lineWidth.value=mapRange(melody.current, 0.1, 0.4, 0.01, 0.75, true);
      material.current.uniforms.opacity.value=mapRange(melody.current, 0.1, 0.4, 0.01, 0.75, true);
      //materialRed.current.material.emissiveIntensity=mapRange(melody.current, 0.1, 0.4, 0.5, 10, true);
      //console.log(materialRed);
      //console.log(mapRange(melody.current, 0.1, 0.4, 0.5, 2, true),speed);
    }

    if (line.current) {
      let target;
      if (props.sphereType==0){
        target = updateAttractor(
          currentPosition,
          props.radius,
          lorenzMod2Attractor,
          0.002
        );

        [nextPosition1,nextPosition2,nextPosition3] = calculateEquidistantPoints(props.radius, [0,0.001,0], [group.current.position.x,group.current.position.y,group.current.position.z]);
      }
      else if (props.sphereType==1){

        target = nextPosition1

      }
      else if (props.sphereType==2){

        target = nextPosition2
        //console.log('target');
      }
      else if (props.sphereType==3){

        target = nextPosition3
        //console.log('target');
      }

      if (nextPosition) {
        //console.log(props.sphereType);
        //console.log(nextPosition);
        group.current.position.copy(
          nextPosition.clone().add(new THREE.Vector3(0, 0, 0))
        );

        // if (!isNaN(target.y)){
        //   if(!isFired){
        //     //fire laser
        //     targetStep = getStepToTarget(group.current.position, target, 5)
        //     //console.log(nextPosition);
        //     if(targetStep.x!=0&&targetStep.y!=0&&targetStep.z!=0&&!isNaN(targetStep.x)&&!isNaN(targetStep.y)&&!isNaN(targetStep.z)){
        //       isFired = true
        //       targetPosition=nextPosition.clone().add(new THREE.Vector3(0, 0, 0))
        //     }
        //     opacity = 0.75
        //   }
        //   else{
        //     if (!inProgress){
        //       if(Math.floor(Math.random() * 100)==40){
        //
        //         //console.log(laser.current.points);
        //         opacity = 0
        //
        //         setTimeout(()=>{isFired = false;inProgress = false}, 5000);
        //         targetPositions = [new THREE.Vector3(targetPosition.x,targetPosition.y,targetPosition.z)]
        //         //laser.current.position = targetPositions
        //         inProgress = true
        //         opacity = 0
        //       }
        //
        //     }
        //     targetPosition = new THREE.Vector3(targetPosition.x+targetStep.x,targetPosition.y+5+targetStep.y,targetPosition.z+targetStep.z)
        //     laser.current.advance(targetPosition);
        //   }
        //   target.y+=5
        //   //console.log(target,nextPosition);
        //   group.current.lookAt(target);
        //
        // }
        group.current.lookAt(target);
        line.current.advance(nextPosition);




      }

      nextPosition = target;
      //console.log(target);
    }

    //console.log(width,opacity);
  });

  //new THREE.MeshPhongMaterial({ ambient: 0x030303, color: 0xdddddd, specular: 0x009900, shininess: 30 })
  const material1 = new THREE.MeshPhongMaterial({  color: 0xc70000, emissive:0xc70000, transparent: 1, name: "Emit" }) //new THREE.MeshStandardMaterial({ color: 0xdddddd, opacity:0})
  const material2 =  new THREE.MeshPhongMaterial({  color: 0xa7c700, emissive:0xa7c700, transparent: 1, name: "Emit" })
  // console.log(material1);
  //console.log(nodes);
  // console.log(materials);

  return (
    <>
    <group ref={group}  {...props} dispose={null}>
      <mesh geometry={nodes.Cylinder.geometry} material={materials.Material001} position={[0.278, 0, 0.005]} rotation={[0, -Math.PI / 2, 0]} scale={[1.165, 0.047, 1.165]} />
      <group position={[0.278, 0, 0.005]} rotation={[0,0, 0]} scale={0.891}>
        <mesh geometry={nodes.Sphere_1.geometry} material={material2} />
        <mesh geometry={nodes.Sphere_2.geometry} material={materials.RedEmissive} />
        <mesh geometry={nodes.Sphere_3.geometry} material={materials.Material003} />
      </group>
    </group>

      <mesh>
        <meshLine ref={line} attach="geometry" points={positions} />
        <meshLineMaterial
          ref = {material}
          attach="material"
          lineWidth={0.5}
          color="#FCEEB5"
          transparent
          opacity={0.25}

        />
      </mesh>
    </>
  );
}

useGLTF.preload(
  '/eyeOrb.glb'
  // 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/low-poly-spaceship/model.gltf'
);


// <mesh>
//   <meshLine  ref={laser} attach="geometry"  points={targetPositions}/>
//   <meshLineMaterial
//     attach="material"
//     lineWidth={0.25}
//     color="#FF0000"
//     transparent
//     opacity={opacity}
//   />
// </mesh>
