/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import {NumberType} from "./utils/NumberUtils";
import {Token} from "./Token";

export const NUMBER_TYPE_TO_STRING_TOKEN: Partial<Record<NumberType,Token>> = {
    [NumberType.UInt8]: Token.StringL8,
    [NumberType.UInt16]: Token.StringL16,
    [NumberType.UInt32]: Token.StringL32,
    [NumberType.Float64]: Token.StringL64,
}

export const NUMBER_TYPE_TO_OBJECT_START_TOKEN: Partial<Record<NumberType,Token>> = {
    [NumberType.UInt8]: Token.ObjectStartL8,
    [NumberType.UInt16]: Token.ObjectStartL16,
    [NumberType.UInt32]: Token.ObjectStartL32,
    [NumberType.Float64]: Token.ObjectStartL64,
}

export const NUMBER_TYPE_TO_PAIR_TOKEN: Partial<Record<NumberType,Token>> = {
    [NumberType.UInt8]: Token.PairL8,
    [NumberType.UInt16]: Token.PairL16,
    [NumberType.UInt32]: Token.PairL32,
    [NumberType.Float64]: Token.PairL64,
}

export const NUMBER_TYPE_TO_BINARY_TOKEN: Partial<Record<NumberType,Token>> = {
    [NumberType.UInt8]: Token.BinaryL8,
    [NumberType.UInt16]: Token.BinaryL16,
    [NumberType.UInt32]: Token.BinaryL32,
    [NumberType.Float64]: Token.BinaryL64,
}

export const TOKEN_TO_NUMBER_TYPE: Partial<Record<Token,NumberType>> = {
    [Token.UInt8]: NumberType.UInt8,
    [Token.SInt8]: NumberType.SInt8,
    [Token.UInt16]: NumberType.UInt16,
    [Token.SInt16]: NumberType.SInt16,
    [Token.UInt32]: NumberType.UInt32,
    [Token.SInt32]: NumberType.SInt32,
    [Token.Float32]: NumberType.Float32,
    [Token.Float64]: NumberType.Float64,
    [Token.ObjectStartL8]: NumberType.UInt8,
    [Token.ObjectStartL16]: NumberType.UInt16,
    [Token.ObjectStartL32]: NumberType.UInt32,
    [Token.ObjectStartL64]: NumberType.Float64,
    [Token.PairL8]: NumberType.UInt8,
    [Token.PairL16]: NumberType.UInt16,
    [Token.PairL32]: NumberType.UInt32,
    [Token.PairL64]: NumberType.Float64,
    [Token.StringL8]: NumberType.UInt8,
    [Token.StringL16]: NumberType.UInt16,
    [Token.StringL32]: NumberType.UInt32,
    [Token.StringL64]: NumberType.Float64,
    [Token.BinaryL8]: NumberType.UInt8,
    [Token.BinaryL16]: NumberType.UInt16,
    [Token.BinaryL32]: NumberType.UInt32,
    [Token.BinaryL64]: NumberType.Float64,
}