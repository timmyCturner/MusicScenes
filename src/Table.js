import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three';

export function Table(props) {
  const emit = useRef();

  // useFrame((state) => {
  //   if(emit){
  //     if(emit.material)
  //       emit.material.emissiveIntensity = speed
  //       //console.log(speed);
  //   }
  // })
  const material1 = new THREE.MeshPhongMaterial({  color: 0x59bccd, emissive:0x328a99, transparent: 0.5,emissiveIntensity:0.15, name: "Emit" })
  const { nodes, materials } = useGLTF('/Table.glb')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Cube.geometry} material={materials.Silver} scale={0.819} />
      <mesh ref={emit} geometry={nodes.Cube001.geometry} material={material1} scale={0.819} />
    </group>
  )
}

useGLTF.preload('/Table-transformed.glb')
