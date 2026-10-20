import { clamp, componentStyle, cx } from "./CanvasHost.jsx";
import { COMPONENT_ROOT_CLASS } from "./classNames.js";

const logCount = 7;
const streakCount = 10;

export function Campfire({
  height = 360,
  className,
  style,
  intensity = 1,
  sparks = true,
  logs = true,
  paused = false,
}) {
  const intensityValue = clamp(Number(intensity) || 1, 0.45, 1.8);

  return (
    <div
      className={cx(COMPONENT_ROOT_CLASS, className)}
      style={componentStyle(height, style, {
        "--mxac-campfire-core-scale": 0.76 * intensityValue,
        "--mxac-campfire-flame-duration": `${1.25 / intensityValue}s`,
        "--mxac-campfire-spark-duration": `${2 / intensityValue}s`,
        "--mxac-campfire-play-state": paused ? "paused" : "running",
      })}
    >
      <div
        className="aw-campfire"
        role="img"
        aria-label="Animated CSS campfire"
      >
        <div className="aw-campfire-stage">
          <div className="aw-campfire-core">
            {sparks ? (
              <div className="aw-sparks">
                {Array.from({ length: 8 }, (_, index) => (
                  <span className="aw-spark" key={index} />
                ))}
              </div>
            ) : null}
            <div className="aw-fire aw-fire-red">
              {Array.from({ length: 7 }, (_, index) => (
                <span className="aw-flame" key={index} />
              ))}
            </div>
            <div className="aw-fire aw-fire-orange">
              {Array.from({ length: 7 }, (_, index) => (
                <span className="aw-flame" key={index} />
              ))}
            </div>
            <div className="aw-fire aw-fire-yellow">
              {Array.from({ length: 5 }, (_, index) => (
                <span className="aw-flame" key={index} />
              ))}
            </div>
            <div className="aw-fire aw-fire-white">
              {Array.from({ length: 6 }, (_, index) => (
                <span className="aw-flame" key={index} />
              ))}
            </div>
            <div className="aw-sticks">
              {Array.from({ length: 4 }, (_, index) => (
                <span className="aw-stick" key={index} />
              ))}
            </div>
            {logs ? (
              <div className="aw-logs">
                {Array.from({ length: logCount }, (_, logIndex) => (
                  <span className="aw-log" key={logIndex}>
                    {Array.from({ length: streakCount }, (_, streakIndex) => (
                      <span className="aw-log-streak" key={streakIndex} />
                    ))}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
