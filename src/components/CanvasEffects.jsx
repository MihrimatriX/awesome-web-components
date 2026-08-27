import { useCallback } from "react";
import {
  CanvasHost,
  TAU,
  clamp,
  pointerPosition,
  rand,
} from "./CanvasHost.jsx";

export function Fireworks({
  height = 360,
  className,
  style,
  particles: particleLimit = 100,
  autoLaunch = true,
  interactive = true,
  burstSize = 1,
  speed = 1,
  paused = false,
}) {
  const start = useCallback(
    ({ canvas, ctx, width: w, height: h }) => {
      let frameId = 0;
      let tick = 0;
      let cx = w / 2;
      let cy = h / 2;
      const particles = [];
      const speedValue = Number.isFinite(Number(speed))
        ? clamp(Number(speed), 0, 3)
        : 1;
      const burstCount = Math.max(1, Math.round(Number(burstSize) || 1));
      const opts = {
        baseSize: 8,
        addedSize: 8,
        baseSpeed: 0.1 * speedValue,
        addedSpeed: 0.1 * speedValue,
        baseAccel: 0.06 * speedValue,
        addedAccel: 0.1 * speedValue,
        colorAttenuator: 0.01,
        baseAlpha: 0.2,
        addedAlpha: 0.2,
        baseLineNum: 3,
        addedLineNum: 8,
        speedSizeMultiplier: 0.3,
      };

      class Particle {
        constructor(x = 0, y = 0) {
          this.originX = x;
          this.originY = y;
          this.reset();
          this.x = x;
          this.y = y;
        }

        reset() {
          const rad = Math.random() * TAU;
          this.x = this.originX;
          this.y = this.originY;
          this.size = opts.baseSize + opts.addedSize * Math.random();
          this.speed = opts.baseSpeed + opts.addedSpeed * Math.random();
          this.accel = opts.baseAccel + opts.addedAccel * Math.random();
          this.cos = Math.cos(rad);
          this.sin = Math.sin(rad);
          this.vx = this.cos * this.speed;
          this.vy = this.sin * this.speed;
          this.ax = this.cos * this.accel;
          this.ay = this.sin * this.accel;
          this.startTick = tick;
        }

        step() {
          this.speed += this.accel;
          this.x += this.vx += this.ax;
          this.y += this.vy += this.ay;

          ctx.strokeStyle = `hsla(${
            this.startTick + (tick - this.startTick) * opts.colorAttenuator
          }, 80%, 50%, ${opts.baseAlpha + opts.addedAlpha * Math.random()})`;
          ctx.beginPath();

          const num =
            (opts.baseLineNum + opts.addedLineNum * Math.random()) | 0;
          const prevPointX = this.x - this.vx * 3;
          const prevPointY = this.y - this.vy * 3;
          const added = this.size + this.speed * opts.speedSizeMultiplier;

          for (let i = 0; i < num; i += 1) {
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(
              prevPointX + (Math.random() - 0.5) * added,
              prevPointY + (Math.random() - 0.5) * added,
            );
          }

          ctx.stroke();

          if (this.x < -cx || this.x > cx || this.y < -cy || this.y > cy) {
            this.reset();
          }
        }
      }

      const spawn = (x = cx, y = cy, amount = burstCount) => {
        for (let i = 0; i < amount; i += 1) {
          if (particles.length >= particleLimit) particles.shift();
          particles.push(new Particle(x - cx, y - cy));
        }
      };

      const onPointerDown = (event) => {
        if (!interactive) return;
        const pos = pointerPosition(event, canvas);
        spawn(pos.x, pos.y);
      };

      if (interactive) canvas.addEventListener("pointerdown", onPointerDown);
      ctx.fillStyle = "#222";
      ctx.fillRect(0, 0, w, h);

      const anim = () => {
        frameId = requestAnimationFrame(anim);
        if (paused) return;
        tick += speedValue;

        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = "rgba(20,20,20,.1)";
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = "lighter";

        if (
          autoLaunch &&
          particles.length < particleLimit &&
          Math.random() < 0.5
        ) {
          particles.push(new Particle());
        }

        ctx.save();
        ctx.translate(cx, cy);
        particles.forEach((particle) => particle.step());
        ctx.restore();
      };

      anim();

      return () => {
        cancelAnimationFrame(frameId);
        canvas.removeEventListener("pointerdown", onPointerDown);
      };
    },
    [autoLaunch, burstSize, interactive, particleLimit, paused, speed],
  );

  return (
    <CanvasHost
      start={start}
      height={height}
      className={className}
      style={style}
      ariaLabel="Fireworks canvas animation"
    />
  );
}

export function LinesBeLining({ height = 320, className, style }) {
  const start = useCallback(({ ctx, width: w, height: h }) => {
    let frameId = 0;
    let frame = 0;
    const rects = [];
    const prob = Math.max(0.0002 * (h + w), 0.28);
    const proportion = 12;
    const minHeight = 2;
    const maxHeight = 15;

    class Rect {
      constructor() {
        this.height = Math.random() * (maxHeight - minHeight) + minHeight;
        this.color = `hsla(${frame % 360}, 80%, 50%, ${
          (0.2 * (this.height - minHeight)) / (maxHeight - minHeight) + 0.3
        })`;
        this.x = -this.height * proportion;
        this.y = Math.random() * h - this.height / 2;
      }

      use(dontRender) {
        this.x += this.height / 2;
        if (dontRender) return;

        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.height * proportion, this.height);
      }
    }

    const update = (dontRender = false) => {
      frame += 0.4;
      let trial = 0;

      while (Math.random() < prob && trial < 5) {
        rects.push(new Rect());
        trial += 1;
      }

      for (let i = 0; i < rects.length; i += 1) {
        rects[i].use(dontRender);
        if (rects[i].x >= w) {
          rects.splice(i, 1);
          i -= 1;
        }
      }
    };

    for (let i = 0; i < 850; i += 1) update(true);

    const anim = () => {
      frameId = requestAnimationFrame(anim);
      ctx.fillStyle = "#222";
      ctx.fillRect(0, 0, w, h);
      update();
    };

    anim();
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <CanvasHost
      start={start}
      height={height}
      className={className}
      style={style}
      ariaLabel="Colorful horizontal line stream"
    />
  );
}

export function ParticleAttraction({ height = 320, className, style }) {
  const start = useCallback(({ canvas, ctx, width: w, height: h }) => {
    let frameId = 0;
    let cx = w / 2;
    let cy = h / 2;
    let tick = 0;
    const particles = [];

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * w;
        this.y =
          Math.random() < cy / h
            ? (-Math.random() * h) / 2
            : h + (Math.random() * h) / 2;
      }

      step() {
        const dx = this.x - cx;
        const dy = this.y - cy;

        ctx.strokeStyle = `hsl(${dy + tick}, 80%, 50%)`;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        this.x -= dx / 50;
        this.y -= dy / 10;
        ctx.lineTo(this.x, this.y);
        ctx.stroke();

        if (Math.abs(dy) < 2) this.reset();
      }
    }

    const onPointer = (event) => {
      const pos = pointerPosition(event, canvas);
      cx = pos.x;
      cy = pos.y;
    };

    canvas.addEventListener("pointermove", onPointer);
    canvas.addEventListener("pointerdown", onPointer);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, w, h);

    const anim = () => {
      frameId = requestAnimationFrame(anim);
      tick += 1;

      if (particles.length < 220) particles.push(new Particle());

      ctx.fillStyle = "rgba(0,0,0,.08)";
      ctx.fillRect(0, 0, w, h);
      particles.forEach((particle) => particle.step());
    };

    anim();
    return () => {
      cancelAnimationFrame(frameId);
      canvas.removeEventListener("pointermove", onPointer);
      canvas.removeEventListener("pointerdown", onPointer);
    };
  }, []);

  return (
    <CanvasHost
      start={start}
      height={height}
      className={className}
      style={style}
      ariaLabel="Particles attracted to pointer"
    />
  );
}

