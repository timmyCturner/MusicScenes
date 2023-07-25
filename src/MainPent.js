import * as THREE from 'three';
import React, { useRef, useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import Random from 'canvas-sketch-util/random';
import { useMusicStore } from './useMusicStore';
import {mapRange } from 'canvas-sketch-util/math';
import {
  createAttractor,
  updateAttractor,
  lorenzMod2Attractor,
} from './attractor';

const RADIUS = 20;


export function MainPent({count, mouse, colors, props}) {
  const top = useRef(0);
  const other = useRef(0);
  const bottom = useRef(1);
  const group = useRef(2);

  const { nodes, materials } = useGLTF(
    '/robotPent.glb'

  );
  //const light = useRef();

  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const dummyGroup = useMemo(() => new THREE.Object3D(), []);

  const gap = 5
  const shift = 12.5
  // Generate some random positions, speed factors and timings
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 10 + Math.random() * 1;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -50 + Math.random() * 10;
      const yFactor = 1;
      const zFactor = -50 + Math.random() * 100;

      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  useEffect(
    () =>
      useMusicStore.subscribe(
        (value) => {
          other.current = value;
        },
        (state) => state.melody
      ),
    []
  );
  // The innards of this hook will run every frame
  useFrame((state) => {
    let otherMap;
    if (other.current) {
        //console.log(mapRange(other.current, 0.2, 0.4, 0.5, 1, true));
        otherMap =  mapRange(other.current, 0.2, 0.4, 1, 15, true);
    }
    // Makes the light follow the mouse
    // light.current.position.set(
    //   mouse.current[0] / aspect,
    //   -mouse.current[1] / aspect,
    //   0
    // );
    // Run through the randomized data to calculate some movement
    //console.log(state);
    //console.log(Object.keys(nodes)[2]);
    // let i = 2;
    // let key = "Pent"+String(i)
    //console.log(nodes[key].position);
    particles.forEach((particle, i) => {
      let key = "Pent"+String(i)
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      // There is no sense or reason to any of this, just messing around with trigonometric functions
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const c = 1-Math.cos(t);
      const s = Math.cos(t);
      // particle.mx += (mouse.current[0] - particle.mx) * 0.01;
      // particle.my += (mouse.current[1] * -1 - particle.my) * 0.01;
      // Update the dummy object
      //console.log(nodes[i]);

      if (nodes[key]){
        dummy.position.set(
          nodes[key].position.x/0.578,
          nodes[key].position.y/0.575,
          nodes[key].position.z/0.578
        );
      }
      // else{
      //   // console.log(key);
      //   //console.log(nodes[key]);
      // }


      //nodes[key].translateY(((Math.sin(10*t))/50))
      //nodes[key].translateY(0.1)
      if(!nodes[key].translateTotal){
        nodes[key].translateTotal=0
      }
      if(isNaN(otherMap)||!otherMap){
        otherMap = 1
      }
      const transY = ((Math.sin(10*t))/250)*otherMap
      if (((nodes[key].translateTotal+transY)>0)&&((nodes[key].translateTotal+transY)<1)){
        nodes[key].translateTotal+=transY
        nodes[key].translateY(transY)
      }
      else if ((nodes[key].translateTotal+transY)>1){
        nodes[key].translateTotal-=0.05
        nodes[key].translateY(-0.05)
      }

      // dummy.scale.set(nodes[key].scale.x,nodes[key].scale.y, nodes[key].scale.z);
      dummyGroup.rotation.set(nodes[key].rotation.x,nodes[key].rotation.y, nodes[key].rotation.z);
      dummy.rotation.set(nodes[key].rotation.x,nodes[key].rotation.y, nodes[key].rotation.z);
      dummy.updateMatrix();
      dummyGroup.updateMatrix();
      // And apply the matrix to the instanced item
      top.current.setMatrixAt(i, dummy.matrix);
      bottom.current.setMatrixAt(i, dummy.matrix);
      //console.log(bottom);
      group.current.setMatrixAt(i, dummyGroup.matrix);

    });
    top.current.instanceMatrix.needsUpdate = true;
    bottom.current.instanceMatrix.needsUpdate = true;
    group.current.instanceMatrix.needsUpdate = true;
    //console.log(top);
  });

  //console.log(particles);
  const material1 = new THREE.MeshPhongMaterial({  color: 0x4bf161, emissive:0x4bf161, transparent: 1,emissiveIntensity:.5, name: "Emit" }) //new THREE.MeshStandardMaterial({ color: 0xdddddd, opacity:0})

  // console.log(materials);
  // console.log(Object.keys(nodes).length);    //<mesh geometry={nodes.Cylinder002.geometry} material={materials.Material003} />
   //console.log(nodes);

  return (
    <>

    <instancedMesh scale = {[.578,.575,.578]} ref = {group}  args={[nodes.Pent0.geometry, materials.Material003, count]}>
        <group  >
          <instancedMesh ref={top}

          args={[nodes.Cylinder022.geometry, materials.Material003, count]}>



          </instancedMesh>
          <instancedMesh ref={bottom}  args={[nodes.Cylinder022_1.geometry, material1, count]}>



          </instancedMesh>
        </group>
      </instancedMesh>
    </>
  );
}

useGLTF.preload(
  '/robotPent.glb'
  // 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/low-poly-spaceship/model.gltf'
);
