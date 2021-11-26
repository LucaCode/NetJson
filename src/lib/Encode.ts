/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import {Token} from "./Token";
import {
    NUMBER_TYPE_BYTE_LENGTH,
    selectBestSuitableNumberType,
    VIEW_NUMBER_SETTER_MAP,
    selectBestSuitablePositiveUNumberType
} from "./utils/NumberUtils";
import {
    NUMBER_TYPE_TO_BINARY_TOKEN,
    NUMBER_TYPE_TO_OBJECT_START_TOKEN,
    NUMBER_TYPE_TO_PAIR_TOKEN,
    NUMBER_TYPE_TO_STRING_TOKEN
} from "./TokenTranslationMaps";
import {BIG_INT_TYPE_BYTE_LENGTH, selectBestSuitableBigIntType, VIEW_BIG_INT_SETTER_MAP} from "./utils/BigIntUtils";

type EncodeCache = any[] & {byteLength: number};
const textEncoder = new TextEncoder();

const IGNORE_PROPERTY_VALUE_TYPES_MAP = {
    "undefined": true,
    "symbol": true,
    "function": true,
}

const TypeEncoderMap: Record<string,(value: any, arr: EncodeCache,
                                     pairValue: boolean, arrayItem: boolean) => any> = {
    'object': (value,arr,pairValue,arrayItem) => {
        if(Array.isArray(value)) {
            if(value.length === 0) {
                arr.push(Token.EmptyArray);
                arr.byteLength++;
            }
            else {
                arr.push(Token.ArrayStart);
                arr.byteLength++;
                const arrLen = value.length;
                for(let i = 0; i < arrLen; i++) createEncodeCached(value[i],arr,false,true);
                if(arrayItem) {
                    arr.push(Token.ContainerEnd);
                    arr.byteLength++;
                }
            }
        }
        else if(value instanceof ArrayBuffer) {
            const numType = selectBestSuitablePositiveUNumberType(value.byteLength);
            arr.push(NUMBER_TYPE_TO_BINARY_TOKEN[numType],numType,value);
            arr.byteLength += 1 + NUMBER_TYPE_BYTE_LENGTH[numType]! + value.byteLength;
        }
        else if(value){
            const keys = Object.keys(value);
            if(keys.length === 0) {
                arr.push(Token.EmptyObject);
                arr.byteLength++;
            }
            else {
                const kLen = keys.length;
                let processedI = 0;
                for(let i = 0, propValue; i < kLen; i++) {
                    propValue = value[keys[i]];
                    if(IGNORE_PROPERTY_VALUE_TYPES_MAP[typeof propValue]) continue;

                    const keyBuffer = textEncoder.encode(keys[i]);
                    const numType = selectBestSuitablePositiveUNumberType(keyBuffer.byteLength);
                    arr.push(
                        (processedI > 0 ? NUMBER_TYPE_TO_PAIR_TOKEN : NUMBER_TYPE_TO_OBJECT_START_TOKEN)[numType],
                        numType,keyBuffer);
                    arr.byteLength += 1 + NUMBER_TYPE_BYTE_LENGTH[numType]! + keyBuffer.byteLength;
                    createEncodeCached(propValue,arr,true,false);
                    processedI++;
                }
                if(processedI === 0) {
                    arr.push(Token.EmptyObject);
                    arr.byteLength++;
                }
                else if(pairValue) {
                    arr.push(Token.ContainerEnd);
                    arr.byteLength++;
                }
            }
        }
        else {
            arr.push(Token.Null);
            arr.byteLength++;
        }
    },
    'string': (str,arr) => {
        const buffer = textEncoder.encode(str);
        const numType = selectBestSuitablePositiveUNumberType(buffer.byteLength);
        arr.push(NUMBER_TYPE_TO_STRING_TOKEN[numType],numType,buffer);
        arr.byteLength += 1 + NUMBER_TYPE_BYTE_LENGTH[numType]! + buffer.byteLength;
    },
    'number': (num,arr) => {
        const numType = selectBestSuitableNumberType(num);
        //numType is compatible with token numbers
        arr.push(numType as unknown as Token,numType,num);
        arr.byteLength += 1 + NUMBER_TYPE_BYTE_LENGTH[numType];
    },
    'bigint': (num: bigint,arr) => {
        const bigIntType = selectBestSuitableBigIntType(num);
        //bigintType is compatible with token bigints
        arr.push(bigIntType as unknown as Token,bigIntType,num);
        arr.byteLength += 1 + BIG_INT_TYPE_BYTE_LENGTH[bigIntType];
    },
    'boolean': (bool,arr) => {
        arr.push(bool ? Token.True : Token.False);
        arr.byteLength++;
    },
    "undefined": () => {},
    "symbol": () =>{},
    "function": () => {},
}

function newEncodeCache(): EncodeCache {
    const arr = [] as unknown as EncodeCache;
    arr.byteLength = 0;
    return arr;
}

/**
 * Builds a lightweight structured array cache,
 * to allocate the exact size and build the binary faster.
 * @param value
 *  @param distCache
 * @param pairValue
 * @param arrayItem
 */
function createEncodeCached(value: any, distCache: EncodeCache = newEncodeCache(),
                            pairValue = false, arrayItem = false): EncodeCache
{
    TypeEncoderMap[typeof value](value,distCache,pairValue,arrayItem);
    return distCache;
}

function buildBinary(encodeCache: EncodeCache): ArrayBuffer {
    const buffer = new ArrayBuffer(encodeCache.byteLength), length = encodeCache.length;
    const view = new DataView(buffer);
    const uInt8ArrayView = new Uint8Array(buffer);

    let i = 0, bOffset = 0, token;
    while(i < length) {
        token = encodeCache[i];
        if(token > 100 && token < 145) {
            // string | object start | pair | binary | continue
            view.setUint8(bOffset++,token);
            const lenNumberType: number = encodeCache[++i],
                value: Uint8Array = encodeCache[++i];
            VIEW_NUMBER_SETTER_MAP[lenNumberType](bOffset,value.byteLength,view);
            bOffset += NUMBER_TYPE_BYTE_LENGTH[lenNumberType];
            uInt8ArrayView.set(value,bOffset);
            bOffset += value.byteLength;
        }
        else if(token > 0 && token < 9) {
            //number
            view.setUint8(bOffset++,token);
            const numberType = encodeCache[++i];
            VIEW_NUMBER_SETTER_MAP[numberType](bOffset,encodeCache[++i],view);
            bOffset += NUMBER_TYPE_BYTE_LENGTH[numberType];
        }
        else if(token > 20 && token < 35) {
            //bigint
            view.setUint8(bOffset++,token);
            const bigIntType = encodeCache[++i];
            VIEW_BIG_INT_SETTER_MAP[bigIntType](bOffset,encodeCache[++i],view);
            bOffset += BIG_INT_TYPE_BYTE_LENGTH[bigIntType];
        }
        else view.setUint8(bOffset++,token);
        i++;
    }
    return buffer;
}

export function encode(value: any): ArrayBuffer {
    if(value === undefined) return new ArrayBuffer(0);
    return buildBinary(createEncodeCached(value));
}

