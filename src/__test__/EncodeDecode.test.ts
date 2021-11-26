/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import each from 'jest-each';
import {decode, encode} from "../index";

describe('EncodeDecode', () => {
    each([
        [{c: 'hallo', d: {}}],
        [undefined],
        [null],
        [10],
        [{c: 0, a: 3}],
        [{d: {}}],
        [new ArrayBuffer(200)],
        [new ArrayBuffer(20000)],
        [new ArrayBuffer(20000000)],
        [new ArrayBuffer(2000000000)],
        [BigInt(20)],
        [{["thisShouldBeALongPropertyName" + "..".repeat(20000)]: "longText".repeat(400)}],
        [{a: {b: {}},c:{},d: {}}],
        [true],
        [false],
        [[]],
        [{}],
        [-128,-32768,-2147483648,-5147483648,127,65535,32767,
            4294967295,2147483647,0,343.443,435352435325.435],
        [3400.233423,-34,-3454353.45],
        [Number.MAX_SAFE_INTEGER],
        [{coordinates: [[10,10,0],[200,23,13]], speed: 200, angle: 50, roll: true, pitch: false}],
        [[BigInt(40),BigInt(-400),BigInt(400),BigInt("90077199254740991"),
            BigInt(2000000),BigInt(200000000)]]
    ]).it('Should encode and decode correctly - %#', value => {
            expect(decode(encode(value))).toStrictEqual(value);
        });
});