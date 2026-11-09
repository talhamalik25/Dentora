"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

interface AboutMolarCanvasProps {
  scrollProgress?: number;
}

export default function AboutMolarCanvas({ scrollProgress = 0 }: AboutMolarCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const toothRef = useRef<THREE.Object3D | null>(null);
  const progressRef = useRef(scrollProgress);

  useEffect(() => {
    progressRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Scene setup
    const scene = new THREE.Scene();

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.4);

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // Studio Environment map for realistic porcelain/chrome reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment()).texture;
    scene.environment = envTexture;

    // Studio Illumination
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xdce8fc, 1.2);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xeaf2ff, 1.4);
    fillLight.position.set(-3, 1, 2);
    scene.add(fillLight);

    // Royal Blue rim light (#2563EB) — signature Dentora lighting
    const rimLight = new THREE.DirectionalLight(0x2563eb, 8.5);
    rimLight.position.set(-4.5, 3.0, -3.0);
    scene.add(rimLight);

    // Soft bottom blue accent light
    const bluePoint = new THREE.PointLight(0x2563eb, 3.5, 12);
    bluePoint.position.set(2, -2.5, 2);
    scene.add(bluePoint);

    // Tooth group for combining idle rotation + pointer tilt + scroll parallax
    const toothGroup = new THREE.Group();
    scene.add(toothGroup);

    // Material: high-end liquid chrome/porcelain
    const toothMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf4f7fb,
      metalness: 0.88,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
      reflectivity: 0.95,
    });

    // Load optimized 3D molar GLB model
    const loader = new GLTFLoader();
    loader.load(
      "/models/molar.glb",
      (gltf) => {
        const mesh = gltf.scene.children[0] as THREE.Mesh;
        if (mesh) {
          mesh.material = toothMaterial;
          mesh.scale.set(1.4, 1.4, 1.4);
          // Initial sculptural posture showing occlusal table and roots
          mesh.rotation.x = 0.20;
          mesh.rotation.y = 0.45;
          mesh.rotation.z = -0.06;
          toothRef.current = mesh;
          toothGroup.add(mesh);
        }
      },
      undefined,
      (err) => {
        console.warn("Could not load molar.glb, using procedural fallback:", err);
        // Clean parametric fallback geometry
        const fallbackGeom = new THREE.CylinderGeometry(0.5, 0.35, 0.9, 32);
        fallbackGeom.center();
        const fallbackMesh = new THREE.Mesh(fallbackGeom, toothMaterial);
        fallbackMesh.rotation.x = 0.2;
        fallbackMesh.rotation.y = 0.4;
        toothRef.current = fallbackMesh;
        toothGroup.add(fallbackMesh);
      }
    );

    // Pointer-based subtle tilt tracking
    let targetTiltX = 0;
    let targetTiltY = 0;
    let currentTiltX = 0;
    let currentTiltY = 0;

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetTiltY = x * 0.45;
      targetTiltX = -y * 0.35;
    };

    const onPointerLeave = () => {
      targetTiltX = 0;
      targetTiltY = 0;
    };

    window.addEventListener("mousemove", onPointerMove, { passive: true });
    container.addEventListener("mouseleave", onPointerLeave);

    // Resize handling
    const onResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", onResize, { passive: true });

    // Viewport IntersectionObserver to pause rendering when offscreen
    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // Animation render loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isVisible || !renderer) return;

      const elapsed = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        // Damped pointer tilt
        currentTiltX += (targetTiltX - currentTiltX) * 0.06;
        currentTiltY += (targetTiltY - currentTiltY) * 0.06;

        toothGroup.rotation.x = currentTiltX;
        toothGroup.rotation.y = currentTiltY;

        // Subtle gentle idle floating
        if (toothRef.current) {
          toothRef.current.position.y = Math.sin(elapsed * 0.9) * 0.05;
          // Smooth slow continuous spin
          toothRef.current.rotation.y = 0.45 + elapsed * 0.18 + progressRef.current * 0.8;
          // Gentle lateral roll
          toothRef.current.rotation.z = -0.06 + Math.sin(elapsed * 0.7) * 0.025;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener("mousemove", onPointerMove);
      container.removeEventListener("mouseleave", onPointerLeave);
      window.removeEventListener("resize", onResize);

      pmremGenerator.dispose();
      envTexture.dispose();
      toothMaterial.dispose();

      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="relative h-full w-full select-none cursor-grab active:cursor-grabbing"
      aria-hidden="true"
      tabIndex={-1}
      style={{ touchAction: "pan-y" }}
    />
  );
}