export function RainbowSimpleMotionParticles({
  height = 320,
  className,
  style,
}) {
  const start = useCallback(({ ctx, width: w, height: h }) => {
    let frameId = 0;
    let tick = 0;
    const count = 120;

    const fx = (t) => w / 2 + (w / 3) * Math.sin(t);
    const fy = (t) => h / 2 + (h / 3) * Math.sin(2 * t);

    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, w, h);

    const anim = () => {
      frameId = requestAnimationFrame(anim);
      tick += 0.02;

      ctx.fillStyle = "rgba(0,0,0,.1)";
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < count; i += 1) {
        const rapport = i / count;
        ctx.fillStyle = `hsl(${rapport * 360}, 80%, 50%)`;
        ctx.beginPath();
        ctx.arc(
          fx(tick + rapport * TAU),
          fy(tick + rapport * Math.PI),
          2,
          0,
          TAU,
        );
        ctx.fill();
      }
    };

    anim();
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <CanvasHost
      start={start}
      height={height}
      className={className}
      style={style}
      ariaLabel="Rainbow particles on a looping path"
    />
  );
}

export function RainbowTransfer({ height = 360, className, style }) {
  const start = useCallback(({ ctx, width: w, height: h }) => {
    let frameId = 0;
    const s = Math.min(w, h) * 0.92;
    const ox = (w - s) / 2;
    const oy = (h - s) / 2;
    const particles = [];
    const clouds = [];
    const cx = s / 2;
    const cy = (s / 3) * 2;
    const cloudCx1 = cx - s / 3;
    const cloudCx2 = cx + s / 3;

    ctx.lineWidth = Math.max(1.4, s / 250);

    const roundedPanel = () => {
      const radius = s * 0.19;
      ctx.beginPath();
      ctx.moveTo(ox + radius, oy);
      ctx.lineTo(ox + s - radius, oy);
      ctx.quadraticCurveTo(ox + s, oy, ox + s, oy + radius);
      ctx.lineTo(ox + s, oy + s - radius);
      ctx.quadraticCurveTo(ox + s, oy + s, ox + s - radius, oy + s);
      ctx.lineTo(ox + radius, oy + s);
      ctx.quadraticCurveTo(ox, oy + s, ox, oy + s - radius);
      ctx.lineTo(ox, oy + radius);
      ctx.quadraticCurveTo(ox, oy, ox + radius, oy);
      ctx.closePath();
    };

    const paintShell = () => {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#222";
      ctx.fillRect(0, 0, w, h);
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,.72)";
      ctx.shadowBlur = Math.max(8, s * 0.035);
      roundedPanel();
      ctx.fillStyle = "#333";
      ctx.fill();
      ctx.restore();
    };

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.rad = -Math.PI;
        this.speed = 0.01 + Math.random() * 0.02;
        const depth = Math.random() * (s * 0.16);
        this.color = `hsl(${(depth / (s * 0.16)) * 360}, 80%, 50%)`;
        this.len = s / 3 + depth - s * 0.08;
      }

      step() {
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.arc(cx, cy, this.len, this.rad, (this.rad += this.speed));
        ctx.stroke();

        if (this.rad > 0) this.reset();
      }
    }

    class Cloud {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() < 0.5 ? cloudCx1 : cloudCx2;
        this.x += Math.random() * s * 0.1 * (Math.random() < 0.5 ? 1 : -1);
        this.y = cy + Math.random() * s * 0.02 * (Math.random() < 0.5 ? 1 : -1);
        this.maxRadius = s * 0.06 + s * 0.02 * Math.random();
        this.tick = 0;
        this.maxTick = (40 + 10 * Math.random()) | 0;
      }

      step() {
        this.tick += 1;
        const radius =
          this.maxRadius *
          (Math.cos((this.tick / this.maxTick) * TAU - Math.PI) / 2 + 0.5);
        const gradient = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          radius,
        );

        gradient.addColorStop(0, "rgba(255,255,255,1)");
        gradient.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, 0, TAU);
        ctx.fill();

        if (this.tick > this.maxTick) this.reset();
      }
    }

    const drawFrame = () => {
      ctx.fillStyle = "rgba(0,0,0,.04)";
      roundedPanel();
      ctx.fill();

      ctx.save();
      roundedPanel();
      ctx.clip();
      ctx.translate(ox, oy);

      if (particles.length < 200 && Math.random() < 0.5) {
        particles.push(new Particle());
      }

      if (clouds.length < 30 && Math.random() < 0.1) {
        clouds.push(new Cloud());
      }

      particles.forEach((particle) => particle.step());
      clouds.forEach((cloud) => cloud.step());
      ctx.restore();
    };

    const anim = () => {
      frameId = requestAnimationFrame(anim);
      drawFrame();
    };

    paintShell();
    for (let i = 0; i < 120; i += 1) drawFrame();
    anim();
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <CanvasHost
      start={start}
      height={height}
      className={className}
      surfaceClassName="aw-rainbow-transfer"
      style={style}
      ariaLabel="Rainbow arc transfer animation"
    />
  );
}

