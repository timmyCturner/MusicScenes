import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import Random from 'canvas-sketch-util/random';
import { lerp, mapRange } from 'canvas-sketch-util/math';
import { useMusicStore } from './useMusicStore';
import {
  createAttractor,
  updateAttractor,
  // dadrasAttractor,
  // upDownAttractor,
  // aizawaAttractor,
  // arneodoAttractor,
  // dequanAttractor,
  rosslerAttractor,


  halversonAttractor
} from './attractor';

const simulation = () =>
  Random.pick([
    //dadrasAttractor,
    rosslerAttractor
    // halversonAttractor
    // lorenzAttractor,
    // lorenzMod2Attractor,

  ]);

function Fatline({ radius, simulation, width, color }) {

  const line = useRef();
  const material = useRef();
  const vocals = useRef(0);

  useEffect(
    () =>
      useMusicStore.subscribe(
        (value) => {
          vocals.current = value;
        },
        (state) => state.vocals
      ),
    []
  );

  useFrame(() => {
    if (line.current) {
      //console.log(currentPosition);
      const nextPosition = updateAttractor(
        currentPosition,
        radius,
        simulation,
        0.005
      );

      line.current.advance(nextPosition);
    }

    if (vocals.current) {
      material.current.uniforms.lineWidth.value =
        width * mapRange(vocals.current, 0.2, 0.4, 0.5, 2, true);
    }
  });


  const [positions, currentPosition] = useMemo(() => createAttractor(5), []);

  return (
    <mesh>
      <meshLine ref={line} attach="geometry" points={positions} />
      <meshLineMaterial
        attach="material"
        ref = {material}
        transparent
        lineWidth={width}
        color={color}

      />
    </mesh>
  );
}

export function SparkStormCustom({ mouse, count, colors, radius = 10 }) {
  const lines = useMemo(
    () =>
      new Array(count).fill().map(() => {
        return {
          color: Random.pick(colors),
          width: Random.range(0.1, 0.2),
          speed: Random.range(0.001, 0.002),
          simulation: simulation(),
          radius: Random.range(2, 2.25) * radius,
        };
      }),
    [count]
  );

  const storm = useRef();
  const group = useRef();

  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;

  useFrame(() => {
    if (storm.current) {
      storm.current.rotation.x = lerp(
        storm.current.rotation.x,
        0 + mouse.current[1] / aspect / 200,
        0.1
      );
      storm.current.rotation.y = lerp(
        storm.current.rotation.y,
        0 + mouse.current[0] / aspect / 400,
        0.1
      );
      //storm.current.rotation.z +=0.1
    }
    if (group.current){
      //group.current.rotation.x+=1
      group.current.rotation.y+=0.01
    }
  });



  return (
    <group ref={group} position = {[0,5,-5]}>
      <group ref={storm}>
        <group position = {[0,0,0]} rotation = {[Math.PI/2,0,5*Math.PI/8]}>
          {lines.map((props, index) => (
            <Fatline key={index} {...props} />
          ))}
        </group>
        <group position = {[0,-2.5,0]} rotation = {[-Math.PI/2,0,-3*Math.PI/8]}>
          {lines.map((props, index) => (
            <Fatline key={index} {...props} />
          ))}
        </group>
      </group>
    </group>
  );
}
