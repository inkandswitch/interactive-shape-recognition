# Interactive Shape Recognition

Implementaion of "A Simple Approach to Recognise Geometric Shapes Interactively" by Joaquim A. Jorge and Manuel J. Fonseca.

## Installation

```bash
npm i Interactive-shape-recognition
```

## Usage

```js
const detectShape = require("Interactive-shape-recognition");

const points = [
  // .. [x, y] positions ..
];

const { shape } = detectShape(points)

// shape is one of: "CIRCLE", "LINE", "RECTANGLE", "UNKNOWN"
```


