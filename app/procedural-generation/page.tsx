'use client';

import { useEffect, useMemo, useRef, useState, type TouchEvent } from 'react';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowLeft, ArrowDown, ArrowRight, ChevronsUp } from 'lucide-react';

interface MovementState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
}

const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  return /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
};

const useHeightFunction = () => {
  return useMemo(() => {
    return (x: number, z: number) => {
      const scale = 0.15;
      const hills = Math.sin(x * scale) * 3 + Math.cos(z * scale) * 2;
      const ridges = Math.sin((x + z) * scale * 0.8) * 2;
      const basin = Math.cos(Math.sqrt(x * x + z * z) * 0.18) * 1.5;
      return hills + ridges + basin;
    };
  }, []);
};

export default function ProceduralGenerationPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const movementRef = useRef<MovementState>({ forward: false, backward: false, left: false, right: false });
  const rotationRef = useRef({ yaw: 0, pitch: -0.18 });
  const physicsRef = useRef({ yVelocity: 0, grounded: true });
  const lookTouchRef = useRef<{ id: number; x: number; y: number } | null>(null);
  const [mobile, setMobile] = useState(false);
  const heightAt = useHeightFunction();

  useEffect(() => {
    setMobile(isMobileDevice());
    const handleResizeCheck = () => setMobile(isMobileDevice());
    window.addEventListener('resize', handleResizeCheck);
    return () => window.removeEventListener('resize', handleResizeCheck);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x8cc5f3);
    scene.fog = new THREE.Fog(0x8cc5f3, 80, 220);

    const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 400);
    camera.position.set(0, heightAt(0, 20) + 6, 20);

    const hemisphere = new THREE.HemisphereLight(0xffffff, 0x226644, 1.0);
    scene.add(hemisphere);
    const sun = new THREE.DirectionalLight(0xffffff, 0.7);
    sun.position.set(60, 120, 20);
    sun.castShadow = true;
    scene.add(sun);

    const groundGeometry = new THREE.PlaneGeometry(180, 180, 180, 180);
    groundGeometry.rotateX(-Math.PI / 2);
    const positions = groundGeometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);
      const y = heightAt(x, z);
      positions.setY(i, y);
    }
    groundGeometry.computeVertexNormals();

    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x3a7f58,
      roughness: 0.95,
      metalness: 0.1,
    });
    const terrain = new THREE.Mesh(groundGeometry, groundMaterial);
    terrain.receiveShadow = true;
    scene.add(terrain);

    const scatterGroup = new THREE.Group();
    const crystalGeometry = new THREE.ConeGeometry(0.8, 3, 5);
    const crystalMaterial = new THREE.MeshStandardMaterial({ color: 0xfff3b0, emissive: 0x433d53, emissiveIntensity: 0.35 });

    for (let i = 0; i < 80; i++) {
      const mesh = new THREE.Mesh(crystalGeometry, crystalMaterial.clone());
      const x = THREE.MathUtils.randFloatSpread(140);
      const z = THREE.MathUtils.randFloatSpread(140);
      const h = heightAt(x, z);
      mesh.position.set(x, h + 1.5, z);
      mesh.scale.setScalar(1 + Math.random() * 1.5);
      mesh.rotation.y = Math.random() * Math.PI * 2;
      (mesh.material as THREE.MeshStandardMaterial).color.setHSL(0.5 + Math.random() * 0.1, 0.5, 0.6 + Math.random() * 0.2);
      mesh.castShadow = true;
      scatterGroup.add(mesh);
    }
    scene.add(scatterGroup);

    const cloudsGroup = new THREE.Group();
    for (let i = 0; i < 12; i++) {
      const cloudGeo = new THREE.SphereGeometry(THREE.MathUtils.randFloat(3, 6), 12, 12);
      const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.7 });
      const cloud = new THREE.Mesh(cloudGeo, cloudMat);
      const x = THREE.MathUtils.randFloatSpread(160);
      const z = THREE.MathUtils.randFloatSpread(160);
      cloud.position.set(x, 35 + Math.random() * 15, z);
      cloudsGroup.add(cloud);
    }
    scene.add(cloudsGroup);

    const resizeRenderer = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', resizeRenderer);

    const keysDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
          movementRef.current.forward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          movementRef.current.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          movementRef.current.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          movementRef.current.right = true;
          break;
        case 'Space':
          if (physicsRef.current.grounded) {
            physicsRef.current.yVelocity = 7;
            physicsRef.current.grounded = false;
          }
          break;
      }
    };

    const keysUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
          movementRef.current.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          movementRef.current.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          movementRef.current.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          movementRef.current.right = false;
          break;
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (document.pointerLockElement !== canvas) return;
      rotationRef.current.yaw -= event.movementX * 0.0025;
      rotationRef.current.pitch -= event.movementY * 0.0025;
      rotationRef.current.pitch = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, rotationRef.current.pitch));
    };

    const handleClick = () => {
      if (!mobile) {
        canvas.requestPointerLock();
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', keysDown);
    window.addEventListener('keyup', keysUp);
    canvas.addEventListener('click', handleClick);

    const clock = new THREE.Clock();
    let frameId: number;

    const animate = () => {
      const delta = clock.getDelta();
      const speed = 12;
      const moveX = Number(movementRef.current.right) - Number(movementRef.current.left);
      const moveZ = Number(movementRef.current.backward) - Number(movementRef.current.forward);

      const forwardVector = new THREE.Vector3(Math.sin(rotationRef.current.yaw), 0, Math.cos(rotationRef.current.yaw));
      const rightVector = new THREE.Vector3().crossVectors(forwardVector, new THREE.Vector3(0, 1, 0));

      const movement = new THREE.Vector3();
      movement.addScaledVector(forwardVector, -moveZ);
      movement.addScaledVector(rightVector, moveX);
      if (movement.lengthSq() > 0) {
        movement.normalize();
        camera.position.addScaledVector(movement, delta * speed);
      }

      physicsRef.current.yVelocity -= 20 * delta;
      camera.position.y += physicsRef.current.yVelocity * delta;

      const groundHeight = heightAt(camera.position.x, camera.position.z) + 2;
      if (camera.position.y <= groundHeight) {
        camera.position.y = groundHeight;
        physicsRef.current.yVelocity = 0;
        physicsRef.current.grounded = true;
      } else {
        physicsRef.current.grounded = false;
      }

      camera.rotation.order = 'YXZ';
      camera.rotation.y = rotationRef.current.yaw;
      camera.rotation.x = rotationRef.current.pitch;

      cloudsGroup.rotation.y += delta * 0.02;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resizeRenderer);
      window.removeEventListener('keydown', keysDown);
      window.removeEventListener('keyup', keysUp);
      document.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
      renderer.dispose();
      groundGeometry.dispose();
      groundMaterial.dispose();
      crystalGeometry.dispose();
    };
  }, [heightAt, mobile]);

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if (event.touches.length > 0) {
      const touch = event.touches[0];
      lookTouchRef.current = { id: touch.identifier, x: touch.clientX, y: touch.clientY };
    }
  };

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    if (!lookTouchRef.current) return;
    const touch = Array.from(event.touches).find((t) => t.identifier === lookTouchRef.current!.id);
    if (!touch) return;
    const dx = touch.clientX - lookTouchRef.current.x;
    const dy = touch.clientY - lookTouchRef.current.y;
    lookTouchRef.current = { ...lookTouchRef.current, x: touch.clientX, y: touch.clientY };
    rotationRef.current.yaw -= dx * 0.003;
    rotationRef.current.pitch -= dy * 0.003;
    rotationRef.current.pitch = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, rotationRef.current.pitch));
  };

  const handleTouchEnd = () => {
    lookTouchRef.current = null;
  };

  const triggerJump = () => {
    if (physicsRef.current.grounded) {
      physicsRef.current.yVelocity = 7;
      physicsRef.current.grounded = false;
    }
  };

  const setMovement = (key: keyof MovementState, active: boolean) => {
    movementRef.current[key] = active;
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12">
        <header className="space-y-3">
          <Badge variant="outline" className="border-white/20 text-white/80">
            Procedural Worlds
          </Badge>
          <h1 className="text-4xl font-semibold">Procedural Generation Playground</h1>
          <p className="max-w-3xl text-lg text-slate-300">
            Explore a lightweight landscape sculpted from trigonometric noise. Wander with WASD + mouse on desktop, or use the on-screen controls on mobile. Tap to focus and swipe to look around.
          </p>
        </header>

        <div className="relative h-[70vh] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 shadow-2xl">
          <canvas ref={canvasRef} className="h-full w-full" />

          <div
            className="absolute inset-0"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
          />

          {mobile && (
            <div className="pointer-events-auto absolute inset-0 flex flex-col justify-end gap-6 p-6">
              <div className="flex justify-between">
                <div className="grid grid-cols-3 gap-3 text-slate-200/90">
                  <Button
                    type="button"
                    variant="outline"
                    className="col-start-2 bg-white/10 backdrop-blur"
                    onPointerDown={() => setMovement('forward', true)}
                    onPointerUp={() => setMovement('forward', false)}
                    onPointerCancel={() => setMovement('forward', false)}
                  >
                    <ArrowUp className="h-5 w-5" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-white/10 backdrop-blur"
                    onPointerDown={() => setMovement('left', true)}
                    onPointerUp={() => setMovement('left', false)}
                    onPointerCancel={() => setMovement('left', false)}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-white/10 backdrop-blur"
                    onPointerDown={() => setMovement('backward', true)}
                    onPointerUp={() => setMovement('backward', false)}
                    onPointerCancel={() => setMovement('backward', false)}
                  >
                    <ArrowDown className="h-5 w-5" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-white/10 backdrop-blur"
                    onPointerDown={() => setMovement('right', true)}
                    onPointerUp={() => setMovement('right', false)}
                    onPointerCancel={() => setMovement('right', false)}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex flex-col gap-3">
                  <Button
                    type="button"
                    className="bg-leiden text-white"
                    onPointerDown={triggerJump}
                  >
                    <ChevronsUp className="mr-2 h-4 w-4" /> Jump
                  </Button>
                </div>
              </div>
            </div>
          )}

          {!mobile && (
            <div className="pointer-events-none absolute left-6 top-6 rounded-lg border border-white/10 bg-black/30 px-4 py-2 text-xs text-white/80">
              <p>Desktop controls:</p>
              <p>• Click to capture cursor, move mouse to look</p>
              <p>• WASD or arrow keys to move, Space to jump</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
