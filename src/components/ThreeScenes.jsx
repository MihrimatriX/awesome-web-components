import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  clamp,
  componentStyle,
  cx,
  observeElementResize,
  pointerPosition,
  rand,
} from "./CanvasHost.jsx";
import { COMPONENT_ROOT_CLASS } from "./classNames.js";

function mapRange(value, inMin, inMax, outMin, outMax) {
  const pct = (clamp(value, inMin, inMax) - inMin) / (inMax - inMin);
  return outMin + pct * (outMax - outMin);
}

function disposeObject3D(object) {
  object.traverse((child) => {
    child.geometry?.dispose?.();
    if (Array.isArray(child.material)) {
      child.material.forEach((material) => material.dispose?.());
    } else {
      child.material?.dispose?.();
    }
  });
}

const racingVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const racingFragmentShader = `
  uniform float r;
  uniform float g;
  uniform float b;
  uniform float distanceZ;
  uniform float distanceX;
  uniform float pulse;
  uniform float speed;
  varying vec2 vUv;

  void main() {
    vec2 position = abs(-1.0 + 2.0 * vUv);
    float edging = abs((pow(position.y, 5.0) + pow(position.x, 5.0)) / 2.0);
    float perc = (0.2 * pow(speed + 1.0, 2.0) + edging * 0.8) * distanceZ * distanceX;
    float red = r * perc + pulse;
    float green = g * perc + pulse;
    float blue = b * perc + pulse;
    gl_FragColor = vec4(red, green, blue, 1.0);
  }
`;

