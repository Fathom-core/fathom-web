import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export default function Sculpture({ paused }: { paused: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(paused);
  const resume = useRef<() => void>(() => {});
  const [ready, setReady] = useState(false);
  useEffect(() => {
    pausedRef.current = paused;
    if (!paused) resume.current();
  }, [paused]);

  useEffect(() => {
    const mount = host.current;
    if (!mount) return;
    let renderer: THREE.WebGLRenderer;
    const canvas = document.createElement("canvas");
    try {
      const gl = canvas.getContext("webgl2", {
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      if (!gl) return;
      const info = gl.getExtension("WEBGL_debug_renderer_info");
      const gpu = info
        ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL))
        : "";
      if (/swiftshader|llvmpipe|software/i.test(gpu)) {
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        return;
      }
      renderer = new THREE.WebGLRenderer({
        canvas,
        context: gl,
        alpha: true,
        antialias: true,
      });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      -0.53,
      0.53,
      0.53,
      -0.53,
      0.01,
      20,
    );
    camera.position.set(0, 0.06, 2);
    camera.lookAt(0, 0.015, 0);
    const environment = new RoomEnvironment();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const env = pmrem.fromScene(environment, 0.04);
    scene.environment = env.texture;
    scene.environmentIntensity = 0.45;
    environment.dispose();
    pmrem.dispose();
    scene.add(new THREE.HemisphereLight(0xe4d5fa, 0x1b1226, 0.65));
    const key = new THREE.DirectionalLight(0xeee5ff, 2.4);
    key.position.set(-1.6, 2, 3);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    Object.assign(key.shadow.camera, {
      left: -0.7,
      right: 0.7,
      top: 0.7,
      bottom: -0.7,
      near: 0.1,
      far: 8,
    });
    key.shadow.bias = -0.0001;
    key.shadow.normalBias = 0.002;
    key.shadow.camera.updateProjectionMatrix();
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xb665ff, 5);
    rim.position.set(-1.8, 0.8, -1.2);
    scene.add(rim);
    const fill = new THREE.DirectionalLight(0x9853e8, 0.65);
    fill.position.set(1.2, -0.25, 1.1);
    scene.add(fill);

    let model: THREE.Object3D | null = null;
    let disposed = false;
    let lost = false;
    let visible = true;
    let frame = 0;
    let lastTime = 0;
    let elapsed = 0;
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    const initialRotation = -Math.PI / 2 + 0.48;
    const disposeModel = (object: THREE.Object3D) =>
      object.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;
        child.geometry.dispose();
        const materials = Array.isArray(child.material)
          ? child.material
          : [child.material];
        for (const material of materials) {
          for (const value of Object.values(material))
            if (value instanceof THREE.Texture) value.dispose();
          material.dispose();
        }
      });

    new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).load(
      "/models/fathom-core.glb",
      (gltf) => {
        if (disposed) {
          disposeModel(gltf.scene);
          return;
        }
        model = gltf.scene;
        model.rotation.y = initialRotation;
        model.traverse((child) => {
          if (!(child instanceof THREE.Mesh)) return;
          child.castShadow = true;
          child.receiveShadow = true;
          const material = child.material as THREE.MeshStandardMaterial;
          material.metalness = 0.15;
          material.roughness = 0.78;
          material.normalScale.setScalar(0.65);
          material.envMapIntensity = 0.55;
        });
        scene.add(model);
        resize();
        renderer.render(scene, camera);
        setReady(true);
        start();
      },
      undefined,
      () => {
        /* The rendered original-model poster stays visible. */
      },
    );

    function resize() {
      if (disposed) return;
      const width = mount!.clientWidth;
      const height = mount!.clientHeight;
      if (!width || !height) return;
      camera.left = (-0.53 * width) / height;
      camera.right = (0.53 * width) / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      if (model) renderer.render(scene, camera);
    }
    function render(time: number) {
      frame = 0;
      if (
        disposed ||
        lost ||
        !visible ||
        document.hidden ||
        !model ||
        pausedRef.current
      )
        return;
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;
      if (!pausedRef.current) {
        elapsed += dt;
        currentX += (mouseX - currentX) * 0.035;
        currentY += (mouseY - currentY) * 0.035;
        model.rotation.y =
          initialRotation + currentX * 0.07 + Math.sin(elapsed * 0.2) * 0.025;
        model.rotation.x = currentY * 0.025;
        model.position.y = Math.sin(elapsed * 0.35) * 0.002;
        renderer.render(scene, camera);
      }
      frame = requestAnimationFrame(render);
    }
    function start() {
      if (
        !frame &&
        !disposed &&
        !lost &&
        !pausedRef.current &&
        visible &&
        !document.hidden &&
        model
      ) {
        lastTime = performance.now();
        frame = requestAnimationFrame(render);
      }
    }
    resume.current = start;
    const pointer = (e: PointerEvent) => {
      mouseX = (e.clientX / innerWidth - 0.5) * 2;
      mouseY = (e.clientY / innerHeight - 0.5) * 2;
    };
    const observer = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      if (visible) start();
      else {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    observer.observe(mount);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    const visibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else start();
    };
    const contextLost = (event: Event) => {
      event.preventDefault();
      lost = true;
      setReady(false);
      cancelAnimationFrame(frame);
      frame = 0;
    };
    window.addEventListener("pointermove", pointer, { passive: true });
    document.addEventListener("visibilitychange", visibility);
    canvas.addEventListener("webglcontextlost", contextLost);
    return () => {
      disposed = true;
      resume.current = () => {};
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", pointer);
      document.removeEventListener("visibilitychange", visibility);
      canvas.removeEventListener("webglcontextlost", contextLost);
      if (model) disposeModel(model);
      env.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);
  return (
    <div className="sculpture-shell">
      <img
        className={`sculpture-poster ${ready ? "hidden" : ""}`}
        src="/models/fathom-core.webp"
        alt="A crowned, blindfolded sculpture in violet light, representing independent intelligence"
        fetchPriority="high"
      />
      <div
        className={`sculpture-canvas ${ready ? "ready" : ""}`}
        ref={host}
        aria-hidden="true"
      />
    </div>
  );
}
