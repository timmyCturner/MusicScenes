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
function calculateEquidistantPoints(clock,radius, fixedPoint, movingPoint) {

  const pointA = movingPoint;
  const pointB = movingPoint;
  const pointC = movingPoint;
  const spinA = -5*Math.sin(clock.elapsedTime)
  const spinB = -5*Math.cos(clock.elapsedTime)
  return [
    new THREE.Vector3(-1*pointA[0]-spinA,-1*pointA[1]-spinB,-1*pointA[2]),
    new THREE.Vector3(pointA[0]+spinA,pointA[1]+spinB,pointA[2])
  ]
}





export function GhostB(props, width = 0.5, opacity = 0.25) {


  let nextPosition;
  let targetPosition;



  const group = useRef();
  const melody = useRef(0);
  const material = useRef();
  //const materialRed = useRef();

  const { nodes, materials } = useGLTF(
    '/CapeB.glb'
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


  useFrame((state) => {
    if(melody.current){
      material.current.uniforms.lineWidth.value=mapRange(melody.current, 0.1, 0.4, 0.01, 0.75, true);
      material.current.uniforms.opacity.value=mapRange(melody.current, 0.1, 0.4, 0.01, 0.75, true);

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

        [nextPosition1, nextPosition2, nextPosition3]= calculateEquidistantPoints(state.clock,props.radius, [0,0.001,0], [group.current.position.x,group.current.position.y,group.current.position.z]);
        // nextPosition2=nextPosition1
        // nextPosition3=nextPosition1
      }
      else if (props.sphereType==1){

        target = nextPosition1

      }
      if (props.sphereType==2){

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


        group.current.lookAt(target);
        line.current.advance(nextPosition);




      }

      nextPosition = target;
      //console.log(target);
    }


  });

  //console.log(nodes,materials);
  const material1 = new THREE.MeshPhongMaterial({  color: 0xc70000, emissive:0xc70000, transparent: 1, name: "Emit" }) //new THREE.MeshStandardMaterial({ color: 0xdddddd, opacity:0})
  //console.log(material1);


  return (
    <>
    <group ref={group}  {...props} dispose={null} scale={3} >
      <group rotation={[Math.PI/2,0,0]}>
        <mesh geometry={nodes.Floating_Cape_1.geometry} material={materials.Material001} scale={[0.670, 0.670, 1.205]} />
        <mesh scale =  {0.075} position = {[0,1.55,0.2]} >
          <sphereGeometry />
          <meshPhongMaterial color= {0xc70000} emissive={0xc70000} emissiveIntensity = {5} transparent={1} name={"Emit"} />
        </mesh>
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
  '/CapeB.glb'
  // 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/low-poly-spaceship/model.gltf'
);
