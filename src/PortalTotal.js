import * as THREE from 'three';
import React, { useRef, useMemo, useEffect  } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sparks } from './SparksCustom';
import {PortalParticles} from './PortalParticles';
import {PortalBody} from './PortalBody';
import {mapRange, lerp } from 'canvas-sketch-util/math';
import Random from 'canvas-sketch-util/random';

  export function PortalTotal(props) {
    const group = useRef();
    const colors = props.colors
    const mouse = props.mouse
    const lines = new Array(19).fill(0);


    useFrame((state) => {


      if (group.current){

        const off = Random.noise1D(state.clock.elapsedTime, 0.25);

        const tOff = mapRange(off, -1, 1, 0, 1);
        group.current.rotation.z = lerp(0, Math.PI*2, tOff);
          //jaw.current.rotation.x = lerp((-Math.PI/4),(-Math.PI/2),0.5)
        }
        //actions.AnimationAction?.play()
        // actions.Action.timeScale = speed


    })
    return (
      <group>
        <group ref = {group}>
            <group>
              {lines.map((props,index) => (
                <group rotation = {[0,0,index*9]}>
                  <Sparks count={5} mouse={mouse} colors={colors.darkIllusion} radius = {10}/>
                </group>
              ))}
            </group>
            <group  rotation = {[0,0,5]}>
              {lines.map((props,index) => (
                <group rotation = {[0,0,index*9]}>
                  <Sparks count={3} mouse={mouse} colors={colors.malevolentIllusion} radius = {8} speed =  {0.1}/>
                </group>
              ))}
            </group>
          </group>
          <group position = {[0,0,-10]}>
            <PortalBody/>
          </group>
          <group position = {[0,0,-5]} scale = {15} rotation = {[Math.PI/2,0,0]}>

            <PortalParticles  count={2000} />

          </group>

      </group>
    )
  }
