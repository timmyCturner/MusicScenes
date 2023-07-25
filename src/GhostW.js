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
let nextPosition4;
//const RADIUS = 20;
//all items in scene that share nextPosition look at same target, useful for other Scenes
//let nextPosition;
function calculateEquidistantPoints(clock,radius, fixedPoint, movingPoint) {

  const pointA = movingPoint;
  const pointB = movingPoint;
  const pointC = movingPoint;
  const spinA = 5*Math.sin(clock.elapsedTime)
  const spinB = 5*Math.cos(clock.elapsedTime)
  return [
    new THREE.Vector3(pointA[0]-spinA, pointA[1]-spinB, pointA[2]),
    new THREE.Vector3(-1*pointA[0]-spinA,-1*pointA[1]-spinB,-1*pointA[2]),
    new THREE.Vector3(-1*pointA[0]+spinA,-1*pointA[1]+spinB,-1*pointA[2]),
    new THREE.Vector3(pointA[0]+spinA, pointA[1]+spinB,pointA[2])
  ]
}





export function GhostW(props, width = 0.5, opacity = 0.25) {


  let nextPosition;
  let targetPosition;



  const group = useRef();
  const melody = useRef(0);
  const material = useRef();
  //const materialRed = useRef();

  const { nodes, materials } = useGLTF(
    '/CapeW.glb'
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
        if (props.sphereType!=0){
          material.current.uniforms.lineWidth.value=mapRange(melody.current, 0.1, 0.4, 0.01, 0.75, true);
          material.current.uniforms.opacity.value=mapRange(melody.current, 0.1, 0.4, 0.01, 0.75, true);
        }

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

        [nextPosition4, nextPosition1, nextPosition2, nextPosition3]= calculateEquidistantPoints(state.clock,props.radius, [0,0.001,0], [group.current.position.x,group.current.position.y,group.current.position.z]);

        // nextPosition2=nextPosition1
        // nextPosition3=nextPosition1
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
      else if (props.sphereType==4){

        target = nextPosition4
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
      if (props.sphereType==0){

      }
      //console.log(target);
    }


  });

  //console.log(nodes,materials);
  let data;
  if( props.sphereType!=0){
    data = ShowAttractor(group,props,line,positions,material)
  }
  else{
    data = HideAttractor(group,line,positions)
  }
  //console.log(material1);
  //console.log(data);

  return (
    <>
      {data}
    </>
  );
}

function HideAttractor(group,line,positions){
  return (
    <>
    <group ref={group}  dispose={null} scale={3} >

    </group>

      <mesh>
        <meshLine ref={line} attach="geometry" points={positions} />
        <meshLineMaterial

          attach="material"
          lineWidth={0}
          color="#000"
          transparent
          opacity={0}

        />
      </mesh>
    </>
  );
}
function ShowAttractor(group,props,line,positions,material) {


  let data = GhostWhite()

  if( props.sphereType==2 || props.sphereType==3){
    data = GhostBlack()
  }
  //console.log(data);
  return (
    <>
    <group ref={group}  {...props} dispose={null} scale={3} >
      {data}
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
          dashRatio={0.5}
        />
      </mesh>
    </>
  );
}

function GhostWhite() {
  const { nodes, materials } = useGLTF(
    '/CapeW.glb'
    // 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/low-poly-spaceship/model.gltf'
  );
  return(
    <>
      <group rotation={[Math.PI/4,-Math.PI/4,0]}>
        <mesh geometry={nodes.Floating_Cape_2.geometry} material={materials.Cloth001} scale={[0.670, 0.670, 1.205]} />

      </group>
    </>
  )

}
function GhostBlack() {
  const { nodes, materials } = useGLTF(
    '/CapeB.glb'
    // 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/low-poly-spaceship/model.gltf'
  );
  return(
    <>
      <group rotation={[Math.PI/4,Math.PI/4,0]}>
        <mesh geometry={nodes.Floating_Cape_1.geometry} material={materials.Material001} scale={[0.808, 0.808, 1.454]} />

      </group>
    </>
  )
}
useGLTF.preload(
  '/CapeW.glb'
  // 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/low-poly-spaceship/model.gltf'
);
