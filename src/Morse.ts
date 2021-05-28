import { Transform, TransformCallback } from 'stream'
import MorseLib from "morse-lib"

export class EncodeStream extends Transform {
    static readonly morse = new MorseLib();

    constructor(private spaceAsWord: boolean = false) {
        super()
    }

    _transform(chunk: Buffer, encoding: BufferEncoding, callback: TransformCallback): void {
        const str = chunk.toString('utf-8')
        const encoded = EncodeStream.morse.encode(str);
        callback(null, this.spaceAsWord ? (str === " " ? "/" : encoded) : encoded)
    }
}