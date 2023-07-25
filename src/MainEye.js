import * as THREE from 'three';
import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import Random from 'canvas-sketch-util/random';
import { lerp, mapRange } from 'canvas-sketch-util/math';
import { useMusicStore } from './useMusicStore';

const RADIUS = 20;
let nextPosition;


function getBrightColor(number, minRange, maxRange) {
  const normalizedNumber = (number - minRange) / (maxRange - minRange);
  const hue = normalizedNumber * 360;

  const rgb = hsvToRgb(hue, 0.5, 1);
  const red = rgb[0]/4//.toString(16).padStart(2, '0');
  const green = rgb[1]/4//.toString(16).padStart(2, '0');
  const blue = rgb[2]/4//.toString(16).padStart(2, '0');
  //a7c700
  return new THREE.Color( red, blue, green);
}

// Helper function to convert HSV to RGB
function hsvToRgb(h, s, v) {
  let r, g, b;

  const c = v * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = v - c;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }

  const rgb = [
    (r + m),
    (g + m),
    (b + m)
  ];

  return rgb;
}

export function MainEye(props) {
  const group = useRef();
  const materialLarge = useRef();
  const materialSmall = useRef();
  const drums = useRef();
  const { nodes, materials } = useGLTF(
    '/eyeOrb.glb'
    // 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/low-poly-spaceship/model.gltf'
  );


  useEffect(
    () =>
      useMusicStore.subscribe(
        (value) => {
          drums.current = value;
        },
        (state) => state.bass
      ),
    []
  );


  useFrame((state) => {
    if (group.current) {


      const off = Random.noise1D(state.clock.elapsedTime, 0.25);

      const tOff = mapRange(off, -1, 1, 0, 1);

      //console.log(lerp((-Math.PI/2)-0.1, (-Math.PI/2)+0.1, tOff));

      group.current.rotation.x = lerp(-6*Math.PI/4, 6*Math.PI/4, tOff);
      group.current.rotation.y = lerp(Math.PI, 2*Math.PI, tOff);
      group.current.rotation.z = lerp(-6*Math.PI/4, 6*Math.PI/4, tOff);
      if (drums.current){

        const color = getBrightColor(mapRange(drums.current, 0.05, 0.15, 1, 5, true), 1, 5)
        //console.log(color);
         //console.log(color,mapRange(drums.current, 0.1, 0.4, 1, 5, true));
        //console.log(materialLarge);
        materialLarge.current.material.emissive= color
        materialLarge.current.material.color= color
        //console.log(materialLarge);

      }
      // materialLarge.current.material.emissive= getBrightColor(mapRange(drums.current, 0.1, 0.4, 1, 5, true), 1, 5)
      // console.log(getBrightColor(mapRange(drums.current, 0.1, 0.4, 1, 5, true), 1, 5));
      //materialSmall.current.material.emissiveIntensity=mapRange(drums.current, 0.1, 0.4, 1, 5, true);
    }
  });



  //new THREE.MeshPhongMaterial({ ambient: 0x030303, color: 0xdddddd, specular: 0x009900, shininess: 30 })
  const material1 = new THREE.MeshPhongMaterial({  color: 0xa7c700, emissive:0xa7c700, transparent: 1, name: "Emit" }) //new THREE.MeshStandardMaterial({ color: 0xdddddd, opacity:0})
  // console.log(material1);
  // console.log(nodes);
  // console.log(materials);

  return (
    <>
    <group ref={group}  scale = {[.5,.5,.5]}{...props} dispose={null}>
      <mesh geometry={nodes.Cylinder.geometry} material={materials.Material003} position={[0, 0, 0]} rotation={[0, -Math.PI / 2, 0]} scale={[1.165, 0.047, 1.165]} />
      <group position={[0, 0, 0]} rotation={[0,0, 0]} scale={0.891}>
        <mesh ref = {materialLarge} geometry={nodes.Sphere_1.geometry} material={material1} />
        <mesh geometry={nodes.Sphere_2.geometry} material={materials.RedEmissive} />
        <mesh geometry={nodes.Sphere_3.geometry} material={materials.Material003} />
      </group>
    </group>

    </>
  );
}

useGLTF.preload(
  '/eyeOrb.glb'
  // 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/low-poly-spaceship/model.gltf'
);
