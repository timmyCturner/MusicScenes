import React from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, OrthographicCamera } from '@react-three/drei';

import { SIDE } from './constants';

const Lights = () => {
  return (
    <>
      <ambientLight intensity={20} />
      <spotLight
        intensity={5}
        position={[-10 * SIDE, 0, 2.5 * SIDE]}
        angle={Math.PI / 7}
      />
    </>
  );
};
// /<color attach="background" args={['#06092c']} />
export const Stage = ({
  children,
  controls = true,
  lights = false,
  lightPosition = [-10, -35, 5],
  ...props
}) => {
  return (
    <Canvas shadows dpr={window.devicePixelRatio} {...props}>

      <OrthographicCamera
        makeDefault
        position={new THREE.Vector3(-30, 30, 30)}
        zoom={10}
      />
      {children}
      <Lights />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
      />
    </Canvas>
  );
};