export function RainbowLinesOfStraightness({ height = 340, className, style }) {
  const start = useCallback(({ ctx, width: w, height: h }) => {
    let frameId = 0;
    let frame = 0;
    let timeSinceLast = 0;
    const minDist = 10;
    const maxDist = 30;
    const initialWidth = 10;
    const maxLines = 110;
    const initialLines = 4;
    const speed = 5;
    const lines = [];
    const dirs = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
      [0.7, 0.7],
      [0.7, -0.7],
      [-0.7, 0.7],
      [-0.7, -0.7],
    ];
    const starter = {
      x: w / 2,
      y: h / 2,
      vx: 0,
      vy: 0,
      width: initialWidth,
    };

    const getColor = (x) => `hsl(${(x / w) * 360 + frame}, 80%, 50%)`;

    class Line {
      constructor(parent) {
        this.x = parent.x | 0;
        this.y = parent.y | 0;
        this.width = parent.width / 1.25;

        let dir;
        do {
          dir = dirs[(Math.random() * dirs.length) | 0];
          this.vx = dir[0];
          this.vy = dir[1];
        } while (
          (this.vx === -parent.vx && this.vy === -parent.vy) ||
          (this.vx === parent.vx && this.vy === parent.vy)
        );

        this.vx *= speed;
        this.vy *= speed;
        this.dist = Math.random() * (maxDist - minDist) + minDist;
      }

      step() {
        let dead = false;
        const prevX = this.x;
        const prevY = this.y;

        this.x += this.vx;
        this.y += this.vy;
        this.dist -= 1;

        if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) {
          dead = true;
        }

        if (this.dist <= 0 && this.width > 1) {
          this.dist = Math.random() * (maxDist - minDist) + minDist;
          if (lines.length < maxLines) lines.push(new Line(this));
          if (lines.length < maxLines && Math.random() < 0.5) {
            lines.push(new Line(this));
          }
          if (Math.random() < 0.2) dead = true;
        }

        ctx.strokeStyle = ctx.shadowColor = getColor(this.x);
        ctx.beginPath();
        ctx.lineWidth = this.width;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(prevX, prevY);
        ctx.stroke();

        return dead;
      }
    }

    for (let i = 0; i < initialLines; i += 1) lines.push(new Line(starter));
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, w, h);

    const drawFrame = () => {
      frame += 1;

      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(0,0,0,.02)";
      ctx.fillRect(0, 0, w, h);
      ctx.shadowBlur = 0.5;

      for (let i = 0; i < lines.length; i += 1) {
        if (lines[i].step()) {
          lines.splice(i, 1);
          i -= 1;
        }
      }

      timeSinceLast += 1;

      if (
        lines.length < maxLines &&
        timeSinceLast > 10 &&
        Math.random() < 0.5
      ) {
        timeSinceLast = 0;
        lines.push(new Line(starter));
        ctx.fillStyle = ctx.shadowColor = getColor(starter.x);
        ctx.beginPath();
        ctx.arc(starter.x, starter.y, initialWidth, 0, TAU);
        ctx.fill();
      }
    };

    const anim = () => {
      frameId = requestAnimationFrame(anim);
      drawFrame();
    };

    for (let i = 0; i < 42; i += 1) drawFrame();
    anim();
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <CanvasHost
      start={start}
      height={height}
      className={className}
      style={style}
      ariaLabel="Branching rainbow straight lines"
    />
  );
}

export function RainbowGrid({ height = 340, className, style }) {
  const start = useCallback(({ ctx, width: w, height: h }) => {
    let frameId = 0;
    const opts = {
      lineMaxCount: 44,
      lineSpawnProb: 0.12,
      lineMaxLength: 10,
      lineIncrementProb: 0.5,
      lineDecrementProb: 0.7,
      lineSafeTime: 150,
      lineMidJitter: 7,
      lineMidPoints: 3,
      lineHueVariation: 30,
      lineAlpha: 1,
      gridSideNum: 6,
      gridSide: Math.max(20, Math.min(w, h) / 13),
      gridRotationVel: 0.002,
      gridScalingInputMultiplier: 0.01,
      gridScalingMultiplier: 0.3,
      gridHueChange: 0.6,
      gridRepaintAlpha: 0.1,
      gridCenterX: w / 2,
      gridCenterY: h / 2,
    };
    let tick = Math.random() * 360;
    const lines = [];
    const radPart = TAU / opts.gridSideNum;

    class Vec {
      constructor(x, y) {
        this.x = x;
        this.y = y;
      }
    }

    const randomPos = (previous) => {
      const rad = radPart * ((Math.random() * opts.gridSideNum) | 0);
      return new Vec(Math.cos(rad) + previous.x, Math.sin(rad) + previous.y);
    };

    class Line {
      constructor() {
        this.reset();
      }

      reset() {
        this.head = new Vec(0, 0);
        this.path = [this.head];
        this.life = 0;
        this.hue = ((tick * opts.gridHueChange) % 360) | 0;
      }

      step() {
        this.life += 1;

        if (Math.random() <= opts.lineIncrementProb) {
          let vec;
          const lastHead = this.path[this.path.length - 2];
          do {
            vec = randomPos(this.head);
          } while (lastHead && vec.x === lastHead.x && vec.y === lastHead.y);

          this.head = vec;
          this.path.push(vec);
          if (this.path.length >= opts.lineMaxLength) this.path.shift();
        }

        if (
          this.life >= opts.lineSafeTime &&
          Math.random() <= opts.lineDecrementProb
        ) {
          this.path.length > 0 ? this.path.shift() : this.reset();
        }
      }

      draw() {
        if (this.path.length === 0) return;

        let x1 = this.path[0].x;
        let y1 = this.path[0].y;

        for (let i = 1; i < this.path.length; i += 1) {
          const x2 = this.path[i].x;
          const y2 = this.path[i].y;
          const dx = (x2 - x1) / opts.lineMidPoints;
          const dy = (y2 - y1) / opts.lineMidPoints;

          ctx.strokeStyle = `hsla(${
            (this.hue + Math.random() * opts.lineHueVariation) | 0
          }, 80%, 50%, ${opts.lineAlpha / (this.life / 80)})`;
          ctx.beginPath();
          ctx.moveTo(
            x1 * opts.gridSide +
              Math.random() * opts.lineMidJitter -
              opts.lineMidJitter / 2,
            y1 * opts.gridSide +
              Math.random() * opts.lineMidJitter -
              opts.lineMidJitter / 2,
          );

          for (let j = 1; j < opts.lineMidPoints - 1; j += 1) {
            ctx.lineTo(
              (x1 + dx * j) * opts.gridSide +
                Math.random() * opts.lineMidJitter -
                opts.lineMidJitter / 2,
              (y1 + dy * j) * opts.gridSide +
                Math.random() * opts.lineMidJitter -
                opts.lineMidJitter / 2,
            );
          }

          ctx.lineTo(
            x2 * opts.gridSide +
              Math.random() * opts.lineMidJitter -
              opts.lineMidJitter / 2,
            y2 * opts.gridSide +
              Math.random() * opts.lineMidJitter -
              opts.lineMidJitter / 2,
          );
          ctx.stroke();

          x1 = x2;
          y1 = y2;
        }
      }
    }

    const drawFrame = () => {
      if (
        lines.length < opts.lineMaxCount &&
        Math.random() < opts.lineSpawnProb
      ) {
        lines.push(new Line());
      }

      tick += 1;
      lines.forEach((line) => line.step());

      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = `rgba(0,0,0,${opts.gridRepaintAlpha})`;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      ctx.save();
      const scaleFactor =
        1 +
        Math.sin(tick * opts.gridScalingInputMultiplier) *
          opts.gridScalingMultiplier;
      ctx.translate(opts.gridCenterX, opts.gridCenterY);
      ctx.rotate(tick * opts.gridRotationVel);
      ctx.scale(scaleFactor, scaleFactor);
      ctx.lineWidth = 0.2;
      lines.forEach((line) => line.draw());
      ctx.restore();
      ctx.globalCompositeOperation = "source-over";
    };

    const anim = () => {
      frameId = requestAnimationFrame(anim);
      drawFrame();
    };

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 78; i += 1) drawFrame();
    anim();
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <CanvasHost
      start={start}
      height={height}
      className={className}
      style={style}
      ariaLabel="Rotating rainbow grid animation"
    />
  );
}

