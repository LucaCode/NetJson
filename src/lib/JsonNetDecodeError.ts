/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

export default class JsonNetDecodeError extends Error {
    constructor(public readonly innerErr: Error) {
        super("Failed to decode NetJson binary.");
    }
}