/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import "fast-text-encoding";
import {encode} from "./lib/Encode";
import {decode} from "./lib/Decode";
import JsonNetDecodeError from "./lib/JsonNetDecodeError";

const NetJson = {encode,decode};
export default NetJson;

export {
    encode,
    decode,
    JsonNetDecodeError
}