export function GravityParticles({ height = 340, className, style }) {
  const start = useCallback(({ canvas, ctx, width: w, height: h }) => {
    let frameId = 0;
    let tick = 0;
    const particles = [];
    const orbits = [];
    const particleCaches = {};
    const opts = {
      particles: 220,
      particleInitialVel: 2,
      particleInertia: 1000,
      particleFriction: 0.99,
      particleTemplateColor: "hsla(hue,60%,45%,.1)",
      particleSize: 4,
      orbits: 7,
      orbitTemplateColor: "hsla(hue,80%,55%,.1)",
      orbitBaseVel: 1,
      orbitAddedVel: 0.5,
      orbitVelWaveIncrementer: 0.01,
      orbitRadIncrementer: 0.01,
      orbitAddedRad: 0.01,
      orbitAddedRadWaveIncrementer: 0.001,
      orbitSize: 20,
      orbitLines: 10,
      repaintAlpha: 0.1,
      cx: w / 2,
      cy: h / 2,
    };
    const halfSize = opts.particleSize / 2;

    class Orbit {
      constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.rad = Math.random() * TAU;
        this.radWave = Math.random() * TAU;
        this.velWave = Math.random() * TAU;
      }

      step() {
        this.rad +=
          opts.orbitRadIncrementer +
          opts.orbitAddedRad *
            Math.sin(
              (this.radWave +=
                Math.random() * opts.orbitAddedRadWaveIncrementer),
            );

        const len =
          opts.orbitBaseVel +
          opts.orbitAddedVel *
            Math.sin((this.velWave += opts.orbitVelWaveIncrementer));
        let vx = len * Math.cos(this.rad);
        let vy = len * Math.sin(this.rad);
        let revertX = true;
        let revertY = true;

        this.x += vx;
        this.y += vy;

        if (this.x < 0) this.x = 0;
        else if (this.x > w) this.x = w;
        else revertX = false;

        if (this.y < 0) this.y = 0;
        else if (this.y > h) this.y = h;
        else revertY = false;

        if (revertX || revertY) {
          if (revertX) vx *= -1;
          if (revertY) vy *= -1;
          this.rad = Math.atan(vy / vx) + (vx < 0 ? Math.PI : 0);
        }

        ctx.strokeStyle = opts.orbitTemplateColor.replace(
          "hue",
          (this.x / w) * 360 + tick,
        );
        ctx.beginPath();
        for (let i = 0; i < opts.orbitLines; i += 1) {
          const len2 = (1 - Math.sqrt(Math.random())) * opts.orbitSize;
          const rad = Math.random() * TAU;
          ctx.moveTo(
            this.x + len2 * Math.cos(rad),
            this.y + len2 * Math.sin(rad),
          );
          ctx.lineTo(this.x, this.y);
        }
        ctx.stroke();
      }
    }

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = opts.cx;
        this.y = opts.cy;
        const rad = Math.random() * TAU;
        this.vx = opts.particleInitialVel * Math.cos(rad);
        this.vy = opts.particleInitialVel * Math.sin(rad);
      }

      step() {
        for (let i = 0; i < orbits.length; i += 1) {
          const dx = orbits[i].x - this.x;
          const dy = orbits[i].y - this.y;
          const squareD = dx * dx + dy * dy + 1;
          const force = opts.particleInertia / squareD;
          const rad = Math.atan(dy / dx) + (dx < 0 ? Math.PI : 0);

          this.vx += force * Math.cos(rad);
          this.vy += force * Math.sin(rad);
        }

        this.vx *= opts.particleFriction;
        this.vy *= opts.particleFriction;
        this.x += this.vx;
        this.y += this.vy;

        const hue = ((this.x / w) * 360 + tick) | 0;
        let cache = particleCaches[hue];

        if (!cache) {
          cache = document.createElement("canvas");
          const context = cache.getContext("2d");
          cache.width = cache.height = opts.particleSize;
          context.fillStyle = opts.particleTemplateColor.replace("hue", hue);
          context.beginPath();
          context.arc(halfSize, halfSize, halfSize, 0, TAU);
          context.fill();
          particleCaches[hue] = cache;
        }

        ctx.drawImage(cache, this.x - halfSize, this.y - halfSize);

        if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) {
          this.reset();
        }
      }
    }

    const onPointerMove = (event) => {
      const pos = pointerPosition(event, canvas);
      opts.cx = pos.x;
      opts.cy = pos.y;
    };
    const onPointerLeave = () => {
      opts.cx = w / 2;
      opts.cy = h / 2;
    };

    for (let i = 0; i < opts.orbits; i += 1) orbits.push(new Orbit());
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, w, h);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);

    const anim = () => {
      frameId = requestAnimationFrame(anim);
      tick += 1;

      if (particles.length < opts.particles) particles.push(new Particle());

      ctx.fillStyle = `rgba(0,0,0,${opts.repaintAlpha})`;
      ctx.fillRect(0, 0, w, h);
      orbits.forEach((orbit) => orbit.step());
      particles.forEach((particle) => particle.step());
    };

    anim();
    return () => {
      cancelAnimationFrame(frameId);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <CanvasHost
      start={start}
      height={height}
      className={className}
      style={style}
      ariaLabel="Gravity particle orbit animation"
    />
  );
}

