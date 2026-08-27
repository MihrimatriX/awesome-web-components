import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CanvasHost,
  TAU,
  componentStyle,
  cx,
  pointerPosition,
} from "./CanvasHost.jsx";
import { COMPONENT_ROOT_CLASS } from "./classNames.js";

function pad(value) {
  return value < 10 ? `0${value}` : `${value}`;
}

function dateFromValue(value) {
  if (value instanceof Date) return value;
  if (value === undefined || value === null) return new Date();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

function useClock(value) {
  const controlled = value !== undefined && value !== null;
  const [now, setNow] = useState(() => dateFromValue(value));

  useEffect(() => {
    if (controlled) {
      setNow(dateFromValue(value));
      return undefined;
    }

    const id = setInterval(() => setNow(new Date()), 250);
    return () => clearInterval(id);
  }, [controlled, value]);

  return now;
}

const digitRanges24 = [
  [0, 1, 2],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [0, 1, 2, 3, 4, 5],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [0, 1, 2, 3, 4, 5],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
];

const digitRanges12 = [
  [0, 1],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [0, 1, 2, 3, 4, 5],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [0, 1, 2, 3, 4, 5],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
];

const distanceClasses = [
  "visible",
  "close",
  "far",
  "far",
  "distant",
  "distant",
];

function slideDigitClass(active, value) {
  return distanceClasses[Math.abs(active - value)] ?? "";
}

export function SlideClock({
  height = 320,
  className,
  style,
  use24HourClock = true,
  showSeconds = true,
  value,
}) {
  const now = useClock(value);
  const allParts = [
    use24HourClock ? now.getHours() : now.getHours() % 12 || 12,
    now.getMinutes(),
    now.getSeconds(),
  ];
  const timeParts = showSeconds ? allParts : allParts.slice(0, 2);
  const time = timeParts.map(pad).join("").split("").map(Number);
  const digitRanges = (use24HourClock ? digitRanges24 : digitRanges12).slice(
    0,
    time.length,
  );
  const readableTime = timeParts.map(pad).join(":");

  return (
    <div
      className={cx(COMPONENT_ROOT_CLASS, className)}
      style={componentStyle(height, style)}
    >
      <div
        className="aw-slide-clock"
        aria-label={`Sliding digital clock ${readableTime}`}
      >
        <div className="aw-slide-clock-inner">
          {time.map((activeDigit, index) => (
            <span className="aw-slide-clock-part" key={`part-${index}`}>
              {index === 2 || index === 4 ? (
                <span className="aw-slide-colon">:</span>
              ) : null}
              <span
                className="aw-slide-column"
                style={{
                  transform: `translateY(calc(var(--mxac-resolved-height) / 2 - ${activeDigit}em - .5em))`,
                }}
                aria-hidden="true"
              >
                {digitRanges[index].map((value) => (
                  <span
                    className={cx(
                      "aw-slide-num",
                      slideDigitClass(activeDigit, value),
                    )}
                    key={value}
                  >
                    {value}
                  </span>
                ))}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

const SEGMENTS = {
  0: [0, 1, 2, 4, 5, 6],
  1: [2, 5],
  2: [0, 2, 3, 4, 6],
  3: [0, 2, 3, 5, 6],
  4: [1, 2, 3, 5],
  5: [0, 1, 3, 5, 6],
  6: [0, 1, 3, 4, 5, 6],
  7: [0, 2, 5],
  8: [0, 1, 2, 3, 4, 5, 6],
  9: [0, 1, 2, 3, 5, 6],
};

function SevenSegmentDigit({ value }) {
  const active = SEGMENTS[value] ?? SEGMENTS[0];

  return (
    <span className="aw-seven-digit" aria-hidden="true">
      {Array.from({ length: 7 }, (_, index) => (
        <span
          className={cx(
            "aw-seven-segment",
            active.includes(index) && "aw-active",
          )}
          key={index}
        />
      ))}
    </span>
  );
}

function NetworkBackground() {
  const start = useCallback(({ canvas, ctx, width, height }) => {
    let frameId = 0;
    const target = { x: width / 2, y: height / 2 };
    const points = [];

    for (let x = 0; x < width; x += width / 16) {
      for (let y = 0; y < height; y += height / 12) {
        const px = x + (Math.random() * width) / 16;
        const py = y + (Math.random() * height) / 12;
        points.push({
          x: px,
          y: py,
          ox: px,
          oy: py,
          vx: (Math.random() - 0.5) * 0.28,
          vy: (Math.random() - 0.5) * 0.28,
          closest: [],
        });
      }
    }

    points.forEach((point) => {
      point.closest = points
        .filter((candidate) => candidate !== point)
        .sort(
          (a, b) =>
            (point.x - a.x) ** 2 +
            (point.y - a.y) ** 2 -
            ((point.x - b.x) ** 2 + (point.y - b.y) ** 2),
        )
        .slice(0, 5);
    });

    const onPointerMove = (event) => {
      const pos = pointerPosition(event, canvas);
      target.x = pos.x;
      target.y = pos.y;
    };

    canvas.addEventListener("pointermove", onPointerMove);

    const anim = () => {
      frameId = requestAnimationFrame(anim);
      ctx.clearRect(0, 0, width, height);

      points.forEach((point) => {
        point.x += point.vx;
        point.y += point.vy;

        if (Math.abs(point.x - point.ox) > 34) point.vx *= -1;
        if (Math.abs(point.y - point.oy) > 34) point.vy *= -1;

        const d = (target.x - point.x) ** 2 + (target.y - point.y) ** 2;
        const alpha = d < 4000 ? 0.34 : d < 20000 ? 0.12 : d < 42000 ? 0.04 : 0;
        if (!alpha) return;

        point.closest.forEach((other) => {
          ctx.beginPath();
          ctx.moveTo(point.x, point.y);
          ctx.lineTo(other.x, other.y);
          ctx.strokeStyle = `rgba(156,217,249,${alpha})`;
          ctx.stroke();
        });

        ctx.beginPath();
        ctx.arc(point.x, point.y, 1.7, 0, TAU);
        ctx.fillStyle = `rgba(156,217,249,${Math.min(0.7, alpha * 2)})`;
        ctx.fill();
      });
    };

    anim();
    return () => {
      cancelAnimationFrame(frameId);
      canvas.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return (
    <CanvasHost
      start={start}
      height="100%"
      surfaceClassName="aw-digital-network"
      ariaLabel="Digital clock network background"
    />
  );
}

export function DigitalClock3D({
  height = 340,
  className,
  style,
  use24HourClock = true,
  showSeconds = true,
  value,
  interactive = true,
  showNetwork = true,
}) {
  const now = useClock(value);
  const rootRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const digits = useMemo(() => {
    const parts = [
      use24HourClock ? now.getHours() : now.getHours() % 12 || 12,
      now.getMinutes(),
      now.getSeconds(),
    ];

    return (showSeconds ? parts : parts.slice(0, 2))
      .map(pad)
      .join("")
      .split("")
      .map(Number);
  }, [now, showSeconds, use24HourClock]);

  const onPointerMove = (event) => {
    if (!interactive) return;
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTilt({
      x: (rect.width / 2 - (event.clientX - rect.left)) / rect.width,
      y: (rect.height / 2 - (event.clientY - rect.top)) / rect.height,
    });
  };

  return (
    <div
      className={cx(COMPONENT_ROOT_CLASS, className)}
      style={{
        ...componentStyle(height, style, {
          "--mxac-mouse-x": tilt.x,
          "--mxac-mouse-y": tilt.y,
        }),
      }}
    >
      <div
        ref={rootRef}
        className="aw-digital-clock"
        onPointerMove={interactive ? onPointerMove : undefined}
        aria-label="3D digital clock"
      >
        {showNetwork ? <NetworkBackground /> : null}
        <div className="aw-digital-time">
          {digits.map((digit, index) => (
            <span className="aw-digital-slot" key={`${index}-${digit}`}>
              <SevenSegmentDigit value={digit} />
              {index === 1 || (showSeconds && index === 3) ? (
                <span className="aw-digital-colon" />
              ) : null}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
