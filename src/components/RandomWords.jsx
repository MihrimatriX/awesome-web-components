import { useMemo, useState } from "react";
import { componentStyle, cx } from "./CanvasHost.jsx";
import { COMPONENT_ROOT_CLASS } from "./classNames.js";

const WORDS = [
  "random words",
  "awesome",
  "spark",
  "motion",
  "pixel",
  "dream",
  "neon",
  "canvas",
  "orbit",
  "storm",
  "signal",
  "glow",
  "velocity",
  "matrix",
  "wonder",
  "react",
  "visual",
  "energy",
  "vector",
  "pulse",
  "rainbow",
  "comet",
  "particle",
  "midnight",
  "fire",
  "fluid",
  "gravity",
  "laser",
  "crystal",
  "echo",
  "future",
  "random",
  "words",
];

export function RandomWords({
  height = 320,
  className,
  style,
  words = WORDS,
  duration = 2000,
  suffix = "!",
  paused = false,
}) {
  const [index, setIndex] = useState(0);
  const [hue, setHue] = useState(350);
  const word = useMemo(
    () => words[index % words.length] ?? "awesome",
    [index, words],
  );
  const advanceWord = () => {
    setIndex((value) => value + 1 + Math.floor(Math.random() * 3));
    setHue((value) => (value + 47) % 360);
  };

  return (
    <div
      className={cx(COMPONENT_ROOT_CLASS, className)}
      style={componentStyle(height, style, {
        "--mxac-word-duration": `${Math.max(250, Number(duration) || 2000)}ms`,
        "--mxac-word-hue": hue,
        "--mxac-word-play-state": paused ? "paused" : "running",
      })}
    >
      <div className="aw-random-words" onAnimationIteration={advanceWord}>
        <svg role="img" aria-label={`${word}${suffix}`}>
          <title>
            {word}
            {suffix}
          </title>
          <g className="aw-random-words-layer">
            <text
              className="aw-random-words-shadow"
              dominantBaseline="central"
              fill="#222"
              stroke="#222"
              strokeLinecap="round"
              strokeWidth="1.5%"
              textAnchor="middle"
              textLength="86%"
              lengthAdjust="spacingAndGlyphs"
              x="50%"
              y="50%"
            >
              {word}
              {suffix}
            </text>
            <text
              className="aw-random-words-text"
              dominantBaseline="central"
              fill="white"
              textAnchor="middle"
              textLength="86%"
              lengthAdjust="spacingAndGlyphs"
              x="50%"
              y="50%"
            >
              {word}
              {suffix}
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}
