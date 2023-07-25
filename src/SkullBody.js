import * as THREE from 'three';
import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations} from '@react-three/drei';
import './materials/SilkyMaterial';
import {Planet} from './Planet';
import {mapRange, lerp } from 'canvas-sketch-util/math';
import Random from 'canvas-sketch-util/random';
import { useMusicStore } from './useMusicStore';

const RADIUS = 20;
let nextPosition;

export function SkullBody({distortionScale}) {
  const group = useRef()
  const jaw = useRef()
  const { nodes, materials, animations } = useGLTF('/SkullBat2.glb')
  const { actions, mixer } = useAnimations(animations, group)

  const vocals = useRef(0);
  const drums = useRef(0);
  useEffect(
    () =>
      useMusicStore.subscribe(
        (value) => {
          vocals.current = value;
        },
        (state) => state.vocals
      ),
    []
  );

  useEffect(
    () =>
      useMusicStore.subscribe(
        (value) => {
          drums.current = value;
        },
        (state) => state.drums
      ),
    []
  );

  useFrame((state) => {
    if (actions && nodes.Bone004 && nodes.Bone005){
      const duration = animations[0].duration;
      let direction = 1;
      Object.entries(actions).forEach(([key, value]) => {

         actions[key].play()
         actions[key].timeScale = 0.25
         actions[key].loop = THREE.LoopPingPong


         const t = Math.cos((actions[key].time/duration*Math.PI*2))
         const r = Math.sin((actions[key].time/duration*Math.PI*4))
         //console.log((actions[key].time/duration));
         group.current.position.y = t
         group.current.position.z = t/3
         group.current.position.x = r/2
         //console.log(actions[key].time/actions[key].timeScale);
         //console.log(actions[key].loop,actions[key].timeScale,actions[key].loopCount);
         const off = Random.noise1D(state.clock.elapsedTime, 0.25);
         const tOff = mapRange(off, -1, 1, 0, 1);
         //const tOff = mapRange(drums.current, -1, 1, 0, 1, true);

        group.current.rotation.x = lerp((-1*Math.PI/16), (Math.PI/16), tOff);
        group.current.rotation.y = lerp((-1*Math.PI/16), (Math.PI/16), tOff);
        group.current.rotation.z = lerp((-1*Math.PI/16), (Math.PI/16), tOff);
    });
      const t = Math.random() * 100;

    if (jaw.current){
        const off = Random.noise1D(state.clock.elapsedTime, 0.25);
        //const tOff = mapRange(off, -1, 1, 0, 1);
        const tOff = -1+(1/mapRange(vocals.current, -1, 1, 0, 1, true));
        jaw.current.rotation.x = lerp((-3*Math.PI/8), (-Math.PI/2), tOff);

      }
    }
  })

  //console.log(nodes);
  const material2 = new THREE.MeshPhongMaterial({  color: 0x4bf1e3, emissive:0x4bf1e3, transparent: 1,emissiveIntensity:.5, name: "Emit" })
  return (
    <group ref={group} dispose={null} scale = {1.5}>
      <group name="Scene">
        <group name="Armature001" position={[0, -4.826, -0.578]} scale={1.103}>
          <primitive object={nodes.Bone004} />
          <skinnedMesh name="body002" geometry={nodes.body002.geometry} material={materials.Rock} skeleton={nodes.body002.skeleton} />
          <skinnedMesh name="membrane002" geometry={nodes.membrane002.geometry} material={materials.Lava} skeleton={nodes.membrane002.skeleton} />

        </group>
        <group name="Armature" position={[0, -2.843, 0.782]} scale={[0.653, 0.757, 0.653]}>
          <primitive object={nodes.Bone005} />
          <skinnedMesh name="body001" geometry={nodes.body001.geometry} material={materials.Rock} skeleton={nodes.body001.skeleton} />
          <skinnedMesh name="membrane" geometry={nodes.membrane.geometry} material={materials.Lava} skeleton={nodes.membrane.skeleton} />

        </group>
        <group ref={jaw} name="Jaw" rotation={[-Math.PI / 2, 0, 0]} scale={[0.031, 0.038, 0.038]}>
          <mesh name="Object_0001" geometry={nodes.Object_0001.geometry} material={materials.Rock} />
          <mesh name="Object_0001_1" geometry={nodes.Object_0001_1.geometry} material={materials.Ruby} />
        </group>

        <Planet distortionScale={distortionScale} eyePosition = {[-0.369, 0.92, 0.85]}/>
        <Planet distortionScale={distortionScale} eyePosition = {[0.403, 0.92, 0.85]}/>

        <group name="Skull001" rotation={[-Math.PI / 2, 0, 0]} scale={0.038}>
          <mesh name="Object_0003" geometry={nodes.Object_0003.geometry} material={materials.Ruby} />
          <mesh name="Object_0003_1" geometry={nodes.Object_0003_1.geometry} material={materials.Rock} />
        </group>



      </group>
    </group>
  )
}

useGLTF.preload('/SkullBat2.glb')