export function RacingLines({
  height = 360,
  className,
  style,
  rows = 14,
  cols = 16,
}) {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    let frameId = 0;
    let disposed = false;
    let isPointerDown = false;
    const mouse = { x: 0, y: 0 };
    const camPos = { x: 0, y: 0, z: 520 };
    const speedNormal = 4;
    const speedFast = 34;
    let speed = speedNormal;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(92, 1, 1, 9000);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true,
    });
    renderer.setClearColor(0x000000, 1);
    host.appendChild(renderer.domElement);

    const size = { width: 92, height: 28, depth: 142 };
    const gap = 20;
    const planeOffset = 230;
    const allDepth = rows * (size.depth + gap);
    const allWidth = cols * (size.width + gap);
    const geometry = new THREE.BoxGeometry(size.width, size.height, size.depth);
    const boxes = [];

    function createMaterial() {
      const slow = {
        r: rand(0, 0.2),
        g: rand(0.5, 0.9),
        b: rand(0.3, 0.7),
      };
      const fast = {
        r: rand(0.9, 1),
        g: rand(0.1, 0.7),
        b: rand(0.2, 0.5),
      };
      const uniforms = {
        r: { value: slow.r },
        g: { value: slow.g },
        b: { value: slow.b },
        distanceX: { value: 1 },
        distanceZ: { value: 1 },
        pulse: { value: 0 },
        speed: { value: 0 },
      };

      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: racingVertexShader,
        fragmentShader: racingFragmentShader,
      });

      return { material, slow, fast, uniforms };
    }

    for (let z = 0; z < rows; z += 1) {
      for (let x = 0; x < cols; x += 1) {
        [-1, 1].forEach((side) => {
          if (Math.random() < 0.38) return;
          const data = createMaterial();
          const mesh = new THREE.Mesh(geometry, data.material);
          mesh.userData = {
            ...data,
            baseX: (x - cols / 2) * (size.width + gap),
            baseY: side * planeOffset,
            posZ: -z * (size.depth + gap) - rand(0, 90),
            driftX: 0,
            driftTargetX: 0,
            side,
          };
          scene.add(mesh);
          boxes.push(mesh);
        });
      }
    }

    camera.position.set(0, 0, 520);
    camera.lookAt(0, 0, -1200);

    const resize = () => {
      const rect = host.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const stopObserving = observeElementResize(host, resize);
    resize();

    const onPointerDown = () => {
      isPointerDown = true;
    };
    const onPointerUp = () => {
      isPointerDown = false;
    };
    const onPointerMove = (event) => {
      const pos = pointerPosition(event, host);
      const rect = host.getBoundingClientRect();
      mouse.x = (pos.x / Math.max(1, rect.width)) * 2 - 1;
      mouse.y = -(pos.y / Math.max(1, rect.height)) * 2 + 1;
    };

    host.addEventListener("pointerdown", onPointerDown);
    host.addEventListener("pointerup", onPointerUp);
    host.addEventListener("pointerleave", onPointerUp);
    host.addEventListener("pointermove", onPointerMove);

    const render = () => {
      if (disposed) return;
      frameId = requestAnimationFrame(render);
      speed += ((isPointerDown ? speedFast : speedNormal) - speed) * 0.05;
      const currentSpeed = (speed - speedNormal) / (speedFast - speedNormal);

      boxes.forEach((box) => {
        const data = box.userData;
        data.posZ += speed;
        if (data.posZ > 420) {
          data.posZ -= allDepth + rand(0, 140);
          data.driftTargetX = 0;
        }

        if (Math.random() > 0.995) {
          data.driftTargetX = rand(-1.2, 1.2) * (size.width + gap);
        }

        data.driftX += (data.driftTargetX - data.driftX) * 0.08;
        box.position.set(data.baseX + data.driftX, data.baseY, data.posZ);

        const distanceZ = clamp(1 - Math.abs(data.posZ) / allDepth, 0.05, 1.2);
        const distanceX = clamp(
          1 - Math.abs(box.position.x) / (allWidth / 2),
          0.12,
          1,
        );
        data.uniforms.distanceZ.value = distanceZ;
        data.uniforms.distanceX.value = distanceX;
        data.uniforms.speed.value = currentSpeed;

        const color = isPointerDown ? data.fast : data.slow;
        data.uniforms.r.value += (color.r - data.uniforms.r.value) * 0.1;
        data.uniforms.g.value += (color.g - data.uniforms.g.value) * 0.1;
        data.uniforms.b.value += (color.b - data.uniforms.b.value) * 0.1;

        if (Math.random() > 0.9995 - currentSpeed * 0.005) {
          data.uniforms.pulse.value = 1;
        }
        data.uniforms.pulse.value -=
          (data.uniforms.pulse.value * 0.1) / (currentSpeed + 1);
      });

      camPos.x += (mouse.x * 360 - camPos.x) * 0.025;
      camPos.y += (mouse.y * 140 - camPos.y) * 0.05;
      camera.position.set(camPos.x, camPos.y, camPos.z);
      camera.rotation.y = camPos.x / -1100;
      camera.rotation.x = camPos.y / 1200;
      camera.rotation.z = (camPos.x - mouse.x * 360) / 2200;
      renderer.render(scene, camera);
    };

    render();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      stopObserving();
      host.removeEventListener("pointerdown", onPointerDown);
      host.removeEventListener("pointerup", onPointerUp);
      host.removeEventListener("pointerleave", onPointerUp);
      host.removeEventListener("pointermove", onPointerMove);
      disposeObject3D(scene);
      geometry.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [cols, rows]);

  return (
    <div
      className={cx(COMPONENT_ROOT_CLASS, className)}
      style={componentStyle(height, style)}
    >
      <div
        ref={hostRef}
        className="aw-three-host aw-racing-lines"
        role="img"
        aria-label="Three.js racing lines tunnel"
      />
    </div>
  );
}