export function RainbowShinyComets({ height = 340, className, style }) {
  const start = useCallback(({ ctx, width: w, height: h }) => {
    let frameId = 0;
    let tick = 0;
    let explosions = 0;
    const meteors = [];
    const holes = [];
    const opts = {
      hitLine: Math.max(60, h - 30),
      hitIntensity: 1,
      hitCoolDown: 4,
      holeAttenuator: 30,
      repaintAlpha: 0.035,
      gravity: 0.01,
      meteorCount: 16,
      meteorSpawnProb: 0.05,
      meteorBaseSize: 10,
      meteorAddedSize: 10,
      meteorBaseVelX: 2,
      meteorAddedVelX: -4,
      meteorBaseVelY: 2,
      meteorAddedVelY: 3,
      ashCount: 20,
      ashSpawnProb: 0.08,
      ashBaseSizeMultiplier: 0.1,
      ashAddedSizeMultiplier: 0.1,
      ashLifeMultiplier: 10,
    };

    class Ash {
      constructor(meteor) {
        this.reset(meteor);
      }

      reset(meteor) {
        this.meteor = meteor;
        this.x = meteor.x + Math.random() * meteor.size * 2 - meteor.size;
        this.y = meteor.y + Math.random() * meteor.size * 2 - meteor.size;
        this.size =
          ((opts.ashBaseSizeMultiplier +
            Math.random() * opts.ashAddedSizeMultiplier) *
            meteor.size) |
          0;
        this.life = this.size * opts.ashLifeMultiplier;
      }

      update() {
        this.life -= 1;
        if (this.life <= 0) this.reset(this.meteor);
      }

      render() {
        ctx.fillRect(this.x, this.y, this.size, this.size);
      }
    }

    class Hole {
      constructor(meteor) {
        this.x = meteor.x;
        this.size = meteor.size * 10;
        this.color = `hsla(${(this.x / w) * 100 + tick}, 80%, 55%, .04)`;
        this.life = 0;
        this.dead = false;
      }

      update() {
        this.life += (this.size - this.life) / opts.holeAttenuator;
        if (this.life > this.size * 0.6) this.dead = true;
      }

      render() {
        ctx.shadowBlur = 0;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, opts.hitLine, this.life, 0, TAU);
        ctx.fill();
      }
    }

    class Meteor {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * w;
        this.y = 0;
        this.vx = opts.meteorBaseVelX + Math.random() * opts.meteorAddedVelX;
        this.vy = opts.meteorBaseVelY + Math.random() * opts.meteorAddedVelY;
        this.size =
          (opts.meteorBaseSize + Math.random() * opts.meteorAddedSize) | 0;
        this.y -= this.size;
        this.ashes = [];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy += opts.gravity;

        if (
          this.ashes.length < opts.ashCount &&
          Math.random() < opts.ashSpawnProb
        ) {
          this.ashes.push(new Ash(this));
        }
        this.ashes.forEach((ash) => ash.update());

        if (this.x > w + this.size) this.reset();
        if (this.y > opts.hitLine) {
          explosions += 1;
          holes.push(new Hole(this));
          this.reset();
        }
      }

      render() {
        const color = `hsl(${(this.x / w) * 100 + tick}, 80%, light%)`;
        ctx.fillStyle = color.replace("light", Math.random() * 30 + 25);
        ctx.shadowColor = color.replace("light", Math.random() * 25 + 25);
        ctx.shadowBlur = this.size;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size / 2, 0, TAU);
        ctx.fill();
        ctx.fillStyle = ctx.shadowColor;
        this.ashes.forEach((ash) => ash.render());
      }
    }

    for (let i = 0; i < 90; i += 1) {
      if (meteors.length < opts.meteorCount && Math.random() < 0.2) {
        meteors.push(new Meteor());
      }
      meteors.forEach((meteor) => meteor.update());
    }

    ctx.fillStyle = "#151515";
    ctx.fillRect(0, 0, w, h);

    const anim = () => {
      frameId = requestAnimationFrame(anim);
      tick = (tick + 0.6) % 360;
      explosions = Math.max(0, explosions - 1 / opts.hitCoolDown);

      if (
        meteors.length < opts.meteorCount &&
        Math.random() < opts.meteorSpawnProb
      ) {
        meteors.push(new Meteor());
      }

      meteors.forEach((meteor) => meteor.update());
      for (let i = 0; i < holes.length; i += 1) {
        holes[i].update();
        if (holes[i].dead) {
          holes.splice(i, 1);
          i -= 1;
        }
      }

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = `rgba(0,0,0,${opts.repaintAlpha})`;
      ctx.fillRect(0, 0, w, opts.hitLine);
      ctx.fillStyle = `rgba(20,20,20,${opts.repaintAlpha * 2})`;
      ctx.fillRect(0, opts.hitLine, w, h - opts.hitLine);

      ctx.save();
      ctx.translate(
        Math.random() * opts.hitIntensity * explosions,
        Math.random() * opts.hitIntensity * explosions,
      );
      ctx.globalCompositeOperation = "lighter";
      meteors.forEach((meteor) => meteor.render());
      holes.forEach((hole) => hole.render());
      ctx.restore();
    };

    anim();
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <CanvasHost
      start={start}
      height={height}
      className={className}
      style={style}
      ariaLabel="Rainbow shiny comet animation"
    />
  );
}

export function Starfield({ height = 340, className, style }) {
  const start = useCallback(({ ctx, width: w, height: h }) => {
    let frameId = 0;
    let frameCount = 0;
    const stars = [];
    const count = Math.min(1000, Math.max(180, Math.floor(w)));

    for (let i = 0; i < count; i += 1) {
      stars.push({
        x: 0,
        y: 0,
        offset: Math.random() * 360,
        orbit: (Math.random() + 0.01) * Math.max(w, h),
        radius: Math.random() * 1.45,
      });
    }

    const update = () => {
      const originX = w / 2;
      const originY = h / 2;

      stars.forEach((star) => {
        const rad =
          (frameCount * (1 / (star.orbit * 2 + star.offset)) + star.offset) %
          TAU;
        star.x = originX + Math.cos(rad) * (star.orbit * 2);
        star.y = originY + Math.sin(rad) * star.orbit;
      });
    };

    const anim = () => {
      frameId = requestAnimationFrame(anim);
      frameCount += 1;
      ctx.fillStyle = "#181818";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "rgba(240,240,240,0.9)";

      update();
      stars.forEach((star) => {
        if (star.radius < 0.14) return;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, TAU);
        ctx.fill();
      });
    };

    anim();
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <CanvasHost
      start={start}
      height={height}
      className={className}
      style={style}
      ariaLabel="Orbital starfield animation"
    />
  );
}

