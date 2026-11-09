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
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let prefersReducedMotion = motionPreference.matches;

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
    const userRotationGroup = new THREE.Group();
    toothGroup.add(userRotationGroup);

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
          userRotationGroup.add(mesh);
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
        userRotationGroup.add(fallbackMesh);
      }
    );

    // Pointer-based subtle tilt tracking
    let targetTiltX = 0;
    let targetTiltY = 0;
    let currentTiltX = 0;
    let currentTiltY = 0;

    let isDragging = false;
    let activePointerId: number | null = null;
    let lastPointerX = 0;
    let lastPointerY = 0;
    let lastPointerTime = 0;
    let currentDragX = 0;
    let currentDragY = 0;
    let targetDragX = 0;
    let targetDragY = 0;
    let dragVelocityX = 0;
    let dragVelocityY = 0;
    let idleRotationOffset = 0;
    let lastAutoRotationY = 0.45;
    const canvas = renderer.domElement;
    canvas.style.touchAction = "none";
    canvas.style.cursor = "grab";
    canvas.style.userSelect = "none";

    const clamp = (value: number, min: number, max: number) =>
      Math.max(min, Math.min(max, value));

    const onHoverMove = (e: MouseEvent) => {
      if (isDragging) return;
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

    const onPointerDown = (event: PointerEvent) => {
      if (!event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return;

      event.preventDefault();
      isDragging = true;
      activePointerId = event.pointerId;
      lastPointerX = event.clientX;
      lastPointerY = event.clientY;
      lastPointerTime = performance.now();
      targetDragX = currentDragX;
      targetDragY = currentDragY;
      dragVelocityX = 0;
      dragVelocityY = 0;
      lastAutoRotationY = toothRef.current?.rotation.y ?? lastAutoRotationY;
      canvas.style.cursor = "grabbing";
      canvas.setPointerCapture(event.pointerId);
    };

    const onDragMove = (event: PointerEvent) => {
      if (!isDragging || event.pointerId !== activePointerId) return;

      event.preventDefault();
      const now = performance.now();
      const deltaX = clamp(event.clientX - lastPointerX, -80, 80);
      const deltaY = clamp(event.clientY - lastPointerY, -80, 80);
      const elapsed = Math.max((now - lastPointerTime) / 1000, 1 / 240);
      const rotationX = deltaY * 0.008;
      const rotationY = deltaX * 0.008;

      targetDragX = clamp(targetDragX + rotationX, -0.9, 0.9);
      targetDragY = clamp(targetDragY + rotationY, -Math.PI, Math.PI);
      dragVelocityX = clamp(rotationX / elapsed, -1.2, 1.2);
      dragVelocityY = clamp(rotationY / elapsed, -1.2, 1.2);
      lastPointerX = event.clientX;
      lastPointerY = event.clientY;
      lastPointerTime = now;
    };

    const onPointerUp = (event: PointerEvent) => {
      if (!isDragging || event.pointerId !== activePointerId) return;

      isDragging = false;
      activePointerId = null;
      if (performance.now() - lastPointerTime > 100) {
        dragVelocityX = 0;
        dragVelocityY = 0;
      }
      canvas.style.cursor = "grab";
      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }

      const baseRotationY =
        0.45 + clock.elapsedTime * 0.18 + progressRef.current * 0.8;
      idleRotationOffset = lastAutoRotationY - baseRotationY;
    };

    const onLostPointerCapture = (event: PointerEvent) => {
      if (!isDragging || event.pointerId !== activePointerId) return;

      isDragging = false;
      activePointerId = null;
      canvas.style.cursor = "grab";
      const baseRotationY =
        0.45 + clock.elapsedTime * 0.18 + progressRef.current * 0.8;
      idleRotationOffset = lastAutoRotationY - baseRotationY;
    };

    const onMotionPreferenceChange = (event: MediaQueryListEvent) => {
      prefersReducedMotion = event.matches;
      if (prefersReducedMotion) {
        dragVelocityX = 0;
        dragVelocityY = 0;
        targetDragX = currentDragX;
        targetDragY = currentDragY;
        if (toothRef.current && !isDragging) {
          lastAutoRotationY = toothRef.current.rotation.y;
          idleRotationOffset =
            lastAutoRotationY -
            (0.45 + clock.elapsedTime * 0.18 + progressRef.current * 0.8);
        }
      }
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onDragMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    canvas.addEventListener("lostpointercapture", onLostPointerCapture);
    motionPreference.addEventListener("change", onMotionPreferenceChange);
    window.addEventListener("mousemove", onHoverMove, { passive: true });
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
      const delta = Math.min(clock.getDelta(), 0.05);

      if (!isVisible || !renderer) return;

      const elapsed = clock.elapsedTime;
      const baseRotationY = 0.45 + elapsed * 0.18 + progressRef.current * 0.8;

      if (!prefersReducedMotion) {
        // Damped pointer tilt
        currentTiltX += (targetTiltX - currentTiltX) * 0.06;
        currentTiltY += (targetTiltY - currentTiltY) * 0.06;

        toothGroup.rotation.x = currentTiltX;
        toothGroup.rotation.y = currentTiltY;

        // Subtle gentle idle floating
        if (toothRef.current) {
          toothRef.current.position.y = Math.sin(elapsed * 0.9) * 0.05;
          // Gentle lateral roll
          toothRef.current.rotation.z = -0.06 + Math.sin(elapsed * 0.7) * 0.025;

          if (!isDragging) {
            // Resume the idle and scroll rotation from the angle held during the drag.
            idleRotationOffset *= Math.exp(-3.5 * delta);
            toothRef.current.rotation.y = baseRotationY + idleRotationOffset;
            lastAutoRotationY = toothRef.current.rotation.y;
          }
        }
      } else if (toothRef.current && !isDragging) {
        // Keep the idle angle fixed while reduced motion is enabled.
        lastAutoRotationY = toothRef.current.rotation.y;
        idleRotationOffset = lastAutoRotationY - baseRotationY;
      }

      if (!isDragging && !prefersReducedMotion) {
        targetDragX = clamp(targetDragX + dragVelocityX * delta, -0.9, 0.9);
        targetDragY = clamp(targetDragY + dragVelocityY * delta, -Math.PI, Math.PI);
        const inertiaDamping = Math.exp(-5 * delta);
        dragVelocityX *= inertiaDamping;
        dragVelocityY *= inertiaDamping;
        if (Math.abs(dragVelocityX) < 0.01) dragVelocityX = 0;
        if (Math.abs(dragVelocityY) < 0.01) dragVelocityY = 0;
      }

      const dragSmoothing = prefersReducedMotion ? 1 : 1 - Math.exp(-18 * delta);
      currentDragX += (targetDragX - currentDragX) * dragSmoothing;
      currentDragY += (targetDragY - currentDragY) * dragSmoothing;
      userRotationGroup.rotation.x = currentDragX;
      userRotationGroup.rotation.y = currentDragY;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener("mousemove", onHoverMove);
      container.removeEventListener("mouseleave", onPointerLeave);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onDragMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      canvas.removeEventListener("lostpointercapture", onLostPointerCapture);
      motionPreference.removeEventListener("change", onMotionPreferenceChange);
      if (activePointerId !== null && canvas.hasPointerCapture(activePointerId)) {
        canvas.releasePointerCapture(activePointerId);
      }

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
