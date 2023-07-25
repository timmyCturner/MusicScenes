import shallow from 'zustand/shallow';
import { OrbitControls, CameraShake, Environment } from '@react-three/drei';
// import HDRFile from 'public/Back_1k.hdr'
import { Sparks } from './Sparks';
import { SparkStormCustom } from './SparkStormCustom';
import { SpaceDust } from './SpaceDust';
import { Floor } from './Tears';
// import {Background} from './Background.js'
import { EyeOrb } from './EyeOrb';
import { MainBody } from './MainBody';
import { Table } from './Table';
import { MainEye } from './MainEye';
import { MainPent } from './MainPent';
import { MainHex } from './MainHex';
import { useMusicStore } from './useMusicStore';

/**
 * URL:
 * https://farbvelo.elastiq.ch/?s=eyJzIjoiMTAxNTcwMDEyZDNkZCIsImEiOjYsImNnIjo0LCJoZyI6dHJ1ZSwiaGIiOnRydWUsImhvIjpmYWxzZSwiaHQiOmZhbHNlLCJiIjpmYWxzZSwicCI6MC4xNzUsIm1kIjo2MCwiY20iOiJsYWIiLCJmIjoiU2ltcGxleCBOb2lzZSIsImMiOiJoc2x1diJ9
 *
 * // '#A2CCB6',
 * // '#FCEEB5',
 * // '#EE786E',
 * // '#e0feff',
 * // 'lightpink',
 * // 'lightblue',
 malevolentIllusion: [
   '#c06995',
   '#de77c7',
   '#df86df',
   '#d998ee',
   '#ceadf4',
   '#c6bff9',
 ]
 */

const colors = {

  malevolentIllusion: [
    '#9ac069',
    '#a8de77',
    '#b4df86',
    '#c0d998',
    '#c6eead',
    '#c9f9c6',
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



          // <Environment files="./Back_1k.hdr" background blur={0.5} />
  //console.log(distortFactor);
  //console.log(sparkStorm);

  return (
    <>
      <OrbitControls
        makeDefault
        enablePan={false}
        enableRotate={true}
        enableZoom={false}
      />

      <CameraShake
        yawFrequency={0.05 * (sparkStorm ? 10 : 1)}
        rollFrequency={0.2 * (sparkStorm ? 2 : 1)}
        pitchFrequency={0.1 * (sparkStorm ? 2 : 1)}
      />

      <pointLight distance={100} intensity={.4} color="white" />
      <group >
        {init }
        <group scale = {[1,1,1]} >
          <EyeOrb radius = {18} sphereType = {0}/>
          <EyeOrb radius = {18}  sphereType = {1}  />
          <EyeOrb radius = {18} sphereType = {2}/>
          <EyeOrb radius = {18} sphereType = {3}/>
        </group>


        <group scale = {[1,1,1]} position={[0,-15,0]} >
          <Floor
             distortionScale={distortFactor}
             count={100} mouse={mouse} colors={colors.sunnyRainbow}
             />
          <Table scale = {[8,5,8]} position={[0,-2,0]}/>
        </group>
        <group scale = {[3,3,3]} rotation = {[0,Math.PI/2,0]} position = {[0,5,5]}>
          <MainBody />
          <MainEye />
          <MainPent count={10}/>
          <MainHex count={12}/>
        </group>



        <SpaceDust count={1000} mouse={mouse} />
        <Sparks count={20} mouse={mouse} colors={colors.malevolentIllusion} />
        {sparkStorm && (

        <SparkStormCustom  count={250} mouse={mouse} colors={colors.sunnyRainbow} />

        )}
      </group>
    </>
  );
}
