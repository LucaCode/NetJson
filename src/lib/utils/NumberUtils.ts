/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import {S_INT_16_MIN, S_INT_32_MIN, S_INT_8_MIN, U_INT_16_MAX, U_INT_32_MAX, U_INT_8_MAX} from "./DataTypeRanges";
import {Token} from "../Token";

export const enum NumberType {
    UInt8 = Token.UInt8,
    SInt8 = Token.SInt8,
    UInt16 = Token.UInt16,
    SInt16 = Token.SInt16,
    UInt32 = Token.UInt32,
    SInt32 = Token.SInt32,
    Float32 = Token.Float32,
    Float64 = Token.Float64
}

//Polyfill
if (!Math.fround) {
    Math.fround = (function() {
        const temp = new Float32Array(1);
        return x => {
            temp[0] = +x;
            return temp[0];
        }
    })();
}

export function selectBestSuitablePositiveUNumberType(num: number): NumberType {
    if(num <= U_INT_8_MAX) return NumberType.UInt8;
    else if(num <= U_INT_16_MAX) return NumberType.UInt16;
    else if(num <= U_INT_32_MAX) return NumberType.UInt32;
    else return NumberType.Float64
}

export function selectBestSuitableNumberType(num: number): NumberType {
    if(num !== (num|0)) {
        //isFloat
        return Math.fround(num) === num ? NumberType.Float32 : NumberType.Float64;
    }
    else {
        if(num > -1) {
            if(num <= U_INT_8_MAX) return NumberType.UInt8;
            else if(num <= U_INT_16_MAX) return NumberType.UInt16;
            else if(num <= U_INT_32_MAX) return NumberType.UInt32;
            else return NumberType.Float64;
        }
        else {
            if(num >= S_INT_8_MIN) return NumberType.SInt8;
            else if(num >= S_INT_16_MIN) return NumberType.SInt16;
            else if(num >= S_INT_32_MIN) return NumberType.SInt32;
            else return NumberType.Float64;
        }
    }
}

export const NUMBER_TYPE_BYTE_LENGTH: Record<NumberType,number> = {
    [NumberType.UInt8]: 1,
    [NumberType.SInt8]: 1,
    [NumberType.UInt16]: 2,
    [NumberType.SInt16]: 2,
    [NumberType.UInt32]: 4,
    [NumberType.SInt32]: 4,
    [NumberType.Float32]: 4,
    [NumberType.Float64]: 8,
}

export const VIEW_NUMBER_SETTER_MAP: Record<NumberType,(offset: number, num: number, view: DataView) => void> = {
    [NumberType.UInt8]: (offset, num, view) => view.setUint8(offset,num),
    [NumberType.SInt8]: (offset, num, view) => view.setInt8(offset,num),
    [NumberType.UInt16]: (offset, num, view) => view.setUint16(offset,num),
    [NumberType.SInt16]: (offset, num, view) => view.setInt16(offset,num),
    [NumberType.UInt32]: (offset, num, view) => view.setUint32(offset,num),
    [NumberType.SInt32]: (offset, num, view) => view.setInt32(offset,num),
    [NumberType.Float32]: (offset, num, view) => view.setFloat32(offset,num),
    [NumberType.Float64]: (offset, num, view) => view.setFloat64(offset,num),
}

export const VIEW_NUMBER_READ_MAP: Record<NumberType,(view: DataView, offset: number) => number> = {
    [NumberType.UInt8]: (view,offset) => view.getUint8(offset),
    [NumberType.SInt8]: (view,offset) => view.getInt8(offset),
    [NumberType.UInt16]: (view,offset) => view.getUint16(offset),
    [NumberType.SInt16]: (view,offset) => view.getInt16(offset),
    [NumberType.UInt32]: (view,offset) => view.getUint32(offset),
    [NumberType.SInt32]: (view,offset) => view.getInt32(offset),
    [NumberType.Float32]: (view,offset) => view.getFloat32(offset),
    [NumberType.Float64]: (view,offset) => view.getFloat64(offset)
}