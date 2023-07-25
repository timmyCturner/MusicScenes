import * as THREE from 'three';
import React, { useRef, useMemo, useEffect, useState } from 'react';
import { extend, useThree, useFrame } from '@react-three/fiber';
import { mapRange } from 'canvas-sketch-util/math';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass';

import { Effects as EffectsComposer } from '@react-three/drei';


import { WaterPass } from './post/Waterpass';
import { useMusicStore } from './useMusicStore';

extend({
  EffectComposer,
  ShaderPass,
  RenderPass,
  WaterPass,
  UnrealBloomPass,
  FilmPass,

});

export function Effects() {
  const composer = useRef();
  const bloomPass = useRef();

  const { scene, gl, size, camera } = useThree();
  const aspect = useMemo(() => new THREE.Vector2(512, 512), []);

  useEffect(
    () => void composer.current.setSize(size.width, size.height),
    [size]
  );

  const drums = useRef(0);
  //const glitchFactor = useMusicStore((state) => state.glitchFactor);

  useEffect(
    () =>
      useMusicStore.subscribe((state) => {
        drums.current = state.drums;
      }),
    []
  );

  useFrame(() => {
    if (bloomPass.current && drums.current) {
      bloomPass.current.strength = mapRange(
        drums.current,
        0.05,
        0.2,
        1.25,
        1.85,
        true
      );
    }

    composer.current.render();
  }, 1);

  return (
    <EffectsComposer   multisamping={8}
      renderIndex={1}
      disableGamma
      disableRenderPass ref={composer} args={[gl]}>
      <renderPass attachArray="passes" scene={scene} camera={camera} />
      {/* <waterPass attachArray="passes" factor={distortFactor} /> <glitchPass glitchPass attachArray="passes" factor={glitchFactor} />*/}
      <unrealBloomPass
        ref={bloomPass}
        attachArray="passes"
        args={[aspect, 0.4, 1, 0]}
      />

      <filmPass attachArray="passes" args={[aspect,0.4, 1, 0]} />

    </EffectsComposer>
  );
}
