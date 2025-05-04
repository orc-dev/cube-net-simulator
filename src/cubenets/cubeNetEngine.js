/**
 * Given a face label, this table defines the adjacent faces 
 * in the order of positive X (xp), negative Z (zn), negative X (xn), 
 * and positive Z (zp), relative to the face's local coordinate system.
 * 
 *     +------ B ------+       +------ F ------+      +------ D ------+
 *     |               |       |               |      |               |
 *     |               |       |               |      |               |
 *     L     DOWN      R       L      TOP      R      L     FRONT     R
 *     |               |       |               |      |               |
 *     |               |       |               |      |               |
 *     +------ F ------+       +------ B ------+      +------ T ------+
 * 
 *     +------ B ------+       +------ B ------+      +------ T ------+
 *     |               |       |               |      |               |
 *     |               |       |               |      |               |
 *     T     LEFT      D       D     RIGHT     T      L     BACK      R
 *     |               |       |               |      |               |
 *     |               |       |               |      |               |
 *     +------ F ------+       +------ F ------+      +------ D ------+
 * 
 */
export const FACE_EDGE_DISC = {
    // order: xp, zn, xn, zp
    down:  ['right', 'back', 'left', 'front'],
    top:   ['right', 'front', 'left', 'back'],
    front: ['right', 'down', 'left', 'top'],
    back:  ['right', 'top', 'left', 'down'],
    left:  ['down', 'back', 'top', 'front'],
    right: ['top', 'back', 'down', 'front'],
};

/** Specifies the xz_type of pFace-cFace edge */
export const XZ_TYPE = {
    down:  {right: 'xp', back: 'zn', left: 'xn', front: 'zp'},
    top:   {right: 'xp', front: 'zn', left: 'xn', back: 'zp'},
    front: {right: 'xp', left: 'xn', top: 'zp'},
    back:  {right: 'xp', top: 'zn', left: 'xn'},
    left:  {back: 'zn', top: 'xn', front: 'zp'},
    right: {top: 'xp', back: 'zn', front: 'zp'},
};

const HALF_UNIT = 0.5;
const HALF_PI = Math.PI * 0.5;

/** Shift vector for setting positions of the child face based on
 * the xz_type of pFace-cFace edge.
 */
const POS_TABLE = {
    xn: [-HALF_UNIT, 0, 0],
    zp: [0, 0, +HALF_UNIT],
    xp: [+HALF_UNIT, 0, 0],
    zn: [0, 0, -HALF_UNIT],
};

/** Relative rotation numbers for an pFace-cFace edge. */
const ROT_TABLE = {
    down:  {right: 0, back: 0, left: 0, front: 0},
    top:   {right: 2, front: 0, left: 2, back: 0},
    front: {right: 3, left: 1, top: 0},
    back:  {right: 1, top: 0, left: 3},
    left:  {back: 1, top: 2, front: 3},
    right: {top: 2, back: 3, front: 1},
};

/** Specifies the rotation axis and cube bounds for xz_type edges. */
const ROT_AXIS_AND_BOUND = {
    xp: {axis: 'z', cubeBound: +HALF_PI},
    xn: {axis: 'z', cubeBound: -HALF_PI},
    zp: {axis: 'x', cubeBound: -HALF_PI},
    zn: {axis: 'x', cubeBound: +HALF_PI},
};

/**
 * Computes the hierarchical structure and relative rotations of cube net faces
 * starting from a base face. It traverses the outline matrix recursively to:
 * 
 * 1. Build a labeled hierarchy matrix (`hierMatrix`) where each face is marked
 *    with its label and rotation number.
 * 2. Generate an assembly guide (`guide`) recording parent-child relationships
 *    and rotation (in radians) needed to align each face with its parent.
 * 
 * @param {number[][]} outlineMatrix - 8x8 zero-one-matrix  (1 = face present)
 * @param {{rid: number, cid: number}} base - coordinate of the 'down' face
 * @returns {{ 
 *      hierMatrix: string[][], 
 *      guide: Array<{
 *          parentFace: string, 
 *          childFace: string, 
 *          rotationRad: number,
 *          position: [number],
 *          xzType: string,
 *      }> 
 * }}
 */