export function ColorRainLines({ height = 340, className, style }) {
  const start = useCallback(({ ctx, width: w, height: h }) => {
    let frameId = 0;
    let tick = Math.random() * 360;
    const lines = [];
    const count = Math.min(900, Math.max(150, Math.floor(w * 1.05)));
    const lineHeight = Math.max(420, h * 1.9);

    const resetLine = (line = {}) => {
      line.x = Math.random() * w;
      line.y = rand(-lineHeight, h);
      line.speed = rand(5, 13);
      line.alpha = rand(0.05, 0.32);
      line.width = rand(0.55, 2.1);
      line.tip = Math.random() > 0.9;
      return line;
    };

    for (let i = 0; i < count; i += 1) lines.push(resetLine());
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, w, h);

    const anim = () => {
      frameId = requestAnimationFrame(anim);
      tick += 0.8;

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(0,0,0,.22)";
      ctx.fillRect(0, 0, w, h);

      lines.forEach((line) => {
        line.y += line.speed;
        if (line.y > h + 20) resetLine(line);

        const hue = (line.x / w) * 360 + tick;
        const gradient = ctx.createLinearGradient(
          line.x,
          line.y,
          line.x,
          line.y + lineHeight,
        );
        gradient.addColorStop(0, `hsla(${hue}, 100%, 70%, 0)`);
        gradient.addColorStop(0.08, `hsla(${hue}, 100%, 62%, ${line.alpha})`);
        gradient.addColorStop(1, `hsla(${hue + 70}, 100%, 50%, 0)`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = line.width;
        ctx.beginPath();
        ctx.moveTo(line.x, line.y);
        ctx.lineTo(line.x, line.y + lineHeight);
        ctx.stroke();

        if (line.tip) {
          ctx.fillStyle = `hsla(${hue}, 100%, 80%, .7)`;
          ctx.fillRect(
            line.x - line.width,
            line.y + lineHeight - 12,
            line.width * 2,
            12,
          );
        }
      });

      const topFade = ctx.createLinearGradient(0, 0, 0, h * 0.24);
      topFade.addColorStop(0, "rgba(0,0,0,.72)");
      topFade.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = topFade;
      ctx.fillRect(0, 0, w, h * 0.24);

      const bottomFade = ctx.createLinearGradient(0, h * 0.68, 0, h);
      bottomFade.addColorStop(0, "rgba(0,0,0,0)");
      bottomFade.addColorStop(1, "rgba(0,0,0,.92)");
      ctx.fillStyle = bottomFade;
      ctx.fillRect(0, h * 0.68, w, h * 0.32);

      ctx.globalCompositeOperation = "source-over";
    };

    anim();
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <CanvasHost
      start={start}
      height={height}
      className={className}
      style={style}
      ariaLabel="Colorful flowing vertical lines"
    />
  );
}

export function RainScreen({
  height = 360,
  className,
  style,
  density = 1,
  speed = 1,
  interactive = true,
  showCity = true,
  paused = false,
}) {
  const start = useCallback(
    ({ canvas, ctx, width: w, height: h }) => {
      let frameId = 0;
      let tick = 0;
      const densityValue = Number.isFinite(Number(density))
        ? clamp(Number(density), 0.2, 2.4)
        : 1;
      const speedValue = Number.isFinite(Number(speed))
        ? clamp(Number(speed), 0, 3)
        : 1;
      const backdrop = document.createElement("canvas");
      const backdropCtx = backdrop.getContext("2d");
      backdrop.width = w;
      backdrop.height = h;

      const beads = [];
      const runners = [];
      const streaks = [];
      const bokeh = [];
      const silhouettes = [];
      let pointerPulse = { x: w / 2, y: h / 2, life: 0 };

      const beadCount = Math.floor(
        Math.min(920, Math.max(280, Math.floor((w * h) / 520))) * densityValue,
      );
      const runnerCount = Math.floor(
        Math.min(82, Math.max(34, Math.floor(w / 7))) * densityValue,
      );
      const streakCount = Math.floor(
        Math.min(120, Math.max(48, Math.floor(w / 5))) * densityValue,
      );
      const lightCount = Math.min(40, Math.max(18, Math.floor(w / 21)));

      for (let i = 0; i < lightCount; i += 1) {
        bokeh.push({
          x: Math.random() * w,
          y: rand(h * 0.08, h * 0.72),
          r: rand(Math.min(w, h) * 0.025, Math.min(w, h) * 0.13),
          hue: Math.random() > 0.42 ? rand(28, 48) : rand(176, 214),
          alpha: rand(0.12, 0.36),
          drift: rand(-0.16, 0.16),
          phase: Math.random() * TAU,
        });
      }
      bokeh.push(
        {
          x: w * 0.27,
          y: h * 0.38,
          r: Math.min(w, h) * 0.18,
          hue: 42,
          alpha: 0.38,
          drift: 0.07,
          phase: 0.5,
        },
        {
          x: w * 0.76,
          y: h * 0.23,
          r: Math.min(w, h) * 0.16,
          hue: 188,
          alpha: 0.28,
          drift: -0.05,
          phase: 2.2,
        },
      );

      if (showCity) {
        for (let x = -Math.random() * 32; x < w + 80; x += rand(24, 64)) {
          silhouettes.push({
            x,
            width: rand(18, 58),
            top: rand(h * 0.44, h * 0.76),
            alpha: rand(0.22, 0.62),
          });
        }
      }

      const resetStreak = (streak = {}, randomY = true) => {
        streak.x = Math.random() * w;
        streak.y = randomY ? Math.random() * h : rand(-h * 0.35, 0);
        streak.length = rand(h * 0.18, h * 0.62);
        streak.speed = rand(2.6, 7.2);
        streak.alpha = rand(0.04, 0.16);
        streak.width = rand(0.35, 1.15);
        streak.sway = rand(-0.4, 0.4);
        return streak;
      };

      const resetBead = (bead = {}, randomY = true) => {
        bead.x = Math.random() * w;
        bead.y = randomY ? Math.random() * h : rand(-24, 0);
        bead.r = Math.random() > 0.88 ? rand(1.5, 3.1) : rand(0.35, 1.35);
        bead.alpha = rand(0.07, 0.32);
        bead.life = rand(180, 680);
        bead.vy = rand(0.001, 0.012);
        bead.wobble = Math.random() * TAU;
        bead.squash = rand(0.82, 1.26);
        return bead;
      };

      const resetRunner = (drop = {}, randomY = true) => {
        drop.x = Math.random() * w;
        drop.y = randomY ? rand(-h * 0.08, h * 0.92) : rand(-h * 0.55, -18);
        drop.round = Math.random() > 0.42;
        drop.rx = drop.round ? rand(4.4, 13.5) : rand(3.2, 9.4);
        drop.ry = drop.rx * (drop.round ? rand(1.05, 2.1) : rand(2.4, 4.8));
        drop.speed = rand(0.05, 0.48) + drop.rx * 0.035;
        drop.trail = drop.round ? rand(22, 90) : rand(58, 240);
        drop.phase = Math.random() * TAU;
        drop.alpha = rand(0.42, 0.86);
        drop.mass = rand(0.7, 1.8);
        drop.pause = Math.random() > 0.58 ? rand(12, 100) : 0;
        drop.refractX = rand(-10, 10);
        drop.refractY = rand(-12, 4);
        drop.shoulder = rand(0.48, 1.08);
        drop.belly = rand(0.78, 1.18);
        drop.tail = drop.round ? rand(0.72, 0.98) : rand(0.9, 1.38);
        drop.lean = rand(-0.46, 0.46);
        drop.glint = rand(0.55, 1);
        drop.topWidth = drop.round ? rand(0.42, 0.88) : rand(0.18, 0.46);
        return drop;
      };

      for (let i = 0; i < beadCount; i += 1) beads.push(resetBead());
      for (let i = 0; i < runnerCount; i += 1) runners.push(resetRunner());
      for (let i = 0; i < streakCount; i += 1) streaks.push(resetStreak());

      const paintBackdrop = () => {
        const time = tick * 0.006;
        const base = backdropCtx.createLinearGradient(0, 0, 0, h);
        base.addColorStop(0, "#172938");
        base.addColorStop(0.36, "#243d4b");
        base.addColorStop(0.68, "#14212c");
        base.addColorStop(1, "#05090f");
        backdropCtx.fillStyle = base;
        backdropCtx.fillRect(0, 0, w, h);

        backdropCtx.save();
        backdropCtx.filter = "blur(13px)";
        bokeh.forEach((light) => {
          const x = light.x + Math.sin(time + light.phase) * light.drift * 28;
          const y =
            light.y + Math.cos(time * 0.7 + light.phase) * light.drift * 16;
          const spot = backdropCtx.createRadialGradient(x, y, 0, x, y, light.r);
          spot.addColorStop(0, `hsla(${light.hue}, 72%, 72%, ${light.alpha})`);
          spot.addColorStop(
            0.34,
            `hsla(${light.hue}, 68%, 56%, ${light.alpha * 0.32})`,
          );
          spot.addColorStop(1, "rgba(255,255,255,0)");
          backdropCtx.fillStyle = spot;
          backdropCtx.beginPath();
          backdropCtx.arc(x, y, light.r, 0, TAU);
          backdropCtx.fill();
        });
        backdropCtx.restore();

        if (showCity) {
          silhouettes.forEach((shape) => {
            backdropCtx.fillStyle = `rgba(3, 8, 12, ${shape.alpha})`;
            backdropCtx.fillRect(
              shape.x,
              shape.top,
              shape.width,
              h - shape.top,
            );
          });
        }

        const lowFog = backdropCtx.createLinearGradient(0, h * 0.45, 0, h);
        lowFog.addColorStop(0, "rgba(120, 153, 160, 0.02)");
        lowFog.addColorStop(0.38, "rgba(38, 57, 65, 0.28)");
        lowFog.addColorStop(1, "rgba(0, 0, 0, 0.62)");
        backdropCtx.fillStyle = lowFog;
        backdropCtx.fillRect(0, h * 0.42, w, h * 0.58);
      };

      const drawDropPath = (targetCtx, drop, grow = 1) => {
        const rx = drop.rx * grow;
        const ry = drop.ry * grow;
        const lean = (drop.lean + Math.sin(drop.phase) * 0.08) * rx;
        if (drop.round) {
          targetCtx.beginPath();
          targetCtx.moveTo(
            drop.x - rx * 0.42 + lean * 0.18,
            drop.y - ry * 0.78,
          );
          targetCtx.bezierCurveTo(
            drop.x - rx * 0.08 + lean * 0.82,
            drop.y - ry * 1.02,
            drop.x + rx * 0.62 + lean * 0.58,
            drop.y - ry * 0.86,
            drop.x + rx * 0.88 + lean * 0.26,
            drop.y - ry * 0.32,
          );
          targetCtx.bezierCurveTo(
            drop.x + rx * 1.08,
            drop.y + ry * 0.36,
            drop.x + rx * 0.42,
            drop.y + ry * 0.98,
            drop.x - rx * 0.12,
            drop.y + ry * 0.96,
          );
          targetCtx.bezierCurveTo(
            drop.x - rx * 0.88,
            drop.y + ry * 0.88,
            drop.x - rx * 1,
            drop.y - ry * 0.22,
            drop.x - rx * 0.42 + lean * 0.18,
            drop.y - ry * 0.78,
          );
          targetCtx.closePath();
          return;
        }

        const shoulder = drop.shoulder * rx;
        const belly = drop.belly * rx;
        const tail = drop.tail * ry;
        const cap = drop.topWidth * rx;
        targetCtx.beginPath();
        targetCtx.moveTo(drop.x - cap + lean * 0.22, drop.y - tail);
        targetCtx.bezierCurveTo(
          drop.x - cap * 0.35 + lean * 0.64,
          drop.y - tail - ry * 0.1,
          drop.x + cap * 0.85 + lean * 0.7,
          drop.y - tail + ry * 0.02,
          drop.x + cap + lean * 0.36,
          drop.y - tail + ry * 0.18,
        );
        targetCtx.bezierCurveTo(
          drop.x + shoulder + lean,
          drop.y - ry * 0.38,
          drop.x + belly * 0.92 + lean * 0.18,
          drop.y + ry * 0.36,
          drop.x + rx * 0.22,
          drop.y + ry * 0.96,
        );
        targetCtx.bezierCurveTo(
          drop.x - belly * 0.98,
          drop.y + ry * 0.56,
          drop.x - shoulder * 0.78 + lean * 0.22,
          drop.y - ry * 0.48,
          drop.x + lean * 0.32,
          drop.y - tail,
        );
        targetCtx.closePath();
      };

      const drawRefractedBackdrop = (drop) => {
        const dx = drop.x - drop.rx * 2.25;
        const dy = drop.y - drop.ry * 1.42;
        const dw = drop.rx * 4.5;
        const dh = drop.ry * 2.95;
        const sw = Math.max(1, dw * 0.52);
        const sh = Math.max(1, dh * 0.54);
        const sx = clamp(
          drop.x - sw / 2 + drop.refractX,
          0,
          Math.max(1, w - sw),
        );
        const sy = clamp(
          drop.y - sh / 2 + drop.refractY,
          0,
          Math.max(1, h - sh),
        );
        ctx.drawImage(backdrop, sx, sy, sw, sh, dx, dy, dw, dh);
      };

      const drawDropSurface = (drop) => {
        const rx = drop.rx;
        const ry = drop.ry;

        ctx.save();
        drawDropPath(ctx, drop, 1.08);
        ctx.shadowColor = `rgba(0, 0, 0, ${0.22 * drop.alpha})`;
        ctx.shadowBlur = Math.max(4, rx * 0.9);
        ctx.shadowOffsetX = rx * 0.22;
        ctx.shadowOffsetY = ry * 0.15;
        ctx.fillStyle = `rgba(0, 0, 0, ${0.1 * drop.alpha})`;
        ctx.fill();
        ctx.restore();

        ctx.save();
        drawDropPath(ctx, drop);
        ctx.clip();
        ctx.globalAlpha = 0.96;
        drawRefractedBackdrop(drop);
        ctx.globalAlpha = 1;

        const body = ctx.createRadialGradient(
          drop.x - rx * 0.42,
          drop.y - ry * 0.48,
          0,
          drop.x + rx * 0.08,
          drop.y + ry * 0.08,
          ry * 1.18,
        );
        body.addColorStop(0, `rgba(255,255,255,${0.24 * drop.alpha})`);
        body.addColorStop(0.16, `rgba(241,249,255,${0.1 * drop.alpha})`);
        body.addColorStop(0.58, `rgba(0, 8, 13, ${0.02 * drop.alpha})`);
        body.addColorStop(1, `rgba(0, 0, 0, ${0.24 * drop.alpha})`);
        ctx.fillStyle = body;
        ctx.fillRect(drop.x - rx * 2.1, drop.y - ry * 1.4, rx * 4.2, ry * 2.8);

        const rim = ctx.createLinearGradient(
          drop.x - rx * 1.1,
          drop.y,
          drop.x + rx * 1.1,
          drop.y,
        );
        rim.addColorStop(0, `rgba(255,255,255,${0.22 * drop.alpha})`);
        rim.addColorStop(0.38, "rgba(255,255,255,0)");
        rim.addColorStop(0.72, "rgba(255,255,255,0)");
        rim.addColorStop(1, `rgba(5,10,14,${0.24 * drop.alpha})`);
        ctx.fillStyle = rim;
        ctx.fillRect(drop.x - rx * 1.2, drop.y - ry * 1.2, rx * 2.4, ry * 2.4);
        ctx.restore();

        ctx.strokeStyle = `rgba(238, 249, 255, ${0.5 * drop.alpha})`;
        ctx.lineWidth = Math.max(0.65, rx * 0.1);
        drawDropPath(ctx, drop);
        ctx.stroke();

        ctx.strokeStyle = `rgba(0, 6, 10, ${0.2 * drop.alpha})`;
        ctx.lineWidth = Math.max(0.55, rx * 0.08);
        drawDropPath(ctx, drop, 0.82);
        ctx.stroke();

        ctx.globalCompositeOperation = "lighter";
        ctx.strokeStyle = `rgba(255,255,255,${0.5 * drop.alpha * drop.glint})`;
        ctx.lineWidth = Math.max(0.75, rx * 0.13);
        ctx.beginPath();
        ctx.moveTo(drop.x - rx * 0.48, drop.y - ry * 0.58);
        ctx.bezierCurveTo(
          drop.x - rx * 0.82,
          drop.y - ry * 0.18,
          drop.x - rx * 0.62,
          drop.y + ry * 0.36,
          drop.x - rx * 0.26,
          drop.y + ry * 0.54,
        );
        ctx.stroke();

        ctx.fillStyle = `rgba(255,255,255,${0.72 * drop.alpha * drop.glint})`;
        ctx.beginPath();
        ctx.ellipse(
          drop.x - rx * 0.28,
          drop.y - ry * 0.5,
          Math.max(0.9, rx * 0.18),
          Math.max(1.1, ry * 0.08),
          -0.52,
          0,
          TAU,
        );
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";
      };

      const onPointer = (event) => {
        pointerPulse = { ...pointerPosition(event, canvas), life: 1 };
      };
      if (interactive) {
        canvas.addEventListener("pointerdown", onPointer);
        canvas.addEventListener("pointermove", onPointer);
      }

      const anim = () => {
        frameId = requestAnimationFrame(anim);
        if (paused && tick > 0) return;
        tick += speedValue;

        ctx.globalCompositeOperation = "source-over";
        paintBackdrop();
        ctx.drawImage(backdrop, 0, 0);

        ctx.fillStyle = "rgba(216, 232, 238, 0.055)";
        ctx.fillRect(0, 0, w, h);

        streaks.forEach((streak) => {
          streak.y += streak.speed * speedValue;
          streak.x += streak.sway * 0.018 * speedValue;
          if (streak.y - streak.length > h) resetStreak(streak, false);

          const rain = ctx.createLinearGradient(
            streak.x,
            streak.y - streak.length,
            streak.x,
            streak.y,
          );
          rain.addColorStop(0, "rgba(230,245,255,0)");
          rain.addColorStop(0.52, `rgba(230,245,255,${streak.alpha})`);
          rain.addColorStop(1, "rgba(230,245,255,0)");
          ctx.strokeStyle = rain;
          ctx.lineWidth = streak.width;
          ctx.beginPath();
          ctx.moveTo(streak.x, streak.y - streak.length);
          ctx.lineTo(streak.x + streak.sway, streak.y);
          ctx.stroke();
        });

        beads.forEach((bead) => {
          bead.life -= 1;
          bead.wobble += 0.018 * speedValue;
          bead.y += bead.vy * speedValue;
          bead.x += Math.sin(bead.wobble) * 0.015 * speedValue;

          const dx = bead.x - pointerPulse.x;
          const dy = bead.y - pointerPulse.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (pointerPulse.life > 0 && d < 120) {
            bead.x += (dx / Math.max(1, d)) * pointerPulse.life * 1.4;
            bead.y += (dy / Math.max(1, d)) * pointerPulse.life * 0.8;
          }

          if (bead.life <= 0 || bead.y > h + 8) resetBead(bead, false);

          const beadGlow = ctx.createRadialGradient(
            bead.x - bead.r * 0.28,
            bead.y - bead.r * 0.32,
            0,
            bead.x,
            bead.y,
            bead.r * 3.6,
          );
          beadGlow.addColorStop(0, `rgba(255,255,255,${bead.alpha})`);
          beadGlow.addColorStop(0.34, `rgba(205,225,232,${bead.alpha * 0.24})`);
          beadGlow.addColorStop(0.58, `rgba(5,12,18,${bead.alpha * 0.18})`);
          beadGlow.addColorStop(1, "rgba(255,255,255,0)");
          ctx.fillStyle = beadGlow;
          ctx.beginPath();
          ctx.ellipse(bead.x, bead.y, bead.r, bead.r * bead.squash, 0, 0, TAU);
          ctx.fill();
        });

        runners.forEach((drop) => {
          drop.phase += 0.012 * speedValue;
          if (drop.pause > 0) {
            drop.pause -= speedValue;
            drop.y += drop.speed * 0.14 * speedValue;
          } else {
            drop.y += drop.speed * speedValue;
            if (Math.random() < 0.006) drop.pause = rand(8, 46);
            if (drop.ry > drop.rx * 2.8) drop.speed += 0.006 * speedValue;
          }
          drop.x += Math.sin(drop.phase) * 0.06 * drop.mass * speedValue;

          const dx = drop.x - pointerPulse.x;
          const dy = drop.y - pointerPulse.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (pointerPulse.life > 0 && d < 132) {
            drop.x += (dx / Math.max(1, d)) * pointerPulse.life * 2.4;
            drop.speed += pointerPulse.life * 0.016;
          }

          for (let i = 0; i < beads.length; i += 13) {
            const bead = beads[i];
            if (
              Math.abs(bead.x - drop.x) < drop.rx * 1.55 &&
              Math.abs(bead.y - drop.y) < drop.ry * 1.25
            ) {
              drop.ry = Math.min(drop.ry + bead.r * 0.045, drop.rx * 4.1);
              drop.rx = Math.min(drop.rx + bead.r * 0.012, 10);
              bead.alpha *= 0.72;
            }
          }

          if (drop.y - drop.trail > h + drop.ry) resetRunner(drop, false);

          const trail = ctx.createLinearGradient(
            drop.x,
            drop.y - drop.trail,
            drop.x,
            drop.y + drop.ry * 0.8,
          );
          trail.addColorStop(0, "rgba(240,250,255,0)");
          trail.addColorStop(0.62, `rgba(235,247,255,${drop.alpha * 0.075})`);
          trail.addColorStop(1, `rgba(235,247,255,${drop.alpha * 0.25})`);
          ctx.strokeStyle = trail;
          ctx.lineWidth = Math.max(0.8, drop.rx * 0.26);
          ctx.beginPath();
          ctx.moveTo(drop.x, drop.y - drop.trail);
          ctx.bezierCurveTo(
            drop.x + Math.sin(drop.phase) * drop.rx,
            drop.y - drop.trail * 0.56,
            drop.x - Math.cos(drop.phase) * drop.rx * 0.45,
            drop.y - drop.trail * 0.18,
            drop.x,
            drop.y - drop.ry * 0.2,
          );
          ctx.stroke();

          drawDropSurface(drop);
        });

        const shine = ctx.createLinearGradient(0, 0, w, h);
        shine.addColorStop(0, "rgba(255,255,255,0.085)");
        shine.addColorStop(0.22, "rgba(255,255,255,0.02)");
        shine.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = shine;
        ctx.fillRect(0, 0, w, h);

        const vignette = ctx.createRadialGradient(
          w * 0.5,
          h * 0.44,
          0,
          w * 0.5,
          h * 0.44,
          Math.max(w, h) * 0.72,
        );
        vignette.addColorStop(0, "rgba(0,0,0,0)");
        vignette.addColorStop(1, "rgba(0,0,0,0.28)");
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, w, h);

        pointerPulse.life *= Math.pow(0.94, Math.max(0.2, speedValue));
        ctx.globalCompositeOperation = "source-over";
      };

      anim();
      return () => {
        cancelAnimationFrame(frameId);
        canvas.removeEventListener("pointerdown", onPointer);
        canvas.removeEventListener("pointermove", onPointer);
      };
    },
    [density, interactive, paused, showCity, speed],
  );

  return (
    <CanvasHost
      start={start}
      height={height}
      className={className}
      surfaceClassName="aw-rain-screen"
      style={style}
      ariaLabel="Rain on glass animation"
    />
  );
}
