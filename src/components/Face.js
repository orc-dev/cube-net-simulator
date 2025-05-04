import React, { useRef } from 'react';
import * as THREE from 'three';
import { useLoader, extend } from '@react-three/fiber';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import * as ENGINE from '../cubenets/cubeNetEngine.js';
// Extend THREE with TextGeometry
extend({ TextGeometry });

export const HALF_UNIT = 0.5;

const FACE_COLOR = {
    down:  0x76D4Dc,
    top:   0xFDFBFE,
    front: 0xD1AEBA,
    back:  0xA17470,
    left:  0xc9b8a3,
    right: 0xf54e38,
};

const EDGE_POSITION = {
    xp: [+HALF_UNIT, 0, 0],
    xn: [-HALF_UNIT, 0, 0],
    zp: [0, 0, +HALF_UNIT],
    zn: [0, 0, -HALF_UNIT],
};

/** X-offsets for positioning face label text on each cube face. */
const DX = {
    down:  -0.365,
    top:   -0.195,
    front: -0.335,
    back:  -0.315,
    left:  -0.25,
    right: -0.325,
};

/** Y-offsets for positioning face label text on each cube face. */
const DY = {
    down:  -0.1,
    top:   -0.1,
    front: -0.1,
    back:  -0.1,
    left:  -0.1,
    right: -0.1,
};

/** Z-axis rotation (in radians) to orient face label text. */
const RZ = {
    down:  0,
    top:   0,
    front: 0,
    back:  Math.PI,
    left:  Math.PI * 0.5,
    right: -Math.PI * 0.5,
};


export function Face({ label, faceRef }) {
    const groupRef = useRef();
    const skinRef = useRef();
    const labelRef = useRef();
    const xp = useRef();
    const xn = useRef();
    const zp = useRef();
    const zn = useRef();

    // Load font once
    const textOptions = {
        font: useLoader(FontLoader, './assets/droid_sans_bold.typeface.json'),
        size: 1,
        depth: 0.2,
        bevelEnabled: true,
        bevelThickness: 0.01,
		bevelSize: 0.01,
		bevelOffset: 0,
		bevelSegments: 5
    };

    // Expose refs
    React.useEffect(() => {
        faceRef.ref = groupRef;
        faceRef.skin = skinRef;
        faceRef.labelRef = labelRef;
        faceRef.xp = xp;
        faceRef.xn = xn;
        faceRef.zp = zp;
        faceRef.zn = zn;

        const edgeList = [xp, zn, xn, zp];
        const neibFace = ENGINE.FACE_EDGE_DISC[label];

        for (let i = 0; i < 4; i++) {
            faceRef[neibFace[i]] = edgeList[i];
        }
        // eslint-disable-next-line
    }, []);

    function faceSquareMesh() {
        return (
            <mesh>
                <planeGeometry args={[HALF_UNIT * 2, HALF_UNIT * 2]} />
                <meshStandardMaterial
                    color={FACE_COLOR[label]}
                    metalness={0.5}
                    roughness={0.5}
                    side={THREE.DoubleSide}
                    flatShading={false}
                />
            </mesh>
        );
    }

    function faceLabelTextMesh() {
        return (
            <mesh position={[DX[label], DY[label], -0.02]} scale={[0.2, 0.2, 0.2]}>
                <textGeometry attach='geometry' args={[label, textOptions]} />
                <meshStandardMaterial color={'white'} side={THREE.DoubleSide} />
            </mesh>
        );
    }

    return (
        <group ref={groupRef}>
            {/* Add skins to display face */}
            <group ref={skinRef} rotation={[Math.PI * 0.5, 0, 0]}>
                {faceSquareMesh()}
                <group ref= {labelRef} rotation={[0, 0, RZ[label]]}>
                    {faceLabelTextMesh()}
                </group>
            </group>
            {/* Edge groups */}
            <group ref={xp} position={EDGE_POSITION.xp} />
            <group ref={xn} position={EDGE_POSITION.xn} />
            <group ref={zp} position={EDGE_POSITION.zp} />
            <group ref={zn} position={EDGE_POSITION.zn} />
        </group>
    );
}
