/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import {S_INT_16_MIN, S_INT_32_MIN, S_INT_8_MIN, U_INT_16_MAX, U_INT_32_MAX, U_INT_8_MAX} from "./DataTypeRanges";
import {Token} from "../Token";

export const enum BigIntType {
    BigUInt8 = Token.BigUInt8,
    BigUInt16 = Token.BigUInt16,
    BigUInt32 = Token.BigUInt32,
    BigUInt64 = Token.BigUInt64,
    BigSInt8 = Token.BigSInt8,
    BigSInt16 = Token.BigSInt16,
    BigSInt32 = Token.BigSInt32,
    BigSInt64 = Token.BigSInt64,
}

export function selectBestSuitableBigIntType(num: bigint): BigIntType {
    if(num > -1) {
        if(num <= U_INT_8_MAX) return BigIntType.BigUInt8;
        else if(num <= U_INT_16_MAX) return BigIntType.BigUInt16;
        else if(num <= U_INT_32_MAX) return  BigIntType.BigUInt32;
        else return BigIntType.BigUInt64;
    }
    else {
        if(num >= S_INT_8_MIN) return BigIntType.BigSInt8;
        else if(num >= S_INT_16_MIN) return BigIntType.BigSInt16;
        else if(num >= S_INT_32_MIN) return BigIntType.BigSInt32;
        else return BigIntType.BigSInt64;
    }
}

export const BIG_INT_TYPE_BYTE_LENGTH: Record<BigIntType,number> = {
    [BigIntType.BigUInt8]: 1,
    [BigIntType.BigSInt8]: 1,
    [BigIntType.BigUInt16]: 2,
    [BigIntType.BigSInt16]: 2,
    [BigIntType.BigUInt32]: 4,
    [BigIntType.BigSInt32]: 4,
    [BigIntType.BigUInt64]: 8,
    [BigIntType.BigSInt64]: 8,
}

export const VIEW_BIG_INT_SETTER_MAP: Record<BigIntType,(offset: number, num: bigint, view: DataView) => void> = {
    [BigIntType.BigUInt8]: (offset, num, view) => view.setUint8(offset,Number(num)),
    [BigIntType.BigSInt8]: (offset, num, view) => view.setInt8(offset,Number(num)),
    [BigIntType.BigUInt16]: (offset, num, view) => view.setUint16(offset,Number(num)),
    [BigIntType.BigSInt16]: (offset, num, view) => view.setInt16(offset,Number(num)),
    [BigIntType.BigUInt32]: (offset, num, view) => view.setUint32(offset,Number(num)),
    [BigIntType.BigSInt32]: (offset, num, view) => view.setInt32(offset,Number(num)),
    [BigIntType.BigUInt64]: (offset, num, view) => view.setBigUint64(offset,num),
    [BigIntType.BigSInt64]: (offset, num, view) => view.setBigInt64(offset,num),
}

export const VIEW_BIG_INT_READ_MAP: Record<BigIntType,(view: DataView, offset: number) => bigint> = {
    [BigIntType.BigUInt8]: (view,offset) => BigInt(view.getUint8(offset)),
    [BigIntType.BigSInt8]: (view,offset) => BigInt(view.getInt8(offset)),
    [BigIntType.BigUInt16]: (view,offset) => BigInt(view.getUint16(offset)),
    [BigIntType.BigSInt16]: (view,offset) => BigInt(view.getInt16(offset)),
    [BigIntType.BigUInt32]: (view,offset) => BigInt(view.getUint32(offset)),
    [BigIntType.BigSInt32]: (view,offset) => BigInt(view.getInt32(offset)),
    [BigIntType.BigUInt64]: (view,offset) => view.getBigUint64(offset),
    [BigIntType.BigSInt64]: (view,offset) => view.getBigInt64(offset)
}