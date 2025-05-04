export default class CubeNet {
    // we use a 8*8 matrix to define a cubenet 
    static SIZE = 8;
    // 11 primitive valid nets
    static VALID_NETS = [
        {   
            netId: 0,
            netName: 'Pickaxe',
            netCode: 411,
            mat: [
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,1,0,0,0,0,0],
                [0,0,1,1,1,1,0,0],
                [0,0,1,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
            ],
            isFlippable: false,
        },
        {
            netId: 1,
            netName: 'Pipe-wrench',
            netCode: 412,
            mat: [
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,1,0,0,0,0,0],
                [0,0,1,1,1,1,0,0],
                [0,0,0,1,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
            ],
            isFlippable: true,
        },
        {  
            netId: 2,
            netName: 'Pliers',
            netCode: 413,
            mat: [
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,1,0,0,0,0,0],
                [0,0,1,1,1,1,0,0],
                [0,0,0,0,1,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
            ],
            isFlippable: true,
        },
        {
            netId: 3,
            netName: 'Ring-spanner',
            netCode: 414,
            mat: [
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,1,0,0,0,0,0],
                [0,0,1,1,1,1,0,0],
                [0,0,0,0,0,1,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
            ],
            isFlippable: true,
        },
        {
            netId: 4,
            netName: 'Cross',
            netCode: 422,
            mat: [
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,1,0,0,0,0],
                [0,0,1,1,1,1,0,0],
                [0,0,0,1,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
            ],
            isFlippable: false,
        },
        {  
            netId: 5,
            netName: 'Bone',
            netCode: 423,
            mat: [
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,1,0,0,0,0],
                [0,0,1,1,1,1,0,0],
                [0,0,0,0,1,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
            ],
            isFlippable: true,
        },
        {
            netId: 6,
            netName: 'Seahorse-1',
            netCode: 321,
            mat: [
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,1,1,0,0,0,0],
                [0,0,0,1,1,1,0,0],
                [0,0,0,1,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
            ],
            isFlippable: true,
        },
        {
            netId: 7,
            netName: 'Seahorse-2',
            netCode: 322,
            mat: [
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,1,1,0,0,0,0],
                [0,0,0,1,1,1,0,0],
                [0,0,0,0,1,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
            ],
            isFlippable: true,
        },
        {
            netId: 8,
            netName: 'Seahorse-3',
            netCode: 323,
            mat: [
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,1,1,0,0,0,0],
                [0,0,0,1,1,1,0,0],
                [0,0,0,0,0,1,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
            ],
            isFlippable: true,
        },
        {
            netId: 9,
            netName: 'Snake',
            netCode: 33,
            mat: [
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,1,1,1,0,0,0,0],
                [0,0,0,1,1,1,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
            ],
            isFlippable: true,
        },
        {
            netId: 10,
            netName: 'Stairs',
            netCode: 222,
            mat: [
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,1,1,0,0,0,0],
                [0,0,0,1,1,0,0,0],
                [0,0,0,0,1,1,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
            ],
            isFlippable: true,
        },
    ];

    // Create a valid cube net instance from netId
    static fromNetId(netId, flip = false, rotationNum = 0) {
        if (netId < 0 || netId >= CubeNet.VALID_NETS.length) {
            throw new Error(`Invalid netId: ${netId}`);
        }
        const net = CubeNet.VALID_NETS[netId];

        if (!net.isFlippable && flip) {
            throw new Error('Attempting to flip an non-flippable primitive net.');
        }
        if (![0, 1, 2, 3].includes(rotationNum)) {
            throw new Error(`Invalid rotationNum: ${rotationNum}`);
        }

        const instance = new CubeNet(true, net.mat, flip, rotationNum);
        instance._netMeta = Object.freeze({
            netId: netId,
            netName: net.netName,
            netCode: net.netCode,
            isFlippable: net.isFlippable,
            flip: flip,
            rotationNum: rotationNum,
        });
        return instance;
    }

    constructor(
        isValidCubeNet = undefined,
        baseMatrix = undefined,
        flip = false,  // Apply flip about y axis
        rotationNum = 0,
    ) {
        this.isValidCubeNet = isValidCubeNet;
        this.baseMatrix = baseMatrix;

        // We apply filp first, then do rotation
        this.flip = flip;

        // We assume X-axis points to left and Y-axis points to up in 2D plane
        this.rotationNum = rotationNum;

        // OutputMat is the matrix applied flip and rotation
        this.outputMatrix = this.#computeOutputMatrix();
        
    }

    #computeOutputMatrix() {
        // Create an zero-filled 8*8 matrix
        const transformedMatrix = Array.from(
            { length: CubeNet.SIZE }, 
            () => Array(CubeNet.SIZE).fill(0)
        );
        // Handle flip
        let tempMatrix = this.baseMatrix.map(row =>
            this.flip ? row.slice().reverse() : row.slice()
        );
        // Create a rotation mapping function
        const END = CubeNet.SIZE - 1;
        const getRotatedValue = (i, j) => {
            switch (this.rotationNum) {
                case 0:
                    return tempMatrix[i][j];
                case 1: // 90
                    return tempMatrix[j][END - i];
                case 2: // 180
                    return tempMatrix[END - i][END - j];
                case 3: // 270
                    return tempMatrix[END - j][i];
                default:
                    throw new Error(`Invalid rotationNum: ${this.rotationNum}`);
            }
        };
        // Apply rotation to outputMat
        for (let i = 0; i < CubeNet.SIZE; ++i) {
            for (let j = 0; j < CubeNet.SIZE; ++j) {
                transformedMatrix[i][j] = getRotatedValue(i, j);
            }
        }
        return transformedMatrix;
    }

    isValid() {
        return this.isValidCubeNet;
    }

    getOutputMatrix() {
        return this.outputMatrix.map(row => row.slice());
    }

    getMetaInfo() {
        return this._netMeta ?? null;
    }
}
