import * as THREE from 'three';
import React, { useRef, useMemo, useEffect  } from 'react';
import { useFrame, useGraph, useThree } from '@react-three/fiber';
import './styles.css';
import Random from 'canvas-sketch-util/random';
import { useGLTF, useAnimations } from '@react-three/drei';
import  * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils'
import { useMusicStore } from './useMusicStore';
import { mapRange } from 'canvas-sketch-util/math';
// fixes bug putting all in a functions idk why
function generateRandom(){
  return Math.floor(Math.random() * (Math.round(Math.random()) ? 25 : -25))
}
function calculateScale(position, center, radius, minScale, maxScale) {
  // Calculate the distance between the position and the center of the circle
  const distance = Math.sqrt(
    Math.pow(position.x - center.x, 2) + Math.pow(position.y - center.y, 2)
  );

  // Calculate the maximum distance from the center to the edge of the circle
  const maxDistance = radius;

  // Calculate the scale based on the distance
  const scale = minScale + (maxScale - minScale) * (1 - distance / maxDistance);

  return Math.pow(scale,2)/1.5;
}

function Tear({ color, speed, index, position, scale  }) {

  const mesh = useRef();
  const emit = useRef();
  const melody = useRef(0);

  const shift = 25;
  const gap = 10;
  const { materials, animations, scene } = useGLTF(
    '/teardrop.glb'
    // 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/low-poly-spaceship/model.gltf'
  );

  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes } = useGraph(clone)
  const { actions, mixer } = useAnimations(animations, mesh);


    //console.log(speed);

  // console.log(scene);
  //console.log(distortionScale);
  //const emit = parseFloat(speed);
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
          scale=mapRange(melody.current, 0.1, 0.4, 0.5, 2, true*scale);
          speed=mapRange(melody.current, 0.1, 0.4, 0.5, 2, true);
          //console.log(mapRange(melody.current, 0.1, 0.4, 0.5, 2, true),speed);
        }
        //emit.material.emissiveIntensity = speed
        //console.log(speed);
    })
    //console.log(actions);
  if (actions.Action && nodes.Bone){
    actions.Action?.play()
    actions.Action.timeScale = speed
  }
    //console.log( distortionScale );
    // <group name="Armature" position={[0, 0, 0]}>
    //   <primitive object={nodes.Bone} />
    // </group>
    // <skinnedMesh name="Sphere" geometry={nodes.Sphere.geometry} material={material1} skeleton={nodes.Sphere.skeleton} position={[0, 0, 0]} />
  //  console.log(index);

  const material1 = new THREE.MeshPhongMaterial({  color: 0x59bccd, emissive:0x328a99, transparent: 0.5,emissiveIntensity:0.75, name: "Emit" })
  return (
    <>



    <group ref={mesh} dispose={null} position={position} scale = {scale}>
      <group name="Scene">
        <group name="Armature" position={[0, 0, 0]}>
          <primitive object={nodes.Bone} />
        </group>
        <skinnedMesh ref={emit} name="Sphere" geometry={nodes.Sphere.geometry} material={material1} skeleton={nodes.Sphere.skeleton} position={[0, 0, 0]} />
      </group>
    </group>



    </>
  );
}

export function Floor({ count, mouse, colors, distortionScale  }) {
  const mesh = useRef();
  const drops = []


  const color =  Random.pick(colors)
  const light = useRef();


  // const { nodes, materials, animations, scene } = useGLTF(
  //   '/teardrop.gltf'
  //   // 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/low-poly-spaceship/model.gltf'
  // );

  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;


  //console.log( distortionScale );
  // const props = useMemo(
  //   () =>
  //     new Array(count).fill().map((curr, index) => {
  //
  //       return {
  //         color: Random.pick(colors),
  //         width: Random.range(0.1, 0.2),
  //         speed: Random.range(0.001, 0.002),
  //         index: index,
  //         position: [index,index,index]
  //
  //       };
  //
  //     }),
  //   [count]
  // );

  for (let i = 0; i < count; i++)
  {
    const x = generateRandom()
    const z = generateRandom()

    const position = { x: x, y: z };
    const center = { x: 0, y: 0 };
    const radius = 100;
    const maxScale = 5;
    const minScale = 0.5;

    const scale = calculateScale(position, center, radius, maxScale, minScale);
    //console.log(scale);
    // cosnt z = Math.floor(Math.random() * (Math.round(Math.random()) ? 25 : -25));
    //const scale = 200

    drops.push(
      <Tear
        key={i}
        position={[
          x,
          -2.5,
          z

        ]}
        speed = {Math.round((Math.random() * 10)+10)/10}
        scale = {scale}

      />
    )
  }



  // {lines.map((props, index) => (
  //   <Clone key = {index} object={scene} {...props} position = {[index,0,index]}/>
  //
  // ))}

  const material1 = new THREE.MeshPhongMaterial({  color: 0x7f69f3, emissive:0x7f69f3, transparent: 1,emissiveIntensity:1, name: "Emit" })
  // const { nodes, materials, animations, scene } = useGLTF(
  //   '/teardrop.gltf'
  //   // 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/low-poly-spaceship/model.gltf'
  // );
  // const { actions, mixer } = useAnimations(animations, mesh);

  //console.log(drops);

  return (
    <group>


            {drops}


    </group>
  );
}
useGLTF.preload(
  '/teardrop.gltf'
  // 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/low-poly-spaceship/model.gltf'
);
