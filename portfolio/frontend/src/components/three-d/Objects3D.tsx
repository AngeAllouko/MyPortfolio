import type { CSSProperties, ReactNode } from "react";
import "./Objects3D.css";

/*
 * Objets informatiques en 3D, construits en CSS (pas de WebGL) :
 * nets à toutes les tailles, légers, et pilotables par Motion.
 */

type Face = "front" | "back" | "left" | "right" | "top" | "bottom";

function Box3D({
  w,
  h,
  d,
  faces = {},
  className,
}: {
  w: number;
  h: number;
  d: number;
  faces?: Partial<Record<Face, ReactNode>>;
  className?: string;
}) {
  const style = { "--w": `${w}px`, "--h": `${h}px`, "--d": `${d}px` } as CSSProperties;
  const list: Face[] = ["back", "bottom", "left", "right", "top", "front"];
  return (
    <div className={`box3d ${className ?? ""}`} style={style}>
      {list.map((f) => (
        <div key={f} className={`face face-${f}`}>
          {faces[f]}
        </div>
      ))}
    </div>
  );
}

/** Cube qui tourne, une notation de code sur chaque face. */
export function CodeCube({ size = 110 }: { size?: number }) {
  return (
    <div className="spin-cube">
      <Box3D
        w={size}
        h={size}
        d={size}
        className="code-cube"
        faces={{
          front: "</>",
          right: "{ }",
          back: "01",
          left: "( )",
          top: "#",
          bottom: ";",
        }}
      />
    </div>
  );
}

/** Touche de clavier vue en perspective ; elle s'enfonce au survol. */
export function Keycap({ label, wide = false, tone = "dark" }: { label: string; wide?: boolean; tone?: "dark" | "light" }) {
  return (
    <div className="keycap-tilt">
      <Box3D
        w={wide ? 170 : 100}
        h={100}
        d={34}
        className={`keycap keycap-${tone}`}
        faces={{ front: <span className="keycap-label">{label}</span> }}
      />
    </div>
  );
}

/** Processeur posé à plat, broches sur les quatre côtés. */
export function Chip() {
  return (
    <div className="chip-tilt">
      <Box3D
        w={140}
        h={140}
        d={16}
        className="chip"
        faces={{
          front: (
            <span className="chip-die">
              <span>CPU</span>
            </span>
          ),
        }}
      />
    </div>
  );
}

/** Accolades extrudées : le texte est empilé en profondeur. */
export function Braces({ text = "{ }" }: { text?: string }) {
  const layers = 14;
  return (
    <div className="braces">
      {Array.from({ length: layers }, (_, i) => (
        <span
          key={i}
          className="braces-layer"
          style={
            {
              transform: `translateZ(${-i * 1.6}px)`,
              "--shade": i === 0 ? 1 : 0.55 - (i / layers) * 0.3,
            } as CSSProperties
          }
        >
          {text}
        </span>
      ))}
    </div>
  );
}

/** Fenêtre de terminal épaisse, avec une commande qui se tape. */
export function Terminal3D({ command = "npm run dev" }: { command?: string }) {
  return (
    <div className="terminal-tilt">
      <Box3D
        w={280}
        h={180}
        d={12}
        className="terminal"
        faces={{
          front: (
            <div className="terminal-screen">
              <div className="terminal-bar">
                <i />
                <i />
                <i />
              </div>
              <p className="terminal-line">
                <span className="terminal-prompt">$</span>
                <span className="terminal-typed" style={{ "--chars": command.length } as CSSProperties}>
                  {command}
                </span>
              </p>
              <p className="terminal-out">✓ prêt en 312 ms</p>
            </div>
          ),
        }}
      />
    </div>
  );
}
