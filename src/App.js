import * as THREE from 'three';
import React, { Suspense, useState, useCallback, useRef } from 'react';
import { Canvas, extend } from '@react-three/fiber';
import * as meshline from './MeshLine';
import { Effects } from './Effects';
import { Music } from './Music';
import { Scene } from './SkullScene';
import { useMusicStore } from './useMusicStore';
import { Environment } from '@react-three/drei';

import './styles.css';


extend(meshline);

const didLoadAllAudio = (state) => Object.values(state.didLoad).every(Boolean);

export function App() {
  const init = useMusicStore((state) => state.init);
  const setInit = useMusicStore((state) => state.setInit);
  const didLoadAll = useMusicStore(didLoadAllAudio);

  const mouse = useRef([0, 0]);
  const onMouseMove = useCallback(
    ({ clientX: x, clientY: y }) =>
      (mouse.current = [x - window.innerWidth / 2, y - window.innerHeight / 2]),
    []
  );

  return (
    <div onMouseMove={onMouseMove} style={{ width: '100vw', height: '100vh' }}>
      <Canvas
        pixelratio={window.devicePixelRatio}
        camera={{ fov: 100, position: [30, 0, 0] }}
        onCreated={({ gl, size, camera }) => {
          if (size.width < 600) {
            camera.position.z = 45;
          }
          gl.setClearColor(new THREE.Color('#020207'));
        }}>

        <Suspense fallback={null}>
          <Music />

        </Suspense>
        {/* <axesHelper /> */}

        <Effects />
        <Environment files="./pinkMountain.hdr" background blur={0}/>
        <group  rotation = {[0,Math.PI/2,0]}>
           <Scene init={init} mouse={mouse} />
        </group>
      </Canvas>

      {!init && (
        <div className="overlay">
          <div>
            <h1>3's & 7's</h1>
            {didLoadAll ? (
              <button onClick={() => setInit(true)}>Play</button>
            ) : (
              <div className="loader">Loading…</div>
            )}
          </div>
        </div>
      )}


    </div>
  );
}
//Replace for skull
//camera={{ fov: 100, position: [30, 0, 0] }}
// <Environment files="./pinkMountain.hdr" background blur={0} rotation = {[Math.PI/2,0,0]}/>
// <group  rotation = {[0,0,0]}>
//    <Scene init={init} mouse={mouse} />
// </group>



//<Environment files="./nebula-003-demo.hdr" background blur={0} />

// <div className="attribution">
//   <a href="https://www.youtube.com/watch?v=EeLlAg6GGLc">
//     "Quitters Raga" by Gold Panda
//   </a>
//   <div>
//     <a href="https://github.com/winkerVSbecks/solarstorm">github</a> /{' '}
//     <a href="https://varun.ca/">varun.ca</a>
//   </div>
// </div>
