// import React, { useRef, useEffect } from "react";
// import { useGLTF, useAnimations } from "@react-three/drei";
// import * as THREE from 'three';
// export  function Floor({ ...props }) {
//
//
//   const group= useRef();
//   const { nodes, scene, animations } = useGLTF("/teardrop.gltf", true);
//   const { actions, mixer } = useAnimations(animations, group);
//   //console.log(nodes);
//
//   useEffect(()=>{
//     //console.log(actions.Action);
//     actions.Action.play()
//   })
//
//
//   const material1 = new THREE.MeshPhongMaterial({  color: 0x7f69f3, emissive:0x7f69f3, transparent: 1,emissiveIntensity:1, name: "Emit" })
//   return (
//     <group ref={group} {...props} dispose={null}>
//       <group name="Scene">
//         <group name="Armature" position={[0, 0, 0]}>
//           <primitive object={nodes.Bone} />
//         </group>
//         <skinnedMesh name="Sphere" geometry={nodes.Sphere.geometry} material={material1} skeleton={nodes.Sphere.skeleton} position={[0, 0, 0]} />
//       </group>
//     </group>
//   )
// }
// useGLTF.preload("/teardrop.gltf");



import * as THREE from 'three';
import React, { useRef, useMemo, useEffect  } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import './styles.css';
import Random from 'canvas-sketch-util/random';
import { useGLTF, useAnimations } from '@react-three/drei';
export function Floor({ count, mouse,colors,distortionScale }) {
  const mesh = useRef();

  const color =  Random.pick(colors)
  const light = useRef();


  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;

  const { nodes, materials, animations } = useGLTF(
    '/teardrop.gltf'
    // 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/low-poly-spaceship/model.gltf'
  );
  const { actions, mixer } = useAnimations(animations, mesh);
  // console.log(scene);
  console.log(distortionScale);
  useEffect(()=>{
      //console.log(actions.Action);
      actions.Action.play()
      console.log(actions.Action);
    })

  // const dummy = useMemo(() => new THREE.Object3D(), []);
  //
  // const gap = 5
  // const shift = 12.5
  // // Generate some random positions, speed factors and timings
  // const particles = useMemo(() => {
  //
  //   //console.log('1');
  //
  //   const temp = [];
  //   for (let i = 0; i < count; i++) {
  //     const t = Math.random() * 100;
  //     const factor = 20 + Math.random() * 100;
  //     const speed = 0.01 + Math.random() / 200;
  //     const xFactor = -50 + Math.random() * 10;
  //     const yFactor = -10 + Math.random() * 10;
  //     const zFactor = -50 + Math.random() * 100;
  //     const index = i;
  //     temp.push({ t, factor, speed, xFactor, yFactor, zFactor, index, mx: 0, my: 0 });
  //   }
  //   return temp;
  // }, [count]);


  //The innards of this hook will run every frame
  // useFrame((state,delta) => {
  //   console.log(mesh.current);
  //
  //
  //
  //
  //   // Makes the light follow the mouse
  //   light.current.position.set(
  //     mouse.current[0] / aspect,
  //     -mouse.current[1] / aspect,
  //     0
  //   );
  //   // Run through the randomized data to calculate some movement
  //   particles.forEach((particle, i) => {
  //     let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
  //     // There is no sense or reason to any of this, just messing around with trigonometric functions
  //     t = particle.t += speed / 2;
  //     const a = Math.cos(t) + Math.sin(t * 1) / 10;
  //     const b = Math.sin(t) + Math.cos(t * 2) / 10;
  //     const c = 1-Math.cos(t);
  //     const s = Math.cos(t);
  //     // particle.mx += (mouse.current[0] - particle.mx) * 0.01;
  //     // particle.my += (mouse.current[1] * -1 - particle.my) * 0.01;
  //     // Update the dummy object
  //     //console.log(mesh.current);
  //
  //     dummy.position.set(
  //       (gap*(i%10)-shift),
  //       0,
  //       gap*(Math.trunc(i/10))
  //     );
  //     //dummy.scale.set(mesh.current.scale);
  //
  //     dummy.updateMatrix();
  //     // And apply the matrix to the instanced item
  //     mesh.current.setMatrixAt(i, dummy.matrix);
  //   });
  //   mesh.current.instanceMatrix.needsUpdate = true;
  // });
  //console.log(particles);
  const material1 = new THREE.MeshPhongMaterial({  color: 0x7f69f3, emissive:0x7f69f3, transparent: 1,emissiveIntensity:1, name: "Emit" })

  return (
    <>
      <pointLight ref={light} distance={40} intensity={8} color="lightblue" />
      <instancedMesh ref={mesh} args={[nodes.Sphere.geometry, material1, count]}>
         <group name="Armature" position={[0, 0, 0]}>
           <primitive object={nodes.Bone} />
         </group>
         <skinnedMesh name="Sphere" geometry={nodes.Sphere.geometry} material={material1} skeleton={nodes.Sphere.skeleton} position={[0, 0, 0]} />


      </instancedMesh>
    </>
  );
}
useGLTF.preload(
  '/teardrop.gltf'
  // 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/low-poly-spaceship/model.gltf'
);
