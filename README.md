# NetJson ✉️

## What is NetJson
***NetJson*** is a binary representation format of JSON.
It supports additional types like BigInts and binary data (in the form of ArrayBuffers). 
It was designed to be super small (Much fewer bytes than usual JSON string encoding). 
But keep in mind that encoding and decoding are way slower than JSON.stringify and parse. 
Because NetJson is entirely written in typescript and the native JSON string encoding and decoding are heavily optimized in V8.

## How to use NetJson

```typescript
import NetJson from "netjson";

const player = {
    name: "P1",
    position: [10,23,53],
    avatar: new ArrayBuffer(1000),
    score: BigInt(200),
    items: [{name: "HealPotion", price: 200},{name: "PowerPotion", price: 120}]
}
const encodedPlayerBinary = NetJson.encode(player);
const decodedPlayer = NetJson.decode(encodedPlayerBinary);
```

# Comparison to JSON.stringify/parse

On a MacBook Air M1, in Node.js Version: 16.13.0 LTS.

## Comparison - 1

### Data:
```typescript
[{
    name: "SomePerson",
    age: 30,
    cars: [],
    hobbies: ["Programming","Football"],
    dev: true
},{
    name: "SomePerson2",
    age: 24,
    cars: [
        {
            model: "MX1",
            color: "black",
            horsepower: 200,
            maxSpeed: 230
        }
    ],
    hobbies: ["Music","Cars"],
    dev: false
}];
```
### Results:
### Encode
- NetJson.encode: Bytes: 186, Time: 0.311 ms
- JSON.stringify: Bytes: 234, Time: 0.005 ms
### Decode
- NetJson.decode: Time: 0.329 ms
- JSON.parse: Time: 0.005 ms

## Comparison - 2

### Data:
```typescript
Array.from({ length: 10000 }, (_, id) => ({
    id,
    coordinates: Array.from({ length: 3 }, () =>
        Math.trunc(Math.random() * 1000000000)
    ),
    healthy: Math.random() > 0.5,
    power: Math.floor(Math.random() * 101),
    errors: [],
}));
```

### Results:
### Encode
- NetJson.encode: Bytes: 639.745, Time: 20.443 ms
- JSON.stringify: Bytes: 959.730, Time: 3.377 ms
### Decode
- NetJson.decode: Time: 49.657 ms
- JSON.parse: Time: 3.148 ms

## License

MIT License

Copyright (c) 2021 Ing. Luca Gian Scaringella

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.