export function computeHierarchyGuide(outlineMatrix, base) {
    // Init hierarchy matrix and assembly guide
    const hierMatrix = outlineMatrix.map(row => 
        row.map(cell => (cell === 1 ? 'xx' : '__'))
    );
    const guide = [];

    // Define a dfs helper
    function dfs(parentLabel, parentDir, edgeType, currLabel, r, c) {
        if (r < 0 || r === 8 || c < 0 || c === 8 || hierMatrix[r][c] !== 'xx') {
            return;
        }
        // process current cell
        let currRotNum = 0;
        let neibFace = FACE_EDGE_DISC[currLabel].slice();
        let edgeList = ['xp', 'zn', 'xn', 'zp'];

        // rotate edge-disc
        while (currLabel !== 'down' && parentLabel !== neibFace[parentDir]) {
            neibFace.unshift(neibFace.pop());
            edgeList.unshift(edgeList.pop());
            currRotNum++;

            if (currRotNum >= 4) {
                throw new Error('Invalid currRot increment');
            }
        }
        // concat label and rotation number
        hierMatrix[r][c] = currLabel.charAt(0).toUpperCase() + currRotNum;

        // add a piece of record to the guide
        if (currLabel !== 'down') {
            guide.push({
                parentFace: parentLabel,
                childFace: currLabel,
                rotationRad: ROT_TABLE[parentLabel][currLabel] * HALF_PI,
                position: POS_TABLE[edgeType],
                xzType: edgeType,
            });
        }
        // Process child-nodes recursively 
        dfs(currLabel, 2, edgeList[0], neibFace[0], r, c + 1);
        dfs(currLabel, 3, edgeList[1], neibFace[1], r - 1, c);
        dfs(currLabel, 0, edgeList[2], neibFace[2], r, c - 1);
        dfs(currLabel, 1, edgeList[3], neibFace[3], r + 1, c);
    }

    // Run dfs to build hierMatrix and assembling Guide
    dfs(null, -1, null, 'down', base.rid, base.cid, 0);

    return { hierMatrix, guide };
}


/** 
 * Returns a list of {rid, cid} for each face in the outlineMatrix
 */
export function getFacesCoordinate(outlineMatrix) {
    const facesList = [];
    for (let r = 0; r < 8; ++r) {
        for (let c = 0; c < 8; ++c) {
            if (outlineMatrix[r][c] === 1) {
                facesList.push({rid: r, cid: c});
            }
        }
    }
    return facesList;
}


/**
 * Detaches and resets all face transforms except for the base face ('down').
 */
export function deconstructMeshHierarchy(facesRef) {
    for (const [label, face] of Object.entries(facesRef)) {
        if (label === 'down') continue;

        const group = face.ref?.current;
        if (!group) continue;

        if (group.parent) {
            group.parent.remove(group); // Remove from scene graph
        }
        group.position.set(0, 0, 0);
        group.rotation.set(0, 0, 0);
    }

    // Anchor 'down' at origin (optional safety)
    const down = facesRef.down?.ref?.current;
    if (down) {
        down.position.set(0, 0, 0);
        down.rotation.set(0, 0, 0);
    }
}


/**
 * Rebuilds the cube face hierarchy based on the provided assembly guide.
 */
export function rebuildMeshHierarchy(facesRef, guide) {
    if (!facesRef || !guide) {
        return;
    }
    deconstructMeshHierarchy(facesRef);

    // Rebuild the hierarchy based on the guide
    for (const { parentFace, childFace, rotationRad, position } of guide) {
        // Get the parent and child objects
        const parentEdgeGroup = facesRef[parentFace]?.[childFace]?.current;
        const childGroup = facesRef[childFace]?.ref?.current;

        if (!parentEdgeGroup || !childGroup) {
            console.warn(`Failed to rebind ${childFace} to ${parentFace}.`);
            continue;
        }
        // Attach to parent and adjust child transformation
        parentEdgeGroup.add(childGroup);
        childGroup.position.set(...position);
        childGroup.rotation.set(0, rotationRad, 0);
    }
}


/** Animation update function */
export function updateCubeNetAnimation(animationMode, t, guide, facesRef) {
    if (!guide || !facesRef) {
        return;
    }
    const tValues = computeTValues(animationMode, t);

    for (let i = 0; i < 5; ++i) {
        // access guide record
        const { parentFace, childFace, xzType } = guide[i];
        const { axis, cubeBound } = ROT_AXIS_AND_BOUND[xzType];
        
        // rotate edge
        const edge = facesRef[parentFace]?.[childFace]?.current;
        edge.rotation[axis] = tValues[i] * cubeBound; 
    }
}


/**
 * Compute t values for each animation mode.
 */
function computeTValues(animationMode, t) {
    if (animationMode === 'compact') {
        return Array(5).fill(t / 100);
    }
    const tValues = Array(5).fill(0);
    let temp = t;
    for (let i = 0; i < 5; ++i) {
        if (temp <= 0) {
            break;
        }
        tValues[i] = Math.min(temp / 20, 1);
        temp -= 20;
    }

    if (animationMode === 'rootFirst') {
        return tValues;
    }
    if (animationMode === 'leaveFirst') {
        return tValues.reverse();
    }
    return Array(5).fill(1);
}


/** Checks all mesh refs are ready. */
export function checkAllMeshRefs(facesRef) {
    const faceLabels = ['down', 'top', 'front', 'back', 'left', 'right'];
    const faceFieldRefs = ['ref', 'skin', 'labelRef', 'xp', 'xn', 'zp', 'zn'];
    
    for (const label of faceLabels) {
        const face = facesRef.current[label];
        if (!face) {
            console.warn('[Loading mesh ref...]');
            return false;
        }

        for (const key of faceFieldRefs) {
            if (!face[key] || !face[key].current) {
                console.warn('[Loading mesh ref...]');
                return false;
            }
        }
    }
    console.log('[Ref Check Passed]');
    return true;
}
