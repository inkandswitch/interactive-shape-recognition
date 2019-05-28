const calculateHull = require("convex-hull");
const calculateArea = require("area-polygon");

const SHAPE = {
  CIRCLE: "CIRCLE",
  LINE: "LINE",
  RECTANGLE: "RECTANGLE",
  UNKNOWN: "UNKNOWN"
};

const dist = ([ax, ay], [bx, by]) => Math.hypot(bx - ax, by - ay);

const last = xs => xs[xs.length - 1];

const calcPerimeter = points => {
  return points
    .slice(0, points.length - 1)
    .map((p, i) => [p, points[i + 1]])
    .map(([a, b]) => dist(a, b))
    .reduce((memo, d) => memo + d, 0);
};

const calcLargestTriangle = points => {
  const len = points.length;

  let maxArea = 0;
  let maxPoints = null;

  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len; j++) {
      for (let k = 0; k < len; k++) {
        if (i !== j && i !== k && k !== j) {
          const triangle = [points[i], points[j], points[k]];
          const triangleArea = calculateArea(triangle);

          if (triangleArea > maxArea) {
            maxArea = triangleArea;
            maxPoints = triangle.slice(0);
          }
        }
      }
    }
  }

  return {
    area: maxArea,
    points: maxPoints
  };
};

const calcEnclosingRect = points => {
  const minX = Math.min(...points.map(p => p[0]));
  const minY = Math.min(...points.map(p => p[1]));
  const maxX = Math.max(...points.map(p => p[0]));
  const maxY = Math.max(...points.map(p => p[1]));

  return [[minX, minY], [maxX, minY], [maxX, maxY], [minX, maxY]];
};

const detectShape = points => {
  const hullIdxs = calculateHull(points);

  const hull = hullIdxs
    .map(h => points[h[0]])
    .concat([points[last(hullIdxs)[1]]]);

  const hullPerimeter = calcPerimeter(hull); // Pch
  const pointsPerimeter = calcPerimeter(points); // Len

  const hullArea = calculateArea(hull); // Ach
  const hullPerimterSq = hullPerimeter * hullPerimeter; // Pch^2

  const largestHullTriangle = calcLargestTriangle(hull).area; // Alt

  const enclosingRect = calcEnclosingRect(points);
  const enclosingRectPerimetr = calcPerimeter(enclosingRect); // Per

  const rLenPch = pointsPerimeter / hullPerimeter;
  const rThinness = hullPerimterSq / hullArea;
  const rAltAch = largestHullTriangle / hullArea;
  const rPchPer = hullPerimeter / enclosingRectPerimetr;

  const maybeCircle =
    rThinness > 11 && rThinness < 14 && Math.abs(1 - rLenPch) < 0.1;
  const maybeLine = rThinness > 100;
  const maybeRectangle = Math.abs(1 - rLenPch) < 0.1 && rAltAch > 0.5;

  const shape = maybeCircle
    ? SHAPE.CIRCLE
    : maybeLine
    ? SHAPE.LINE
    : maybeRectangle
    ? SHAPE.RECTANGLE
    : SHAPE.UNKNOWN;

  return {
    shape,

    maybeCircle,
    maybeRectangle,
    maybeLine,

    enclosingRect,
    hull,

    rLenPch,
    rThinness,
    rAltAch,
    rPchPer
  };
};

module.exports = detectShape;
