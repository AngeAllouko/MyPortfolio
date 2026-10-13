// Générateurs de formes organiques (façon Haikei) : blobs et vagues en SVG.

/** Générateur pseudo-aléatoire déterministe : même graine → même forme. */
export function seeded(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 10000) / 10000;
  };
}

type Pt = [number, number];
const f = (n: number) => n.toFixed(1);

/** Courbe lisse passant par tous les points (Catmull-Rom convertie en Bézier). */
function smooth(points: Pt[], closed: boolean) {
  const n = points.length;
  const at = (i: number) =>
    closed ? points[(i + n) % n] : points[Math.max(0, Math.min(n - 1, i))];
  let d = `M${f(points[0][0])},${f(points[0][1])}`;
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${f(c1[0])},${f(c1[1])} ${f(c2[0])},${f(c2[1])} ${f(p2[0])},${f(p2[1])}`;
  }
  return closed ? d + "Z" : d;
}

/** Blob fermé centré sur (cx, cy). Le nombre de commandes ne dépend que de `points`. */
export function blobPath(
  cx: number,
  cy: number,
  radius: number,
  seed: number,
  points = 7,
  variance = 0.28,
) {
  const rand = seeded(seed);
  const pts: Pt[] = [];
  for (let i = 0; i < points; i++) {
    const a = (i / points) * Math.PI * 2;
    const r = radius * (1 - variance * rand());
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  return smooth(pts, true);
}

/**
 * Vague : bord supérieur ondulé à la hauteur `y`, remplie jusqu'en bas
 * de la zone (width × height).
 */
export function wavePath(
  width: number,
  height: number,
  y: number,
  amplitude: number,
  seed: number,
  points = 6,
) {
  const rand = seeded(seed);
  const pts: Pt[] = [];
  for (let i = 0; i <= points; i++) {
    pts.push([(i / points) * width, y + (rand() - 0.5) * 2 * amplitude]);
  }
  return `${smooth(pts, false)}L${width},${height}L0,${height}Z`;
}

/** Mélange deux couleurs hexadécimales (t = 0 → a, t = 1 → b). */
export function mix(a: string, b: string, t: number) {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (p: number, s: number) => (p >> s) & 255;
  const c = (s: number) => Math.round(ch(pa, s) + (ch(pb, s) - ch(pa, s)) * t);
  return `#${((c(16) << 16) | (c(8) << 8) | c(0)).toString(16).padStart(6, "0")}`;
}
