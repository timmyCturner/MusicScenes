import * as THREE from 'three';
import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { lerp, mapRange } from 'canvas-sketch-util/math';
import { useMusicStore } from './useMusicStore';
import Random from 'canvas-sketch-util/random';

import {
  createAttractor,
  updateAttractor,
  lorenzMod2Attractor,
  lorenzAttractor,
  aizawaAttractor,

} from './attractor';

let nextPosition1;
let nextPosition2;
let nextPosition3;

function calculateEquidistantPoints(radius, fixedPoint, movingPoint) {

  const pointA = movingPoint;
  const pointB = movingPoint;
  const pointC = movingPoint;
  
  return new THREE.Vector3(-1*pointA[0],-1*pointA[1],-1*pointA[2])
}

export function Ghost(props, width = 0.5, opacity = 0.25) {


  let nextPosition;
  let targetPosition;



  const group = useRef();
  const spin = useRef();
  const melody = useRef(0);
  const material = useRef();
  //const materialRed = useRef();

  const { nodes, materials } = useGLTF(
    '/Cape.glb'
    // 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/low-poly-spaceship/model.gltf'
  );

  const line = useRef(0);
  const line1 = useRef(0);
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
          lorenzAttractor,
          0.002
        );

        nextPosition1= calculateEquidistantPoints(props.radius, [0,0.001,0], [group.current.position.x,group.current.position.y,group.current.position.z]);
        nextPosition2=nextPosition1
        nextPosition3=nextPosition1
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


        group.current.lookAt(target);
        line.current.advance(nextPosition);
        line1.current.advance(nextPosition);




      }

      nextPosition = target;
      //console.log(target);

      // if(spin.current){
      //   const off = Random.noise1D(state.clock.elapsedTime, 0.25);
      //   const tOff = mapRange(off, -1, 1, 0, 1);
      //   //const tOff = mapRange(drums.current, -1, 1, 0, 1, true);
      //
      //   //spin.current.rotation.z = lerp(0, 2*Math.PI, tOff);
      // }


    }


  });

  //console.log(materials.Cloth001);
  const material1 = new THREE.MeshPhongMaterial({  color: 0xc70000, emissive:0xc70000, transparent: 1, name: "Emit" }) //new THREE.MeshStandardMaterial({ color: 0xdddddd, opacity:0})


  //console.log(materials);
  return (
    <>



            <group ref={group}  {...props} dispose={null} scale={5}>

                <mesh geometry={nodes.Floating_Cape_1.geometry} material={materials.Material001} position={[1, 0, 0]} rotation={[0, -Math.PI /2, -Math.PI /2 ]} scale={[0.808, 0.808, 1.454]} />

                <mesh geometry={nodes.Floating_Cape_2.geometry} material={materials.Cloth001} position={[-1, 0, 0]} rotation={[0, Math.PI / 2, Math.PI /2]} scale={[0.67, 0.67, 1.205]} />

              </group>


              <group position={[5, 0, 0]}>
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
              </group>
              <group position={[-5, 0, 0]}>
                <mesh>
                  <meshLine ref={line1} attach="geometry" points={positions} />
                  <meshLineMaterial
                    ref = {material}
                    attach="material"
                    lineWidth={0.5}
                    color="#FCEEB5"
                    transparent
                    opacity={0.25}

                  />
                </mesh>
              </group>



    </>
  );
}

useGLTF.preload(
  '/Cape.glb'
  // 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/low-poly-spaceship/model.gltf'
);
