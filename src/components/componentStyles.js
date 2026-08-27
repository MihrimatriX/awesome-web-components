const COMPONENT_STYLE_ID = "mihrimatrix-awesome-component-styles";

export const componentStyles = `
.mxac-root {
  --mxac-resolved-height: var(--aw-component-height, var(--mxac-component-height, 360px));
  --mxac-resolved-word-hue: var(--aw-word-hue, var(--mxac-word-hue, 350));
  display: block;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  contain: layout paint style;
  container-type: inline-size;
  font-synthesis: none;
  isolation: isolate;
  letter-spacing: 0;
  line-height: normal;
  text-size-adjust: 100%;
}

.mxac-root *,
.mxac-root *::before,
.mxac-root *::after {
  box-sizing: inherit;
}

.mxac-root :where(div, span, canvas, svg) {
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}

.mxac-root :where(div, span) {
  font: inherit;
  color: inherit;
  letter-spacing: 0;
  text-decoration: none;
  text-transform: none;
}

.mxac-root :where(div) {
  display: block;
}

.mxac-root :where(span) {
  position: static;
  display: inline;
}

.mxac-root .aw-effect,
.mxac-root .aw-three-host {
  position: relative;
  width: 100%;
  height: var(--mxac-resolved-height);
  min-height: 180px;
  overflow: hidden;
  background: #111;
  isolation: isolate;
  touch-action: none;
  user-select: none;
}

.mxac-root .aw-effect canvas,
.mxac-root .aw-three-host canvas {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  max-width: none;
  vertical-align: middle;
}

.mxac-root .aw-racing-lines {
  background: #000;
  cursor: crosshair;
}

.mxac-root .aw-chill-lion {
  background: #ebe5e7;
  cursor: grab;
}

.mxac-root .aw-chill-instructions {
  position: absolute;
  z-index: 2;
  top: 50%;
  right: 0;
  left: 0;
  margin-top: 120px;
  padding-inline: 1rem;
  color: #653f4c;
  font-family: "Open Sans", ui-sans-serif, system-ui, sans-serif;
  font-size: clamp(0.58rem, 2.4vw, 0.82rem);
  font-weight: 700;
  line-height: 1.35;
  text-align: center;
  text-transform: uppercase;
  pointer-events: none;
}

@supports (width: 1cqw) {
  .mxac-root .aw-chill-instructions {
    font-size: clamp(0.58rem, 2.1cqw, 0.82rem);
    margin-top: clamp(5rem, 26cqw, 7.5rem);
  }
}

.mxac-root .aw-chill-light {
  display: block;
  color: #993f4c;
  font-size: 0.8em;
  font-weight: 700;
  text-transform: uppercase;
}

.mxac-root .aw-rain-screen {
  background:
    radial-gradient(circle at 24% 18%, rgba(123, 163, 185, 0.28), transparent 28%),
    radial-gradient(circle at 78% 28%, rgba(195, 153, 105, 0.18), transparent 24%),
    linear-gradient(135deg, #111820 0%, #243240 45%, #0c1015 100%);
}

.mxac-root .aw-rainbow-transfer {
  background: #222;
}

.mxac-root .aw-chill-lion:active {
  cursor: grabbing;
}

.mxac-root .aw-random-words {
  display: grid;
  width: 100%;
  height: var(--mxac-resolved-height);
  min-height: 180px;
  place-items: center;
  overflow: hidden;
  background: hsl(var(--mxac-resolved-word-hue), 100%, 50%);
}

.mxac-root .aw-random-words svg {
  display: block;
  width: 100%;
  height: 100%;
  max-width: none;
  overflow: visible;
}

.mxac-root .aw-random-words-layer {
  transform-box: fill-box;
  transform-origin: center;
  animation: mxac-pop-out var(--mxac-word-duration, 2s) ease-in-out infinite;
  animation-play-state: var(--mxac-word-play-state, running);
}

.mxac-root .aw-random-words text {
  font-family: Bangers, Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;
  font-size: clamp(42px, 12vw, 126px);
  font-style: italic;
  font-weight: 900;
  letter-spacing: 0.035em;
  text-transform: uppercase;
}

@supports (width: 1cqw) {
  .mxac-root .aw-random-words text {
    font-size: clamp(34px, 18cqw, 122px);
  }
}

@keyframes mxac-pop-out {
  0% {
    opacity: 1;
    transform: scale3d(0, 0, 1);
  }

  25% {
    opacity: 1;
    transform: scale3d(1, 1, 1);
  }

  58% {
    opacity: 1;
    transform: scale3d(1, 1, 1);
  }

  100% {
    opacity: 0;
    transform: scale3d(1.45, 1.45, 1);
  }
}

.mxac-root .aw-slide-clock {
  --mxac-slide-size: clamp(3rem, 10vw, 5.4rem);
  display: grid;
  width: 100%;
  height: var(--mxac-resolved-height);
  min-height: 180px;
  place-items: stretch center;
  overflow: hidden;
  background: #131415;
  color: rgba(224, 230, 235, 0.89);
  font-family:
    "Roboto Condensed", "Arial Narrow", ui-sans-serif, system-ui, sans-serif;
  font-weight: 300;
}

@supports (width: 1cqw) {
  .mxac-root .aw-slide-clock {
    --mxac-slide-size: clamp(2.8rem, 13cqw, 5.4rem);
  }
}

.mxac-root .aw-slide-clock-inner {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  height: 100%;
  font-size: var(--mxac-slide-size);
  line-height: 1;
}

.mxac-root .aw-slide-clock-part {
  display: flex;
  align-items: flex-start;
  height: 100%;
}

.mxac-root .aw-slide-column {
  display: grid;
  width: 0.68em;
  text-align: center;
  transition: transform 300ms ease;
}

.mxac-root .aw-slide-num {
  display: block;
  width: 100%;
  height: 1em;
  text-align: center;
  opacity: 0.025;
  transition:
    opacity 500ms ease,
    text-shadow 100ms ease;
}

.mxac-root .aw-slide-num.visible {
  opacity: 1;
  text-shadow: 1px 1px 0 #336699;
}

.mxac-root .aw-slide-num.close {
  opacity: 0.35;
}

.mxac-root .aw-slide-num.far {
  opacity: 0.15;
}

.mxac-root .aw-slide-num.distant {
  opacity: 0.1;
}

.mxac-root .aw-slide-colon {
  display: inline-grid;
  width: 0.34em;
  height: 100%;
  align-items: flex-start;
  justify-items: center;
  transform: translateY(calc(var(--mxac-resolved-height) / 2 - .52em));
  transition: transform 300ms ease;
}

.mxac-root .aw-digital-clock {
  position: relative;
  display: grid;
  width: 100%;
  height: var(--mxac-resolved-height);
  min-height: 220px;
  place-items: center;
  overflow: hidden;
  background:
    radial-gradient(circle at 48% 42%, rgba(40, 116, 130, 0.58), transparent 42%),
    linear-gradient(135deg, #07101b 0%, #14202c 42%, #241836 100%);
  perspective: 1000px;
}

.mxac-root .aw-digital-clock > .mxac-root {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.mxac-root .aw-digital-network {
  position: absolute;
  inset: 0;
  height: 100%;
  min-height: 0;
  background: transparent;
}

.mxac-root .aw-digital-time {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  transform:
    translateZ(20px)
    rotateX(calc(var(--aw-mouse-y, var(--mxac-mouse-y, 0)) * 34deg))
    rotateY(calc(var(--aw-mouse-x, var(--mxac-mouse-x, 0)) * 34deg));
  transform-style: preserve-3d;
  transition: transform 160ms ease-out;
}

.mxac-root .aw-digital-slot {
  position: relative;
  display: flex;
  margin-right: clamp(7px, 1.5vw, 20px);
}

.mxac-root .aw-digital-slot:nth-child(2),
.mxac-root .aw-digital-slot:nth-child(4) {
  margin-right: clamp(26px, 4vw, 58px);
}

.mxac-root .aw-seven-digit {
  position: relative;
  display: block;
  width: clamp(30px, 7vw, 78px);
  aspect-ratio: 0.52;
  transform-style: preserve-3d;
}

@supports (width: 1cqw) {
  .mxac-root .aw-digital-slot {
    margin-right: clamp(5px, 1.4cqw, 18px);
  }

  .mxac-root .aw-digital-slot:nth-child(2),
  .mxac-root .aw-digital-slot:nth-child(4) {
    margin-right: clamp(16px, 4.8cqw, 48px);
  }

  .mxac-root .aw-seven-digit {
    width: clamp(24px, 10cqw, 72px);
  }
}

.mxac-root .aw-seven-segment {
  position: absolute;
  border-radius: 999px;
  background: #fff;
  opacity: 0.12;
  box-shadow:
    0 0 18px rgba(11, 253, 253, 0.55),
    inset 0 0 4px #0bfdfd;
  transition:
    opacity 300ms ease,
    transform 600ms cubic-bezier(0.5, 0, 0.5, 1);
  transform: translateZ(-18px);
}

.mxac-root .aw-seven-segment.aw-active {
  opacity: 1;
  transform: translateZ(18px);
}

.mxac-root .aw-seven-segment:nth-child(1),
.mxac-root .aw-seven-segment:nth-child(4),
.mxac-root .aw-seven-segment:nth-child(7) {
  left: 16%;
  width: 68%;
  height: 7%;
}

.mxac-root .aw-seven-segment:nth-child(1) {
  top: 3%;
}

.mxac-root .aw-seven-segment:nth-child(4) {
  top: 47%;
}

.mxac-root .aw-seven-segment:nth-child(7) {
  bottom: 3%;
}

.mxac-root .aw-seven-segment:nth-child(2),
.mxac-root .aw-seven-segment:nth-child(3),
.mxac-root .aw-seven-segment:nth-child(5),
.mxac-root .aw-seven-segment:nth-child(6) {
  width: 10%;
  height: 39%;
}

.mxac-root .aw-seven-segment:nth-child(2),
.mxac-root .aw-seven-segment:nth-child(3) {
  top: 8%;
}

.mxac-root .aw-seven-segment:nth-child(5),
.mxac-root .aw-seven-segment:nth-child(6) {
  bottom: 8%;
}

.mxac-root .aw-seven-segment:nth-child(2),
.mxac-root .aw-seven-segment:nth-child(5) {
  left: 4%;
}

.mxac-root .aw-seven-segment:nth-child(3),
.mxac-root .aw-seven-segment:nth-child(6) {
  right: 4%;
}

.mxac-root .aw-digital-colon {
  position: absolute;
  top: 32%;
  left: calc(100% + clamp(7px, 1.2vw, 18px));
  width: clamp(7px, 1.1vw, 14px);
  height: clamp(7px, 1.1vw, 14px);
  border-radius: 999px;
  background: #fff;
  box-shadow:
    0 0 18px #0bfdfd,
    inset 0 0 5px #0bfdfd;
  animation: mxac-colon-pulse 1s alternate cubic-bezier(0.5, 0, 0.5, 1) infinite;
}

.mxac-root .aw-digital-colon::after {
  position: absolute;
  top: clamp(30px, 6vw, 68px);
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  background: inherit;
  box-shadow: inherit;
  content: "";
}

@supports (width: 1cqw) {
  .mxac-root .aw-digital-colon {
    left: calc(100% + clamp(5px, 1.6cqw, 16px));
    width: clamp(5px, 1.8cqw, 13px);
    height: clamp(5px, 1.8cqw, 13px);
  }

  .mxac-root .aw-digital-colon::after {
    top: clamp(22px, 8.2cqw, 58px);
  }
}

@keyframes mxac-colon-pulse {
  to {
    opacity: 0.45;
  }
}

.mxac-root .aw-campfire {
  display: grid;
  width: 100%;
  height: var(--mxac-resolved-height);
  min-height: 220px;
  place-items: center;
  overflow: hidden;
  background: radial-gradient(circle at 50% 52%, #550d39 0%, #270537 72%);
}

.mxac-root .aw-campfire-stage {
  position: relative;
  width: min(78%, 520px);
  aspect-ratio: 1;
}

.mxac-root .aw-campfire-core {
  position: absolute;
  inset: 0;
  transform: translateY(7%) scale(var(--mxac-campfire-core-scale, 0.76));
  transform-origin: center;
}

.mxac-root .aw-campfire-core::before {
  position: absolute;
  inset: 25% 18% 14%;
  border-radius: 50%;
  background:
    radial-gradient(circle, rgba(255, 138, 34, 0.42), rgba(255, 71, 33, 0.1) 45%, transparent 70%);
  filter: blur(18px);
  content: "";
  transform: translateY(12%);
}

.mxac-root .aw-logs,
.mxac-root .aw-sticks,
.mxac-root .aw-fire,
.mxac-root .aw-sparks {
  position: absolute;
  inset: 0;
}

.mxac-root .aw-log {
  position: absolute;
  bottom: 18%;
  left: 30%;
  width: 40%;
  height: 12%;
  overflow: hidden;
  border-radius: 999px;
  background: #781e20;
  box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.15);
}

.mxac-root .aw-log::before {
  position: absolute;
  top: 50%;
  left: 16%;
  width: 4%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: #b35050;
  box-shadow:
    0 0 0 3px #781e20,
    0 0 0 12px #b35050,
    0 0 0 15px #781e20,
    0 0 0 26px #b35050,
    0 0 0 29px #781e20;
  content: "";
  transform: translate(-50%, -50%);
}

.mxac-root .aw-log:nth-child(1) {
  transform: rotate(150deg) scaleX(0.75);
  z-index: 22;
}

.mxac-root .aw-log:nth-child(2) {
  bottom: 21%;
  left: 35%;
  transform: rotate(110deg) scaleX(0.75);
  z-index: 12;
}

.mxac-root .aw-log:nth-child(3) {
  bottom: 18%;
  left: 22%;
  transform: rotate(50deg) scaleX(0.75);
  z-index: 18;
}

.mxac-root .aw-log:nth-child(4) {
  bottom: 23%;
  left: 28%;
  transform: rotate(20deg) scaleX(0.74);
  z-index: 14;
}

.mxac-root .aw-log:nth-child(5) {
  bottom: 22%;
  left: 38%;
  transform: rotate(-32deg) scaleX(0.72);
  z-index: 13;
}

.mxac-root .aw-log:nth-child(6) {
  bottom: 15%;
  left: 35%;
  transform: rotate(-12deg) scaleX(0.77);
  z-index: 24;
}

.mxac-root .aw-log:nth-child(7) {
  bottom: 16%;
  left: 25%;
  transform: rotate(12deg) scaleX(0.75);
  z-index: 24;
}

.mxac-root .aw-log-streak {
  position: absolute;
  height: 3%;
  border-radius: 999px;
  background: #b35050;
}

.mxac-root .aw-log-streak:nth-child(1) {
  top: 16%;
  left: 18%;
  width: 38%;
}

.mxac-root .aw-log-streak:nth-child(2) {
  top: 16%;
  left: 61%;
  width: 24%;
}

.mxac-root .aw-log-streak:nth-child(3) {
  top: 34%;
  left: 16%;
  width: 58%;
}

.mxac-root .aw-log-streak:nth-child(4) {
  top: 50%;
  left: 44%;
  width: 50%;
}

.mxac-root .aw-log-streak:nth-child(5) {
  top: 68%;
  left: 28%;
  width: 42%;
}

.mxac-root .aw-log-streak:nth-child(6) {
  top: 34%;
  left: 76%;
  width: 12%;
}

.mxac-root .aw-log-streak:nth-child(7) {
  top: 49%;
  left: 15%;
  width: 18%;
}

.mxac-root .aw-log-streak:nth-child(8) {
  top: 50%;
  left: 72%;
  width: 18%;
}

.mxac-root .aw-log-streak:nth-child(9) {
  top: 68%;
  left: 74%;
  width: 16%;
}

.mxac-root .aw-log-streak:nth-child(10) {
  top: 82%;
  left: 38%;
  width: 38%;
}

.mxac-root .aw-stick {
  position: absolute;
  bottom: 26%;
  left: 46%;
  width: 4%;
  height: 28%;
  border-radius: 999px;
  background: #b35050;
  transform-origin: bottom center;
}

.mxac-root .aw-stick:nth-child(1) {
  transform: rotate(22deg);
}

.mxac-root .aw-stick:nth-child(2) {
  transform: rotate(-22deg);
}

.mxac-root .aw-stick:nth-child(3) {
  left: 52%;
  transform: rotate(41deg);
}

.mxac-root .aw-stick:nth-child(4) {
  left: 42%;
  transform: rotate(-43deg);
}

.mxac-root .aw-fire {
  bottom: 24%;
  top: auto;
  height: 48%;
  transform-origin: bottom center;
  filter: drop-shadow(0 0 28px rgba(255, 136, 35, 0.32));
}

.mxac-root .aw-flame {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 13%;
  height: 42%;
  border-radius: 48% 52% 50% 50%;
  clip-path: polygon(50% 0, 88% 32%, 78% 78%, 50% 100%, 22% 78%, 12% 32%);
  transform: translateX(-50%) translateY(0) scaleX(1) scaleY(1);
  transform-origin: 50% 100%;
  animation: mxac-flame var(--mxac-campfire-flame-duration, 1.25s) ease-in-out infinite;
  animation-play-state: var(--mxac-campfire-play-state, running);
}

.mxac-root .aw-fire-red .aw-flame {
  background: #e83921;
}

.mxac-root .aw-fire-orange .aw-flame {
  background: #ff8b24;
}

.mxac-root .aw-fire-yellow .aw-flame {
  background: #ffd04d;
}

.mxac-root .aw-fire-white .aw-flame {
  background: #fff8d8;
}

.mxac-root .aw-fire-red .aw-flame:nth-child(1) {
  left: 36%;
  height: 58%;
  animation-delay: -0.2s;
}

.mxac-root .aw-fire-red .aw-flame:nth-child(2) {
  left: 46%;
  height: 72%;
  animation-delay: -0.9s;
}

.mxac-root .aw-fire-red .aw-flame:nth-child(3) {
  left: 57%;
  height: 63%;
  animation-delay: -0.55s;
}

.mxac-root .aw-fire-red .aw-flame:nth-child(4) {
  left: 64%;
  height: 42%;
}

.mxac-root .aw-fire-red .aw-flame:nth-child(n + 5) {
  opacity: 0.72;
}

.mxac-root .aw-fire-orange {
  transform: scale(0.76);
}

.mxac-root .aw-fire-yellow {
  transform: scale(0.52);
}

.mxac-root .aw-fire-white {
  transform: scale(0.32);
}

.mxac-root .aw-fire-orange .aw-flame:nth-child(2),
.mxac-root .aw-fire-yellow .aw-flame:nth-child(2),
.mxac-root .aw-fire-white .aw-flame:nth-child(2) {
  left: 42%;
  height: 70%;
}

.mxac-root .aw-fire-orange .aw-flame:nth-child(3),
.mxac-root .aw-fire-yellow .aw-flame:nth-child(3),
.mxac-root .aw-fire-white .aw-flame:nth-child(3) {
  left: 58%;
  height: 62%;
  animation-delay: -0.45s;
}

.mxac-root .aw-fire-orange .aw-flame:nth-child(n + 4),
.mxac-root .aw-fire-yellow .aw-flame:nth-child(n + 4),
.mxac-root .aw-fire-white .aw-flame:nth-child(n + 4) {
  opacity: 0.72;
}

@keyframes mxac-flame {
  0%,
  100% {
    transform: translateX(-50%) translateY(0) scaleX(1) scaleY(1);
  }

  50% {
    transform: translateX(-50%) translateY(-8%) scaleX(0.88) scaleY(1.18);
  }
}

.mxac-root .aw-spark {
  position: absolute;
  bottom: 48%;
  left: 50%;
  width: 2%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: #ffd04d;
  opacity: 0;
  animation: mxac-spark var(--mxac-campfire-spark-duration, 2s) linear infinite;
  animation-play-state: var(--mxac-campfire-play-state, running);
}

.mxac-root .aw-spark:nth-child(1) {
  animation-delay: 0.1s;
}

.mxac-root .aw-spark:nth-child(2) {
  left: 45%;
  animation-delay: 0.4s;
}

.mxac-root .aw-spark:nth-child(3) {
  left: 56%;
  animation-delay: 0.8s;
}

.mxac-root .aw-spark:nth-child(4) {
  left: 42%;
  animation-delay: 1.1s;
}

.mxac-root .aw-spark:nth-child(5) {
  left: 59%;
  animation-delay: 1.35s;
}

.mxac-root .aw-spark:nth-child(6) {
  left: 49%;
  animation-delay: 1.65s;
}

.mxac-root .aw-spark:nth-child(7) {
  left: 54%;
  animation-delay: 1.85s;
}

.mxac-root .aw-spark:nth-child(8) {
  left: 39%;
  animation-delay: 2.05s;
}

@keyframes mxac-spark {
  0% {
    opacity: 0;
    transform: translate(0, 0) scale(0);
  }

  20% {
    opacity: 1;
    transform: translate(12px, -32px) scale(1);
  }

  100% {
    opacity: 0;
    transform: translate(-24px, -160px) scale(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .mxac-root .aw-random-words-layer,
  .mxac-root .aw-digital-colon,
  .mxac-root .aw-flame,
  .mxac-root .aw-spark {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }

  .mxac-root .aw-slide-column,
  .mxac-root .aw-slide-num,
  .mxac-root .aw-digital-time,
  .mxac-root .aw-seven-segment {
    transition-duration: 0.01ms !important;
  }
}
`;

export function ensureComponentStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(COMPONENT_STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = COMPONENT_STYLE_ID;
  style.textContent = componentStyles;
  document.head.appendChild(style);
}