function createLionSceneObjects() {
  const material = (color) =>
    new THREE.MeshLambertMaterial({ color, flatShading: true });
  const yellow = material(0xfdd276);
  const red = material(0xad3525);
  const orange = material(0xe55d2b);
  const white = material(0xffffff);
  const purple = material(0x451954);
  const grey = material(0x653f4c);
  const black = material(0x302925);

  const root = new THREE.Group();
  const head = new THREE.Group();
  const mane = new THREE.Group();
  const maneParts = [];
  const mustaches = [];

  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(30, 80, 140, 4),
    yellow,
  );
  body.position.set(0, -30, -60);
  body.castShadow = true;
  body.receiveShadow = true;
  root.add(body);

  const kneeGeom = new THREE.BoxGeometry(25, 80, 80);
  kneeGeom.translate(0, 50, 0);
  const leftKnee = new THREE.Mesh(kneeGeom, yellow);
  leftKnee.position.set(65, -110, -20);
  leftKnee.rotation.z = -0.3;
  const rightKnee = leftKnee.clone();
  rightKnee.position.x = -65;
  rightKnee.rotation.z = 0.3;

  const footGeom = new THREE.BoxGeometry(40, 20, 20);
  const backLeftFoot = new THREE.Mesh(footGeom, yellow);
  backLeftFoot.position.set(75, -90, 30);
  const backRightFoot = backLeftFoot.clone();
  backRightFoot.position.x = -75;
  const frontLeftFoot = new THREE.Mesh(footGeom, yellow);
  frontLeftFoot.position.set(22, -90, 40);
  const frontRightFoot = frontLeftFoot.clone();
  frontRightFoot.position.x = -22;
  root.add(
    leftKnee,
    rightKnee,
    backLeftFoot,
    backRightFoot,
    frontLeftFoot,
    frontRightFoot,
  );

  const maneGeom = new THREE.BoxGeometry(40, 40, 15);
  for (let row = 0; row < 4; row += 1) {
    for (let col = 0; col < 4; col += 1) {
      const mesh = new THREE.Mesh(maneGeom, red);
      mesh.position.set(col * 40 - 60, row * 40 - 60, 0);
      mesh.castShadow = true;

      const edge = col === 0 || col === 3 || row === 0 || row === 3;
      const corner = (col === 0 || col === 3) && (row === 0 || row === 3);
      const amp = corner ? -12 : edge ? rand(4, 12) : rand(0, 4);
      maneParts.push({
        mesh,
        amp,
        zOffset: 0,
        periodOffset: rand(0, Math.PI * 2),
      });
      mane.add(mesh);
    }
  }
  mane.position.set(0, -10, 80);
  head.add(mane);

  const face = new THREE.Mesh(new THREE.BoxGeometry(80, 80, 80), yellow);
  face.position.z = 135;
  face.castShadow = true;
  head.add(face);

  const spotGeom = new THREE.BoxGeometry(4, 4, 4);
  [
    [-39, 25, 140],
    [-39, 5, 150],
    [-39, -15, 160],
    [39, 25, 140],
    [39, 5, 150],
    [39, -15, 160],
  ].forEach((position) => {
    const spot = new THREE.Mesh(spotGeom, red);
    spot.position.set(...position);
    head.add(spot);
  });

  const eyeGeom = new THREE.BoxGeometry(5, 30, 30);
  const leftEye = new THREE.Mesh(eyeGeom, white);
  leftEye.position.set(40, 25, 120);
  const rightEye = leftEye.clone();
  rightEye.position.x = -40;
  head.add(leftEye, rightEye);

  const irisGeom = new THREE.BoxGeometry(4, 10, 10);
  const leftIris = new THREE.Mesh(irisGeom, purple);
  leftIris.position.set(42, 25, 120);
  const rightIris = leftIris.clone();
  rightIris.position.x = -42;
  head.add(leftIris, rightIris);

  const nose = new THREE.Mesh(new THREE.BoxGeometry(40, 40, 20), grey);
  nose.position.set(0, 25, 170);
  head.add(nose);

  const mouth = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 10), black);
  mouth.position.set(0, -30, 171);
  mouth.scale.set(0.5, 0.5, 1);
  head.add(mouth);

  const smile = new THREE.Mesh(
    new THREE.TorusGeometry(12, 4, 4, 16, Math.PI),
    black,
  );
  smile.position.set(0, -15, 173);
  smile.rotation.z = -Math.PI;
  head.add(smile);

  const lips = new THREE.Mesh(new THREE.BoxGeometry(40, 15, 20), orange);
  lips.position.set(0, -45, 165);
  head.add(lips);

  const earGeom = new THREE.BoxGeometry(20, 20, 20);
  const leftEar = new THREE.Mesh(earGeom, yellow);
  leftEar.position.set(50, 50, 105);
  const rightEar = leftEar.clone();
  rightEar.position.x = -50;
  head.add(leftEar, rightEar);

  const mustacheGeom = new THREE.BoxGeometry(30, 2, 1);
  mustacheGeom.translate(15, 0, 0);
  [
    { x: 30, y: -5, z: 175, rot: 0 },
    { x: 35, y: -12, z: 175, rot: Math.PI / 8 },
    { x: 35, y: 2, z: 175, rot: -Math.PI / 8 },
    { x: -30, y: -5, z: 175, rot: Math.PI },
    { x: -35, y: -12, z: 175, rot: Math.PI - Math.PI / 8 },
    { x: -35, y: 2, z: 175, rot: Math.PI + Math.PI / 8 },
  ].forEach((data) => {
    const mustache = new THREE.Mesh(mustacheGeom, grey);
    mustache.position.set(data.x, data.y, data.z);
    mustache.rotation.z = data.rot;
    mustache.userData.baseRotationZ = data.rot;
    mustaches.push(mustache);
    head.add(mustache);
  });

  head.position.y = 60;
  root.add(head);

  const fan = new THREE.Group();
  fan.position.z = 350;
  const core = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 20), grey);
  const sphere = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 3), yellow);
  sphere.position.z = 15;
  const propeller = new THREE.Group();
  const bladeGeom = new THREE.BoxGeometry(10, 30, 2);
  bladeGeom.translate(0, 25, 0);
  for (let i = 0; i < 4; i += 1) {
    const blade = new THREE.Mesh(bladeGeom, i % 2 ? red : grey);
    blade.rotation.z = (i / 4) * Math.PI * 2;
    propeller.add(blade);
  }
  fan.add(core, propeller, sphere);

  root.traverse((object) => {
    if (object.isMesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });

  return {
    root,
    fan,
    propeller,
    head,
    mane,
    maneParts,
    mustaches,
    leftEar,
    rightEar,
    leftEye,
    rightEye,
    leftIris,
    rightIris,
    leftKnee,
    rightKnee,
    mouth,
    smile,
    lips,
  };
}

