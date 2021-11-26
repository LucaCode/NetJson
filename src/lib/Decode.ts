/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import {Token} from "./Token";
import {NUMBER_TYPE_BYTE_LENGTH, NumberType, VIEW_NUMBER_READ_MAP} from "./utils/NumberUtils";
import {BIG_INT_TYPE_BYTE_LENGTH, BigIntType, VIEW_BIG_INT_READ_MAP} from "./utils/BigIntUtils";
import {TOKEN_TO_NUMBER_TYPE} from "./TokenTranslationMaps";
import JsonNetDecodeError from "./JsonNetDecodeError";

type DecodeCache = any[] & {iOffset: number};
const textDecoder = new TextDecoder();

function newDecodeCache(offset: number = 0): DecodeCache {
    const arr = [] as unknown as DecodeCache;
    arr.iOffset = offset;
    return arr;
}

export function decode<T = any>(buffer: ArrayBuffer, offset: number = 0): T {
    try {
        if(buffer.byteLength === 0) return undefined as any;
        return innerDecode(new DataView(buffer),newDecodeCache(offset));   
    }
    catch (err: any) {throw new JsonNetDecodeError(err);}
}

function decodeNumber(numType: NumberType, view: DataView, cache: DecodeCache): number {
    const num = VIEW_NUMBER_READ_MAP[numType](view,cache.iOffset);
    cache.iOffset += NUMBER_TYPE_BYTE_LENGTH[numType];
    return num;
}

function decodeBigInt(bigIntType: BigIntType, view: DataView, cache: DecodeCache): bigint {
    const value = VIEW_BIG_INT_READ_MAP[bigIntType](view,cache.iOffset);
    cache.iOffset += BIG_INT_TYPE_BYTE_LENGTH[bigIntType];
    return value;
}

/**
 * Also works with object pair keys.
 * @param token
 * @param view
 * @param cache
 */
function decodeString(token: Token, view: DataView, cache: DecodeCache): string {
    const length = decodeNumber(TOKEN_TO_NUMBER_TYPE[token]!,view,cache);
    const str = textDecoder.decode(new Uint8Array(view.buffer,cache.iOffset,length));
    cache.iOffset += length;
    return str;
}

function decodeObject(token: Token, view: DataView, cache: DecodeCache) {
    const obj = {};
    cache.push(obj);
    cache.iOffset--;
    do {
        cache.iOffset++;
        obj[decodeString(token,view,cache)] = innerDecode(view,cache);
        if(cache.iOffset >= view.byteLength) break;
        token = view.getUint8(cache.iOffset);
    }
    while (token > 120 && token < 125 && token !== Token.ContainerEnd)
    if(token === Token.ContainerEnd) cache.iOffset++;
    cache.pop();
    return obj;
}

function decodeArray(view: DataView, cache: DecodeCache) {
    const arr: any[] = [];
    cache.push(arr);
    let token;
    do {
        arr.push(innerDecode(view,cache));
        if(cache.iOffset >= view.byteLength) break;
        token = view.getUint8(cache.iOffset);
    }
    while ((token < 121 || token > 124) && token !== Token.ContainerEnd)
    if(token === Token.ContainerEnd) cache.iOffset++;
    cache.pop();
    return arr;
}

function decodeBinary(token: Token, view: DataView, cache: DecodeCache) {
    const length = decodeNumber(TOKEN_TO_NUMBER_TYPE[token]!,view,cache);
    const binary = view.buffer.slice(cache.iOffset,cache.iOffset + length);
    cache.iOffset += length;
    return binary;
}

const CONSTANT_DECODE_MAP: Partial<Record<Token,() => any>> = {
    [Token.False]: () => false,
    [Token.True]: () => true,
    [Token.Null]: () => null,
    [Token.EmptyArray]: () => [],
    [Token.EmptyObject]: () => ({})
}

function innerDecode(view: DataView, cache: DecodeCache): any {
    const token: Token = view.getUint8(cache.iOffset);
    cache.iOffset++;

    if(token > 110 && token < 115) return decodeObject(token,view,cache);
    //numberType is compatible with token numbers
    else if(token > 0 && token < 9) return decodeNumber(token as unknown as NumberType,view,cache);
    //bigintType is compatible with token bigints
    else if(token > 20 && token < 35) return decodeBigInt(token as unknown as BigIntType,view,cache);
    else if(token === Token.ArrayStart) return decodeArray(view,cache);
    else if(token > 100 && token < 105) return decodeString(token,view,cache);
    else if(token > 130 && token < 135) return decodeBinary(token,view,cache);
    else return CONSTANT_DECODE_MAP[token]!();
}