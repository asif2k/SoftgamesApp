export enum Easings {
    Linear = "Linear",
    BounceIn = "BounceIn",
    BounceOut = "BounceOut",
    BackOut = "BackOut",
    CubicOut = "CubicOut",
    /*
    SinusoidalIn = "SinusoidalIn",
    SinusoidalOut = "SinusoidalOut",
    SinusoidalInOut = "SinusoidalInOut",
    QuadraticIn = "QuadraticIn",
    QuadraticOut = "QuadraticOut",
    QuadraticInOut = "QuadraticInOut",
    CubicIn = "CubicIn",
    CubicOut = "CubicOut",
    CubicInOut = "CubicInOut",
    QuarticIn = "QuarticIn",
    QuarticOut = "QuarticOut",
    QuarticInOut = "QuarticInOut",
    QuinticIn = "QuinticIn",
    QuinticOut = "QuinticOut",
    QuinticInOut = "QuinticInOut",
    CircularIn = "CircularIn",
    CircularOut = "CircularOut",
    CircularInOut = "CircularInOut",
    ExponentialIn = "ExponentialIn",
    ExponentialOut = "ExponentialOut",
    ExponentialInOut = "ExponentialInOut",
    BackIn = "BackIn",
   
    BackInOut = "BackInOut",
    ElasticIn = "ElasticIn",
    ElasticOut = "ElasticOut",
    ElasticInOut = "ElasticInOut",
   
    BounceInOut = "BounceInOut"
    */
}


const EasingsFunc = {
    "Linear": function (t: number) {
        return t
    },
    "BounceIn": function (t: number) {
        return 1 - EasingsFunc.BounceOut(1 - t);
    },
    "BounceOut": function (t: number) {
        if (t < (1 / 2.75)) { return 7.5625 * t * t; }
        else if (t < (2 / 2.75)) { return 7.5625 * (t -= (1.5 / 2.75)) * t + 0.75; }
        else if (t < (2.5 / 2.75)) { return 7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375; }
        else { return 7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375; }
    },
    "BackOut": function (t: number) {
        return --t * t * ((1.70158 + 1) * t + 1.70158) + 1;
    },

    "CubicOut": function (t: number) {
        return (--t) * t * t + 1;
    },
}




export class AnimationBlock {
    public start: number = 0
    public length: number = 0
    public keyframes: number[] = []
    public values: number[] = []
    public easings: Easings[] = []
    public valueSize: number = 1
    public enabled: boolean = true
    public repeat: number = 1
    public result: number[] = []

    public keyName: string
    constructor(keyName: string, valueSize: number, start: number = 0, length: number = 1) {
        this.keyName = keyName
        this.valueSize = valueSize;
        this.start = start;
        this.length = length
        for (let i = 0; i < this.valueSize; i++) {
            this.result.push(0)
        }
    }

    public addKeyframe(time: number, easing: Easings, ...args: number[]) {
        this.keyframes.push(time);
        this.easings.push(easing)
        for (let i = 0; i < this.valueSize; i++) {
            this.values.push(args[i])
        }

    }
    public finalFrame() {
        const findex = (this.keyframes.length - 1) * this.valueSize;
        for (let i = 0; i < this.valueSize; i++) {
            this.result[i] = this.values[findex + i];
        }
    }
    public firstFrame() {
        const findex = 0;
        for (let i = 0; i < this.valueSize; i++) {
            this.result[i] = this.values[findex + i];
        }
    }
    public update(time: number) {
        let ftime = 0;
        let findex = 0;
        let i = 0;
        const keyframes = this.keyframes;

        if (keyframes.length > 2) {
            for (i = 0; i < keyframes.length; i++) {
                if (i > 0) {
                    if (time >= ftime && time <= keyframes[i] + 0.000001) {
                        findex = i;
                        break;
                    }
                }
                ftime = keyframes[i];
            }
        }
        else if (keyframes.length > 0) {
            findex = 1
        }


        if (findex > 0) {
            let index1 = findex - 1
            let index2 = findex;

            ftime = (time - keyframes[index1]) / (keyframes[index2] - keyframes[index1]);

            ftime = EasingsFunc[this.easings[index2]](ftime)
            index1 *= this.valueSize
            index2 *= this.valueSize

            const values = this.values;
            for (i = 0; i < this.valueSize; i++) {
                this.result[i] = values[index1 + i] + (values[index2 + i] - values[index1 + i]) * ftime;
            }




        }
    }
}




export class Animation {
    private _blocks: AnimationBlock[] = []
    public blocks = new Map<string, AnimationBlock>()
    public clock: number = 0

    public addBlock(block: AnimationBlock) {
        this._blocks.push(block);
        this.blocks.set(block.keyName, block)
    }
    public play(timeDelta: number, length: number) {

        this.update(this.clock / length)

        this.clock += timeDelta;


    }

    public complete() {
        let block;
        for (let bi = 0; bi < this._blocks.length; bi++) {
            block = this._blocks[bi];
            if (block.enabled === false) continue;
            block.finalFrame()
        }
    }

    public reset() {
        let block;
        this.clock = 0
        for (let bi = 0; bi < this._blocks.length; bi++) {
            block = this._blocks[bi];
            if (block.enabled === false) continue;
            block.firstFrame()
        }
    }

    public update(time: number) {
        let block
        let btime
        let inverseLength
        for (let bi = 0; bi < this._blocks.length; bi++) {
            block = this._blocks[bi]
            if (block.enabled === false) continue;
            inverseLength = 1 / block.length
            if (time > block.start) {

                if (block.repeat === 0) {
                    btime = ((time - block.start) % block.length) * inverseLength;
                }
                else if (time - block.start < block.repeat * block.length) {
                    btime = ((time - block.start) % block.length) * inverseLength;
                }
                else { continue; }

                block.update(btime)
            }
        }
    }
}

export class AnimationsPool {
    public free_animations: Animation[] = []
    public alocated: number = 0
    public freed: number = 0
    public get(): Animation | undefined {
        if (this.freed > 0) {
            return this.free_animations[--this.freed]
        }
        else {
            if (this.alocated > this.poolSize) return undefined
            this.alocated++;
            return this.creator()
        }
    }
    public free(animation: Animation) {

        this.free_animations[this.freed++] = animation;
    }

    constructor(public creator: () => Animation, public poolSize: number = 15) {

    }
}

export class Animator {
    public animations: Animation[] = []

}
