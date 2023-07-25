import * as THREE from 'three';
import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
// import {
//   createAttractor,
//   updateAttractor,
//   lorenzMod2Attractor,
// } from './attractor';

const RADIUS = 20;
let nextPosition;

export function MainBody(props) {
  const group = useRef();

  const { nodes, materials } = useGLTF(
    '/robotBody.glb'
    // 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/low-poly-spaceship/model.gltf'
  );


  // const line = useRef(0);

  // const [positions, currentPosition] = useMemo(
  //   () => createAttractor(30, [0, RADIUS, 0]),
  //   []
  // );

  // useFrame(() => {
  //   if (line.current) {
  //     const target = updateAttractor(
  //       currentPosition,
  //       RADIUS,
  //       lorenzMod2Attractor,
  //       0.002
  //     );
  //
  //     if (nextPosition) {
  //       group.current.position.copy(
  //         nextPosition.clone().add(new THREE.Vector3(0, 0, 0))
  //       );
  //       group.current.lookAt(target);
  //
  //       line.current.advance(nextPosition);
  //     }
  //
  //     nextPosition = target;
  //   }
  //
  //
  // });
  //new THREE.MeshPhongMaterial({ ambient: 0x030303, color: 0xdddddd, specular: 0x009900, shininess: 30 })
  const material1 = new THREE.MeshPhongMaterial({  color: 0x4bf161, emissive:0x4bf161, transparent: 1,emissiveIntensity:.5, name: "Emit" }) //new THREE.MeshStandardMaterial({ color: 0xdddddd, opacity:0})
  const material2 = new THREE.MeshPhongMaterial({  color: 0x4bf1e3, emissive:0x4bf1e3, transparent: 1,emissiveIntensity:.5, name: "Emit" })
  // console.log(material1);
  // console.log(nodes);
  // console.log(materials);


  // <mesh geometry={nodes.Cylinder.geometry} material={materials.Material} />
  // <mesh geometry={nodes.Cylinder001.geometry} material={materials.Material003} />
  // <mesh position={[0,-3.5,0]} scale={[0.9, 20, 0.9]}>
  //   <sphereGeometry args={[1, 60]} />
  //   <meshPhongMaterial attach="material"
  //   transparent
  //   color={0xff8500}
  //   emissive={0xff8500}
  //   emissiveIntensity={1}/>
  // </mesh>
  // <mesh position = {[0,-4,1]} scale ={[.1, 2.5, .1]} geometry={nodes.Sphere003.geometry} material={material1}/>

  // materials.EmissiveSilver.emissiveIntensity=.2
  // materials.Blue.emissiveIntensity=1
  // materials.Blue.emissive=0xffffff

  return (
    <>



      <group  {...props} dispose={null}>
        <group position={[-1.93, 0, 0]} rotation={[0, 0, -Math.PI]} scale={4}>
          <mesh geometry={nodes.Solid003.geometry} material={material1} />
          <mesh geometry={nodes.Solid003_1.geometry} material={material2} />
          <mesh geometry={nodes.Solid003_2.geometry} material={materials.EmissiveSilver} />
          <mesh geometry={nodes.Solid003_3.geometry} material={materials.Silver} />
        </group>
      </group>





    </>
  );
}

useGLTF.preload(
  '/robotBody.glb'
  // 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/low-poly-spaceship/model.gltf'
);