export function ChillLion({ height = 360, className, style }) {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    let frameId = 0;
    let disposed = false;
    let blowing = false;
    let windTime = 0;
    const mouse = { x: -200, y: -200 };
    let fanSpeed = 0;
    let fanAcc = 0;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 1, 2200);
    camera.position.set(0, 0, 800);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
    });
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    host.appendChild(renderer.domElement);

    const hemi = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.5);
    const shadow = new THREE.DirectionalLight(0xffffff, 0.85);
    shadow.position.set(200, 230, 220);
    shadow.castShadow = true;
    shadow.shadow.camera.left = -400;
    shadow.shadow.camera.right = 400;
    shadow.shadow.camera.top = 400;
    shadow.shadow.camera.bottom = -400;
    const back = new THREE.DirectionalLight(0xffffff, 0.35);
    back.position.set(-120, 170, 80);
    scene.add(hemi, shadow, back);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(1000, 500),
      new THREE.MeshBasicMaterial({ color: 0xebe5e7 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -100;
    floor.receiveShadow = true;
    scene.add(floor);

    const lionShadow = new THREE.Mesh(
      new THREE.CircleGeometry(1, 48),
      new THREE.MeshBasicMaterial({
        color: 0xaaa2a7,
        transparent: true,
        opacity: 0.45,
        depthWrite: false,
      }),
    );
    lionShadow.position.set(-12, -101, 22);
    lionShadow.scale.set(108, 20, 1);
    scene.add(lionShadow);

    const lion = createLionSceneObjects();
    scene.add(lion.root, lion.fan);

    const resize = () => {
      const rect = host.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const stopObserving = observeElementResize(host, resize);
    resize();

    const updatePointer = (event) => {
      const pos = pointerPosition(event, host);
      const rect = host.getBoundingClientRect();
      mouse.x = mapRange(pos.x, 0, Math.max(1, rect.width), -200, 200);
      mouse.y = mapRange(pos.y, 0, Math.max(1, rect.height), -200, 200);
    };

    const onPointerDown = (event) => {
      blowing = true;
      updatePointer(event);
    };
    const onPointerUp = () => {
      blowing = false;
    };

    host.addEventListener("pointermove", updatePointer);
    host.addEventListener("pointerdown", onPointerDown);
    host.addEventListener("pointerup", onPointerUp);
    host.addEventListener("pointerleave", onPointerUp);

    const render = () => {
      if (disposed) return;
      frameId = requestAnimationFrame(render);

      lion.fan.lookAt(new THREE.Vector3(0, 80, 60));
      lion.fan.position.x +=
        (mapRange(mouse.x, -200, 200, -250, 250) - lion.fan.position.x) / 10;
      lion.fan.position.y +=
        (mapRange(mouse.y, -200, 200, 250, -250) - lion.fan.position.y) / 10;

      if (blowing && fanSpeed < 0.65) {
        fanAcc += 0.0015;
        fanSpeed += fanAcc;
      } else if (!blowing) {
        fanAcc = 0;
        fanSpeed *= 0.98;
      }
      lion.propeller.rotation.z += fanSpeed;

      const lookY = mapRange(mouse.x, -200, 200, -Math.PI / 4, Math.PI / 4);
      const lookX = mapRange(mouse.y, -200, 200, -Math.PI / 4, Math.PI / 4);
      const coolY = mapRange(mouse.x, -200, 200, Math.PI / 4, -Math.PI / 4);
      const coolX = mapRange(mouse.y, -200, 200, Math.PI / 4, -Math.PI / 4);
      const targetRotY = blowing ? coolY : lookY;
      const targetRotX = blowing ? coolX : lookX;
      const targetHeadZ = blowing ? 100 : 0;
      const targetHeadX = mapRange(
        mouse.x,
        -200,
        200,
        blowing ? -70 : 70,
        blowing ? 70 : -70,
      );
      const targetHeadY = mapRange(
        mouse.y,
        -200,
        200,
        blowing ? 100 : 20,
        blowing ? 20 : 100,
      );

      lion.head.rotation.y += (targetRotY - lion.head.rotation.y) / 10;
      lion.head.rotation.x += (targetRotX - lion.head.rotation.x) / 10;
      lion.head.position.z += (targetHeadZ - lion.head.position.z) / 12;
      lion.head.position.x += (targetHeadX - lion.head.position.x) / 12;
      lion.head.position.y += (targetHeadY - lion.head.position.y) / 12;

      const eyeScale = blowing ? 0.1 : 1;
      lion.leftEye.scale.y += (eyeScale - lion.leftEye.scale.y) / 14;
      lion.rightEye.scale.y = lion.leftEye.scale.y;
      lion.leftIris.scale.y +=
        ((blowing ? 0.1 : 1) - lion.leftIris.scale.y) / 14;
      lion.rightIris.scale.y = lion.leftIris.scale.y;
      lion.leftIris.scale.z += ((blowing ? 3 : 1) - lion.leftIris.scale.z) / 14;
      lion.rightIris.scale.z = lion.leftIris.scale.z;
      lion.leftIris.position.y +=
        ((blowing ? 20 : mapRange(mouse.y, -200, 200, 35, 15)) -
          lion.leftIris.position.y) /
        12;
      lion.rightIris.position.y = lion.leftIris.position.y;
      lion.leftIris.position.z +=
        ((blowing ? 120 : mapRange(mouse.x, -200, 200, 130, 110)) -
          lion.leftIris.position.z) /
        12;
      lion.rightIris.position.z +=
        ((blowing ? 120 : mapRange(mouse.x, -200, 200, 110, 130)) -
          lion.rightIris.position.z) /
        12;

      const kneeTarget = mapRange(
        mouse.x,
        -200,
        200,
        blowing ? 0.3 : -0.3,
        blowing ? -0.3 : 0.3,
      );
      lion.leftKnee.rotation.z += (kneeTarget - lion.leftKnee.rotation.z) / 12;
      lion.rightKnee.rotation.z +=
        (-kneeTarget - lion.rightKnee.rotation.z) / 12;

      const mouthX = blowing ? mapRange(mouse.x, -200, 200, -15, 15) : 0;
      const mouthY = blowing ? mapRange(mouse.y, -200, 200, -45, -40) : -30;
      const smileY = blowing ? mapRange(mouse.y, -200, 200, -20, -8) : -15;
      const smileRot = blowing
        ? mapRange(mouse.x, -200, 200, -Math.PI - 0.3, -Math.PI + 0.3)
        : -Math.PI;
      lion.mouth.position.x += (mouthX - lion.mouth.position.x) / 12;
      lion.mouth.position.y += (mouthY - lion.mouth.position.y) / 12;
      lion.mouth.position.z +=
        ((blowing ? 168 : 171) - lion.mouth.position.z) / 12;
      lion.smile.position.x += (mouthX - lion.smile.position.x) / 12;
      lion.smile.position.y += (smileY - lion.smile.position.y) / 12;
      lion.smile.position.z +=
        ((blowing ? 176 : 173) - lion.smile.position.z) / 12;
      lion.smile.rotation.z += (smileRot - lion.smile.rotation.z) / 12;
      lion.lips.position.x += (mouthX - lion.lips.position.x) / 12;
      lion.lips.position.y +=
        ((blowing ? -42 : -45) - lion.lips.position.y) / 12;

      if (blowing) {
        const dt = clamp(
          20000 / (mouse.x * mouse.x + mouse.y * mouse.y + 6000),
          0.55,
          1.2,
        );
        windTime += dt;
        lion.mane.rotation.y = -0.75 * lion.head.rotation.y;
        lion.mane.rotation.x = -0.75 * lion.head.rotation.x;

        lion.maneParts.forEach((part) => {
          part.mesh.position.z =
            part.zOffset +
            Math.cos(windTime + part.periodOffset) * part.amp * dt * 1.6;
        });

        lion.leftEar.rotation.x = (Math.cos(windTime) * Math.PI * dt) / 16;
        lion.rightEar.rotation.x = (-Math.cos(windTime) * Math.PI * dt) / 16;
        lion.mustaches.forEach((mustache, index) => {
          const amp = index < 3 ? -Math.PI / 8 : Math.PI / 8;
          mustache.rotation.y = amp + Math.cos(windTime + index) * dt * amp;
          mustache.rotation.z =
            mustache.userData.baseRotationZ + Math.cos(windTime + index) * 0.06;
        });
      } else {
        lion.mane.rotation.y += (0 - lion.mane.rotation.y) / 12;
        lion.mane.rotation.x += (0 - lion.mane.rotation.x) / 12;
        lion.maneParts.forEach((part) => {
          part.mesh.position.z += (part.zOffset - part.mesh.position.z) / 12;
        });
        lion.mustaches.forEach((mustache) => {
          mustache.rotation.y += (0 - mustache.rotation.y) / 12;
          mustache.rotation.z +=
            (mustache.userData.baseRotationZ - mustache.rotation.z) / 12;
        });
        lion.leftEar.rotation.x += (0 - lion.leftEar.rotation.x) / 12;
        lion.rightEar.rotation.x += (0 - lion.rightEar.rotation.x) / 12;
      }

      renderer.render(scene, camera);
    };

    render();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      stopObserving();
      host.removeEventListener("pointermove", updatePointer);
      host.removeEventListener("pointerdown", onPointerDown);
      host.removeEventListener("pointerup", onPointerUp);
      host.removeEventListener("pointerleave", onPointerUp);
      disposeObject3D(scene);
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      className={cx(COMPONENT_ROOT_CLASS, className)}
      style={componentStyle(height, style)}
    >
      <div
        ref={hostRef}
        className="aw-three-host aw-chill-lion"
        role="img"
        aria-label="Interactive Three.js lion and fan"
      >
        <div className="aw-chill-instructions" aria-hidden="true">
          Press and drag to make wind
          <span className="aw-chill-light">
            the lion will surely appreciate
          </span>
        </div>
      </div>
    </div>
  );
}
