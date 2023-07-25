import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { useMusicStore } from './useMusicStore';

import vertexShaderOriginal from './vertexShaderOriginal';
import fragmentShader from './fragmentShaderGal';

export function PortalParticles(props) {
  const { count } = props;
  const radius = 5;

  // This reference gives us direct access to our points
  const points = useRef();


  const drums = useRef(0);
  const distortFactor = useMusicStore((state) => state.distortFactor);

  // Generate our positions attributes array
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const distance = Math.sqrt(Math.random()) * radius;
      const theta = THREE.MathUtils.randFloatSpread(360);
      const phi = THREE.MathUtils.randFloatSpread(360);

      let x = distance * Math.sin(theta) * Math.cos(phi)
      let y = distance * Math.sin(theta) * Math.sin(phi);
      let z = distance * Math.cos(theta);

      positions.set([x, y, z], i * 3);
    }

    return positions;
  }, [count]);

  const uniforms = useMemo(() => ({
    u_time: {
      value: 0.0
    },
    u_distort: { value: 0.8 },
    u_music: { value: 0 },
    uRadius: {
      value: radius
    }
  }), [])
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
    const { clock } = state;
    points.current.material.uniforms.u_time.value = clock.elapsedTime;

    points.current.material.uniforms.u_music.value = drums.current*(1+distortFactor);

    //points.current.material.uniforms.u_time.value = state.clock.elapsedTime;
    points.current.material.uniforms.u_distort.value = distortFactor;
  });

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
        vertexShader={vertexShaderOriginal}
        uniforms={uniforms}
      />
    </points>
  );
};
