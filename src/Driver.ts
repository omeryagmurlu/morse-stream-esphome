import { Writable } from 'stream';

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

type MorseChar = '.' | '/' | ' ' | '-'
interface Timing {
    analog: boolean,
    duration: number,
    linger: boolean
}

export class Driver extends Writable {
    static readonly TIMINGS = new Map<MorseChar, Timing>([
        [' ', { analog: false, duration: 3, linger: false }],
        ['/', { analog: false, duration: 7, linger: false }],
        ['.', { analog: true, duration: 1, linger: true }],
        ['-', { analog: true, duration: 3, linger: true }]
    ])
    
    private prevLinger = false;

    constructor(private control: (b: boolean) => void, private base: number = 1000) {
        super()

        control(false) // set initial state
    }

    async _write(chunk: Buffer, encoding: BufferEncoding, callback: (error?: Error | null) => void): Promise<void> {
        const chars: MorseChar[] = chunk.toString('utf-8').split("") as MorseChar[]
        for (const c of chars) {
            if (!Driver.TIMINGS.has(c)) {
                return callback(new Error('unexpected value: ' + c))
            }
            const timing = Driver.TIMINGS.get(c)!;

            if (timing.linger && this.prevLinger) await sleep(this.base) // 1 unit between following duh dahs
            this.control(timing.analog);
            await sleep(timing.duration * this.base)
            this.control(false)

            this.prevLinger = timing.linger;
        }
        callback();
    }
}