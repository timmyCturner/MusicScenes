import * as THREE from 'three';
import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import Random from 'canvas-sketch-util/random';
import { lerp, mapRange } from 'canvas-sketch-util/math';
import { useMusicStore } from './useMusicStore';

const radiusVariance = () => Random.range(0.75, .95);

function FatLine({ curve, width, color, speed }) {
  const material = useRef();

  const drums = useRef(0);
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

  useFrame(() => {
    material.current.uniforms.dashOffset.value -= speed;
    if (drums.current) {
      material.current.uniforms.lineWidth.value =
        width * mapRange(drums.current, 0.2, 0.4, 0.5, 2, true);
    }

  });

  return (
    <mesh>
      <meshLine attach="geometry" points={curve} />
      <meshLineMaterial
        attach="material"
        ref={material}

        opacity = {0.25}
        depthTest={true}
        lineWidth={width}
        color={color}
        dashArray={1}
        dashRatio={.1}
      />
    </mesh>
  );
}

export function Sparks({ mouse, count, colors, radius = 10, rotation=[0,0,0]}) {
  //console.log(colors);
  const lines = useMemo(
    () =>
      new Array(count).fill().map((_, index) => {
        const pos = new THREE.Vector3(
          Math.sin(0) * radius * radiusVariance(),
          Math.cos(0) * radius * radiusVariance(),
          0
        );
        const points = new Array(30).fill().map((_, index) => {
          const angle = (index / 20) * Math.PI * 2;

          const radiusDelim =((1 - index / (30 - 1)) * radius)+1
          //console.log(radiusDelim);
          return pos
            .add(
              new THREE.Vector3(
                Math.sin(angle) * radiusDelim  * radiusVariance(),
                Math.cos(angle) * radiusDelim * radiusVariance(),
                0
              )
            )
            .clone();
        });
        const curve = new THREE.CatmullRomCurve3(points).getPoints(1000);
        return {
          color: colors[parseInt(colors.length * Math.random())],
          width: Math.max(0.2, (0.2 * index) / 10),
          speed: Math.max(0.001, 0.004 * Math.random()),
          curve,
        };
      }),
    [count]
  );

  const ref = useRef();
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x = lerp(
        ref.current.rotation.x,
        0 + mouse.current[1] / aspect / 400,
        0.1
      );
      ref.current.rotation.y = lerp(
        ref.current.rotation.y,
        0 + mouse.current[0] / aspect / 800,
        0.1
      );
    }
  });

  return (
    <group ref={ref} position={[-radius*2, -radius*1.1, -15]} >
      <group  scale={[1, 1, 1]}>
        {lines.map((props, index) => (
          <FatLine key={index} {...props} />
        ))}
      </group>
    </group>
  );
}
