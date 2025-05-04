import { useFrame } from '@react-three/fiber';
import { useAnimation } from '../contexts/AnimationContext.js';
import CubeNet from '../cubenets/CubeNet.js';
import FoldableCube from './FoldableCube.js';
import * as ENGINE from '../cubenets/cubeNetEngine.js';


function AnimationDriver() {
    console.log('AnimDriver re-rendering...');
    const { 
        isAutoPlaying, progressRef, sliderRef, 
        showFaceLabels, faceLablesTask,
        signal, facesRef, guideBook, 
        buildConfig, meshRefReadyCheck,
    } = useAnimation();

    // Update slider UI
    function updateProgressAndSyncUISlider(delta, speed=20, MAX_PROGRESS=200) {
        progressRef.current += delta * speed;
        if (progressRef.current >= MAX_PROGRESS) {
            progressRef.current -= MAX_PROGRESS;
        }
        sliderRef.current.value = Math.min(
            progressRef.current, MAX_PROGRESS - progressRef.current);
    }

    function configureNewNetHierarchy(netId) {
        if (netId < 0) return;
        if (signal.current <= 0) return;

        const outlineMatrix = CubeNet.VALID_NETS[netId].mat;
        const bid = buildConfig.current.base;
        const faceCoords = ENGINE.getFacesCoordinate(outlineMatrix);
        const base = faceCoords[bid];

        const { guide } = ENGINE.computeHierarchyGuide(outlineMatrix, base);
        guideBook.current = guide;
        
        // Reset and rebuild face hierarchy
        ENGINE.rebuildMeshHierarchy(facesRef.current, guide);
        signal.current--;
    }

    /** Main animation runner */
    useFrame((_, delta) => {
        // Run ref check once before starting animation; skip frame if not ready
        if (!meshRefReadyCheck.current) {
            meshRefReadyCheck.current = ENGINE.checkAllMeshRefs(facesRef);
            return;
        }

        if (isAutoPlaying.current) {
            updateProgressAndSyncUISlider(delta);
        }
        // Build new hierarchy
        configureNewNetHierarchy(buildConfig.current.net);
        
        // Animating the cube-net transformation
        ENGINE.updateCubeNetAnimation(
            buildConfig.current.animationMode,
            sliderRef.current.value,
            guideBook.current, 
            facesRef.current
        );

        // Updates the visibility of face labels
        if (!faceLablesTask.current) {
            const value = showFaceLabels.current;
            Object.keys(ENGINE.FACE_EDGE_DISC).forEach(key => {
                facesRef.current[key].labelRef.current.visible = value;
            });
            faceLablesTask.current = true;
        }
    });

    return <FoldableCube />;
}

export default AnimationDriver;
