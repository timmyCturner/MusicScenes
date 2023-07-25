/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.3 robotBody.glb --transform
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function Model(props) {
  const { nodes, materials } = useGLTF('/robotBody-transformed.glb')
  return (
    <group {...props} dispose={null}>
      <group position={[-1.93, 0, 0]} rotation={[0, 0, -Math.PI]} scale={4}>
        <mesh geometry={nodes.Solid003.geometry} material={materials.RedEmissive} />
        <mesh geometry={nodes.Solid003_1.geometry} material={materials.Blue} />
        <mesh geometry={nodes.Solid003_2.geometry} material={materials.EmissiveSilver} />
        <mesh geometry={nodes.Solid003_3.geometry} material={materials.Silver} />
      </group>
    </group>
  )
}

useGLTF.preload('/robotBody-transformed.glb')