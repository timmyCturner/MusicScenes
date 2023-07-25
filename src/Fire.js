import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useEffect } from 'react';
import * as THREE from "three";
import { useMusicStore } from './useMusicStore';

import vertexShader from './vertexShader';
import fragmentShader from './fragmentShader';

function generateRandom(){
  return Math.floor(Math.random() * (Math.round(Math.random()) ? 25 : -25))
}
function FireDrop (props) {
  const { count, distortionScale } = props;
  const radius = 3;

  const distortFactor = useMusicStore((state) => state.distortFactor);
  // This reference gives us direct access to our points
  const points = useRef();
  const melody = useRef(0);

  // Generate our positions attributes array
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const distance = Math.sqrt(Math.random()) * radius;
      const theta = THREE.MathUtils.randFloatSpread(360);
      const phi = THREE.MathUtils.randFloatSpread(360);

      let x = (distance * Math.sin(theta) * Math.cos(phi)/2)/4
      let y = distance * Math.sin(theta) * Math.sin(phi)/6;
      let z = (distance * Math.cos(theta)/2)/4;

      positions.set([x, y, z], i * 3);
    }

    return positions;
  }, [count]);

  const uniforms = useMemo(() => ({
    u_time: {
      value: 0.0
    },
    uRadius: {
      value: radius
    },
    u_distort: { value: 0.8 },
    u_music: { value: 0 },
    clipping: true,
  }), [])
  useEffect(
    () =>
      useMusicStore.subscribe(
        (value) => {
          melody.current = value;
        },
        (state) => state.melody
      ),
    []
  );
  useFrame((state) => {

    const { clock } = state;
    if (points.current){
      //console.log(points.current.material.uniforms);
      points.current.material.uniforms.u_time.value = clock.elapsedTime;

      points.current.material.uniforms.u_music.value = melody.current*(1+distortFactor);

      //points.current.material.uniforms.u_time.value = state.clock.elapsedTime;
      points.current.material.uniforms.u_distort.value = distortFactor;

      //console.log(melody.current*(1+distortFactor));
    }


  });
  //


  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
      />
    </points>
  );
};

export function Fire(props){
  const { count,amount } = props;
  const drops = []
  for (let i = 0; i < amount; i++)
  {
    const x = generateRandom()
    const y = (generateRandom()/10)-2.5
    const z = generateRandom()/2

    drops.push(
      <group position={[x,y,z]}>
        <FireDrop
          key={i}
          count={count}
        />
      </group>
    )
  }
  return (
      drops
  )

}
