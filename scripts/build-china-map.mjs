/**
 * Builds src/data/chinaMap.ts from the DataV province boundary GeoJSON.
 *
 * The reference site inlines around 840KB of unnamed province paths, which
 * cannot be highlighted reliably. This script projects the public boundary
 * data, drops sub-pixel detail, and emits one named path per province plus the
 * projected positions of the places this site has actually visited.
 *
 * Usage: node scripts/build-china-map.mjs <path-to-100000_full.json>
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const source = process.argv[2] ?? path.join(os.tmpdir(), "china-100000.json");
const OUT = path.join(process.cwd(), "src", "data", "chinaMap.ts");

const VIEW_W = 1000;
const VIEW_H = 700;
const PAD = 16;
/** Latitude used for the aspect correction of an equirectangular projection. */
const REF_LAT = 35;
const LAT_SCALE = Math.cos((REF_LAT * Math.PI) / 180);

/** Places that appear on the map, with their real coordinates. */
const PLACES = [
  { name: "杭州", province: "浙江省", lng: 120.153, lat: 30.287, kind: "home" },
  { name: "厦门", province: "福建省", lng: 118.089, lat: 24.479, kind: "visited" },
  { name: "武功山", province: "江西省", lng: 114.178, lat: 27.458, kind: "visited" },
  { name: "广州", province: "广东省", lng: 113.264, lat: 23.129, kind: "visited" },
  { name: "长沙", province: "湖南省", lng: 112.939, lat: 28.228, kind: "visited" },
];

function readGeoJson(file) {
  const raw = JSON.parse(fs.readFileSync(file, "utf8"));
  if (raw.type !== "FeatureCollection") throw new Error("Expected a FeatureCollection");
  return raw.features;
}

/** Walk every ring of a Polygon / MultiPolygon feature. */
function ringsOf(feature) {
  const { type, coordinates } = feature.geometry;
  if (type === "Polygon") return coordinates;
  if (type === "MultiPolygon") return coordinates.flat();
  return [];
}

function collectBounds(features) {
  let minLng = Infinity;
  let maxLng = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;
  for (const feature of features) {
    for (const ring of ringsOf(feature)) {
      for (const [lng, lat] of ring) {
        if (lng < minLng) minLng = lng;
        if (lng > maxLng) maxLng = lng;
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
      }
    }
  }
  return { minLng, maxLng, minLat, maxLat };
}

function makeProjector(bounds) {
  const widthUnits = (bounds.maxLng - bounds.minLng) * LAT_SCALE;
  const heightUnits = bounds.maxLat - bounds.minLat;
  const scale = Math.min((VIEW_W - PAD * 2) / widthUnits, (VIEW_H - PAD * 2) / heightUnits);
  const offsetX = (VIEW_W - widthUnits * scale) / 2;
  const offsetY = (VIEW_H - heightUnits * scale) / 2;

  return {
    project: ([lng, lat]) => [
      offsetX + (lng - bounds.minLng) * LAT_SCALE * scale,
      offsetY + (bounds.maxLat - lat) * scale,
    ],
  };
}

/** Douglas-Peucker simplification on projected points. */
function simplify(points, tolerance) {
  if (points.length <= 4) return points;
  const sqTolerance = tolerance * tolerance;

  const sqSegDist = (p, a, b) => {
    let x = a[0];
    let y = a[1];
    let dx = b[0] - x;
    let dy = b[1] - y;
    if (dx !== 0 || dy !== 0) {
      const t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);
      if (t > 1) {
        x = b[0];
        y = b[1];
      } else if (t > 0) {
        x += dx * t;
        y += dy * t;
      }
    }
    dx = p[0] - x;
    dy = p[1] - y;
    return dx * dx + dy * dy;
  };

  const markers = new Uint8Array(points.length);
  markers[0] = 1;
  markers[points.length - 1] = 1;

  const stack = [[0, points.length - 1]];
  while (stack.length) {
    const [first, last] = stack.pop();
    let maxSqDist = 0;
    let index = 0;
    for (let i = first + 1; i < last; i += 1) {
      const sqDist = sqSegDist(points[i], points[first], points[last]);
      if (sqDist > maxSqDist) {
        index = i;
        maxSqDist = sqDist;
      }
    }
    if (maxSqDist > sqTolerance) {
      markers[index] = 1;
      stack.push([first, index], [index, last]);
    }
  }

  return points.filter((_, index) => markers[index]);
}

const round = (value) => Math.round(value * 10) / 10;

function main() {
  const features = readGeoJson(source);
  const bounds = collectBounds(features);
  const { project } = makeProjector(bounds);

  const provinces = [];
  for (const feature of features) {
    const name = feature.properties?.name ?? "未知";
    const pieces = [];
    for (const ring of ringsOf(feature)) {
      const projected = simplify(ring.map(project), 0.8);
      if (projected.length < 4) continue;
      pieces.push(
        projected
          .map(([x, y], index) => `${index === 0 ? "M" : "L"}${round(x)},${round(y)}`)
          .join("") + "Z"
      );
    }
    if (pieces.length) provinces.push({ name, d: pieces.join("") });
  }

  const places = PLACES.map((place) => {
    const [x, y] = project([place.lng, place.lat]);
    const { lng, lat, ...rest } = place;
    void lng;
    void lat;
    return { ...rest, x: round(x), y: round(y) };
  });

  const output = `// Generated by scripts/build-china-map.mjs from DataV province boundaries.
// Do not edit by hand; re-run the script to regenerate.

export type MapProvince = { name: string; d: string };
export type MapPlace = {
  name: string;
  province: string;
  kind: "home" | "visited";
  x: number;
  y: number;
};

export const chinaMapViewBox = "0 0 ${VIEW_W} ${VIEW_H}";

export const chinaProvinces: MapProvince[] = ${JSON.stringify(provinces)};

export const mapPlaces: MapPlace[] = ${JSON.stringify(places)};
`;

  fs.writeFileSync(OUT, output, "utf8");
  const kb = (fs.statSync(OUT).size / 1024).toFixed(1);
  console.log(`Wrote ${provinces.length} provinces + ${places.length} places to ${OUT} (${kb} KB)`);
}

main();
