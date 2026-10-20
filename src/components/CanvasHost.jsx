import { useEffect, useRef } from "react";
import { ensureComponentStyles } from "./componentStyles.js";
import { COMPONENT_ROOT_CLASS } from "./classNames.js";

ensureComponentStyles();

export const TAU = Math.PI * 2;

export function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

export function cssSize(value) {
  return typeof value === "number" ? `${value}px` : value;
}

export function componentStyle(height, style, extraProperties = {}) {
  return {
    "--mxac-component-height": cssSize(height),
    ...extraProperties,
    ...style,
  };
}

export function observeElementResize(element, callback) {
  if (typeof ResizeObserver !== "undefined") {
    const observer = new ResizeObserver(callback);
    observer.observe(element);
    return () => observer.disconnect();
  }

  if (typeof window === "undefined") return () => {};

  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

export function rand(min, max) {
  return Math.random() * (max - min) + min;
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function pointerPosition(event, element) {
  const rect = element.getBoundingClientRect();
  const source = event.changedTouches?.[0] ?? event.touches?.[0] ?? event;

  return {
    x: source.clientX - rect.left,
    y: source.clientY - rect.top,
  };
}

// Draws the first frame immediately, then skips frames while paused or scrolled
// out of view. Hidden tabs are already throttled by requestAnimationFrame.
export function runLoop(element, frame, isPaused = () => false) {
  let frameId = 0;
  let visible = true;
  const observer =
    typeof IntersectionObserver === "undefined"
      ? null
      : new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
        });
  observer?.observe(element);

  const tick = () => {
    frameId = requestAnimationFrame(tick);
    if (visible && !isPaused()) frame();
  };

  frame();
  frameId = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(frameId);
    observer?.disconnect();
  };
}

export function useLatest(value) {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}

export function CanvasHost({
  start,
  className,
  surfaceClassName,
  style,
  height = 360,
  paused = false,
  ariaLabel = "Animated visual component",
}) {
  const hostRef = useRef(null);
  const canvasRef = useRef(null);
  const pausedRef = useLatest(paused);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;

    if (!host || !canvas) return undefined;

    let disposeEffect = null;
    let disposed = false;
    let pendingFrame = 0;
    let lastWidth = 0;
    let lastHeight = 0;

    const setup = () => {
      if (disposed) return;

      const rect = host.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width));
      const nextHeight = Math.max(1, Math.round(rect.height));

      if (disposeEffect && width === lastWidth && nextHeight === lastHeight) {
        return;
      }

      disposeEffect?.();
      lastWidth = width;
      lastHeight = nextHeight;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(nextHeight * dpr));

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, nextHeight);

      const cleanup = start({
        canvas,
        ctx,
        width,
        height: nextHeight,
        dpr,
        host,
        loop: (frame) => runLoop(host, frame, () => pausedRef.current),
      });

      disposeEffect = typeof cleanup === "function" ? cleanup : null;
    };

    const requestSetup = () => {
      cancelAnimationFrame(pendingFrame);
      pendingFrame = requestAnimationFrame(setup);
    };

    const stopObserving = observeElementResize(host, requestSetup);
    requestSetup();

    return () => {
      disposed = true;
      stopObserving();
      cancelAnimationFrame(pendingFrame);
      disposeEffect?.();
    };
  }, [start]);

  return (
    <div
      className={cx(COMPONENT_ROOT_CLASS, className)}
      style={componentStyle(height, style)}
    >
      <div
        ref={hostRef}
        className={cx("aw-effect", surfaceClassName)}
        role="img"
        aria-label={ariaLabel}
      >
        <canvas ref={canvasRef} aria-hidden="true" />
      </div>
    </div>
  );
}
