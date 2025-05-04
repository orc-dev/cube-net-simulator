import React, { useRef } from 'react';
import { Face } from './Face';
import { useAnimation } from '../contexts/AnimationContext.js';

function FoldableCube() {
    const { facesRef } = useAnimation();
    const cubeRef = useRef();
    
    return (
        <group ref={cubeRef}>
            <Face label='down'  faceRef={facesRef.current.down } />
            <Face label='top'   faceRef={facesRef.current.top  } />
            <Face label='front' faceRef={facesRef.current.front} />
            <Face label='back'  faceRef={facesRef.current.back } />
            <Face label='left'  faceRef={facesRef.current.left } />
            <Face label='right' faceRef={facesRef.current.right} />
        </group>
    );
}

export default FoldableCube;
