import * as THREE from "./assets/vendor/three/three.module.js";

const homeStage = document.querySelector(".hero-visual");
const pageHero = document.querySelector(".page-hero");
let stage = homeStage;
let canvas = document.querySelector("#three-hero");
let fallback = document.querySelector(".hero-architecture");

if (!stage && pageHero) {
  stage = pageHero;
  canvas = document.createElement("canvas");
  canvas.className = "page-three";
  canvas.setAttribute("aria-hidden", "true");
  pageHero.prepend(canvas);
}

if (stage && canvas) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const page = (document.body.dataset.page || "home").toLowerCase();
  const variants = {
    home: { color: 0xd5e77a, geometry: "orb" },
    services: { color: 0xd7ee76, geometry: "knot" },
    industries: { color: 0xe8a085, geometry: "poly" },
    work: { color: 0xc5a2ef, geometry: "knot" },
    about: { color: 0xdde995, geometry: "torus" },
    process: { color: 0xf09873, geometry: "knot" },
    pricing: { color: 0xdbd486, geometry: "poly" },
    contact: { color: 0xcba6e9, geometry: "torus" }
  };

  try {
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: window.innerWidth > 600, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.35));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 32);
    camera.position.set(0, 0, 6.2);
    const group = new THREE.Group();
    scene.add(group);
    scene.add(new THREE.HemisphereLight(0xf7f1dc, 0x18150f, 1.55));

    const key = new THREE.PointLight(0xd8f566, 38, 16, 2);
    key.position.set(-2.7, 2.8, 3);
    scene.add(key);
    const fill = new THREE.PointLight(0xff916e, 34, 15, 2);
    fill.position.set(2.9, 0.8, -1.4);
    scene.add(fill);
    const lilac = new THREE.PointLight(0xc7a6ff, 16, 12, 2);
    lilac.position.set(0.1, -2.8, 1.8);
    scene.add(lilac);

    const variant = variants[page] || variants.home;
    const geometryByType = {
      orb: () => new THREE.SphereGeometry(1.27, 96, 64),
      knot: () => new THREE.TorusKnotGeometry(0.86, 0.23, 196, 28, 2, 3),
      torus: () => new THREE.TorusGeometry(0.88, 0.28, 30, 128),
      poly: () => new THREE.DodecahedronGeometry(1.12, 2)
    };
    const geometry = geometryByType[variant.geometry]();
    geometry.computeVertexNormals();
    const material = new THREE.MeshPhysicalMaterial({
      color: variant.color,
      metalness: 0.34,
      roughness: 0.22,
      emissive: 0x1a1a0d,
      emissiveIntensity: 0.32,
      clearcoat: 0.94,
      clearcoatRoughness: 0.13,
      iridescence: 0.24,
      iridescenceIOR: 1.2,
      iridescenceThicknessRange: [130, 390]
    });
    const uniforms = { uTime: { value: 0 } };
    material.onBeforeCompile = shader => {
      shader.uniforms.uTime = uniforms.uTime;
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", "#include <common>\nuniform float uTime;")
        .replace("#include <begin_vertex>", `#include <begin_vertex>
          float waveA = sin(position.x * 3.1 + uTime * 0.38) * cos(position.y * 2.7 - uTime * 0.3);
          float waveB = cos(position.z * 3.6 + uTime * 0.24) * sin(position.x * 2.2 + uTime * 0.33);
          float waveC = sin((position.x + position.y + position.z) * 2.1 - uTime * 0.2);
          transformed += normalize(objectNormal) * (waveA * 0.075 + waveB * 0.055 + waveC * 0.035);`);
    };

    const object = new THREE.Mesh(geometry, material);
    object.rotation.set(0.2, -0.3, 0.12);
    group.add(object);

    if (variant.geometry !== "orb") {
      const outline = new THREE.Mesh(
        new THREE.TorusKnotGeometry(1.35, 0.004, 140, 4, 2, 3),
        new THREE.MeshBasicMaterial({ color: 0xf0edda, wireframe: true, transparent: true, opacity: 0.045 })
      );
      outline.rotation.set(0.3, 0.15, -0.2);
      group.add(outline);
    }

    const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0xff916e, transparent: true, opacity: 0.58 });
    const orbit = new THREE.Mesh(new THREE.TorusGeometry(1.7, 0.007, 4, 160, Math.PI * 1.32), orbitMaterial);
    orbit.rotation.set(0.85, 0.18, -0.55);
    group.add(orbit);
    const orbit2 = new THREE.Mesh(new THREE.TorusGeometry(1.86, 0.005, 3, 140, Math.PI * 0.76), new THREE.MeshBasicMaterial({ color: 0xd8f566, transparent: true, opacity: 0.48 }));
    orbit2.rotation.set(1.2, -0.7, 0.26);
    group.add(orbit2);

    if (!reduceMotion && window.gsap) {
      group.scale.setScalar(0.83);
      window.gsap.to(group.scale, { x: 1, y: 1, z: 1, duration: 1.65, delay: 0.25, ease: "elastic.out(1, 0.72)" });
    }

    if (page === "home") {
      const markCanvas = document.createElement("canvas");
      markCanvas.width = 128;
      markCanvas.height = 128;
      const context = markCanvas.getContext("2d");
      const gradient = context.createLinearGradient(18, 20, 108, 110);
      gradient.addColorStop(0, "#e7ff9b");
      gradient.addColorStop(1, "#ff916e");
      context.fillStyle = gradient;
      context.fill(new Path2D("M19 101V19h24l39 49V19h19v82H78L38 52v49z"));
      const texture = new THREE.CanvasTexture(markCanvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      const mark = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false }));
      mark.scale.set(0.46, 0.46, 1);
      mark.position.set(0, 0.02, 1.33);
      group.add(mark);
    }

    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    stage.addEventListener("pointermove", event => {
      const rect = stage.getBoundingClientRect();
      pointer.targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 0.48;
      pointer.targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 0.32;
    });
    stage.addEventListener("pointerleave", () => { pointer.targetX = 0; pointer.targetY = 0; });

    let active = false;
    let elapsed = 0;
    let lastFrame = performance.now();
    const resize = () => {
      const bounds = stage.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      renderer.setSize(bounds.width, bounds.height, false);
      camera.aspect = bounds.width / bounds.height;
      camera.position.z = page !== "home" && bounds.width > 760 ? 8.6 : bounds.width < 520 ? 7.1 : 6.2;
      if (page !== "home") group.position.x = bounds.width > 760 ? 3.8 : 0.95;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    };
    const render = () => {
      const now = performance.now();
      elapsed += Math.min((now - lastFrame) / 1000, 0.05);
      lastFrame = now;
      uniforms.uTime.value = reduceMotion ? 0 : elapsed;
      pointer.x += (pointer.targetX - pointer.x) * 0.04;
      pointer.y += (pointer.targetY - pointer.y) * 0.04;
      if (!reduceMotion) {
        group.rotation.y = -0.15 + pointer.x + Math.sin(elapsed * 0.18) * 0.08 + window.scrollY * 0.00012;
        group.rotation.x = 0.12 - pointer.y + Math.sin(elapsed * 0.24) * 0.04;
        group.rotation.z = Math.sin(elapsed * 0.11) * 0.035;
        orbit.rotation.y += 0.0007;
        orbit2.rotation.x -= 0.00045;
      }
      renderer.render(scene, camera);
    };

    resize();
    new ResizeObserver(resize).observe(stage);
    document.documentElement.classList.add("has-three-scene");
    if (fallback) fallback.setAttribute("aria-hidden", "true");
    const visibility = new IntersectionObserver(entries => {
      const inView = entries[0].isIntersecting && !document.hidden;
      if (inView === active) return;
      active = inView;
      if (reduceMotion) { render(); return; }
      renderer.setAnimationLoop(active ? render : null);
      if (active) lastFrame = performance.now();
    }, { threshold: 0.01 });
    visibility.observe(stage);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) renderer.setAnimationLoop(null);
      else if (active && !reduceMotion) { lastFrame = performance.now(); renderer.setAnimationLoop(render); }
    });
    if (reduceMotion) render();
  } catch (error) {
    console.warn("Three.js scene is unavailable; keeping the accessible static artwork.", error);
  }
}
