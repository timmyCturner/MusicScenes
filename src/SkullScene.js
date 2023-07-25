import shallow from 'zustand/shallow';
import * as THREE from 'three'
import { OrbitControls, CameraShake, Environment, useGLTF} from '@react-three/drei';
// import HDRFile from 'public/Back_1k.hdr'
import { PortalTotal } from './PortalTotal';
import { SparkStormCustom } from './SparkStormCustom';
import { SpaceDust } from './SpaceDust';
import { SkullBody } from './SkullBody';
import {Planet} from './Planet';
import {Fire} from './Fire';
import {GhostW} from './GhostW';
import {GhostB} from './GhostB';



import { SIDE } from './constants';
import './materials/SilkyMaterial';
import { useControls } from 'leva'
import { useMusicStore } from './useMusicStore';


const Lights = () => {
  return (
    <>
      <ambientLight intensity={5} />
      <spotLight
        intensity={5}
        position={[-10 * SIDE, 0, 2.5 * SIDE]}
        angle={Math.PI / 7}
      />
    </>
  );
};


const colors = {

  malevolentIllusion: [
    '#9ac069',
    '#a8de77',
    '#b4df86',
    '#c0d998',
    '#c6eead',
    '#c9f9c6',
],
darkIllusion: [
    '#c06995',
    '#de77c7',
    '#df86df',
    '#d998ee',
    '#ceadf4',
    '#c6bff9',
  ],
  sunnyRainbow: [
    '#fbe555',
    '#a8de77',
    '#b4df86',
    '#c0d998',
    '#ffeed0',
    '#feff89',
    '#328a99'
  ],
};

const appStateSelector = (state) => ({
  sparkStorm: state.sparkStorm,
  planetDistortion: state.planetDistortion,
  spaceshipDistortion: state.spaceshipDistortion,
  beep: state.beep,
  planetDistortionMax: state.planetDistortionMax,
  distortFactor: state.distortFactor

});


export function Scene({ init = false, mouse }) {
  const {
    sparkStorm,
    planetDistortion,
    spaceshipDistortion,
    beep,
    planetDistortionMax,
    distortFactor,
    scale,
  } = useMusicStore(appStateSelector, shallow);





  return (
    <>
      <OrbitControls
        makeDefault
        enablePan={false}
        enableRotate={true}
        enableZoom={false}
      />

      <Lights/>
      <CameraShake
        yawFrequency={0.05 * (sparkStorm ? 10 : 1)}
        rollFrequency={0.2 * (sparkStorm ? 2 : 1)}
        pitchFrequency={0.1 * (sparkStorm ? 2 : 1)}
      />


      <group scale = {4} position={[0,0,1]}>
        <SkullBody distortionScale={planetDistortionMax ? 15 : planetDistortion ? 10 : 5}/>
      </group>
      <PortalTotal colors = {colors}  mouse = {mouse}/>
      <group >
        {init }
        <group scale = {[1,1,1]} rotation = {[0,0,0]}>

          <GhostW radius = {25} sphereType = {0}/>
          <GhostW radius = {25}  sphereType = {1}  />
          <GhostW radius = {25}  sphereType = {2}  />
          <GhostW radius = {25}  sphereType = {3}  />
          <GhostW radius = {25}  sphereType = {4}  />

        </group>
        <group scale = {4} position={[10,-10,-20]}>
          <Fire count={2000} amount = {100} distortionScale={planetDistortionMax ? 15 : planetDistortion ? 10 : 5}/>
        </group>

        <SpaceDust count={1000} mouse={mouse} />


      </group>
    </>
  );
}
