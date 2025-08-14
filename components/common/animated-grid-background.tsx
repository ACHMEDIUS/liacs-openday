'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function AnimatedGridBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    sceneRef.current = scene;
    rendererRef.current = renderer;

    // Shader uniforms
    const uniforms = {
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      u_dots: { value: new Array(12).fill(0).map(() => new THREE.Vector3(0, 0, 0)) },
      u_dotActive: { value: new Array(12).fill(0) },
      u_dotDirections: { value: new Array(12).fill(0).map(() => new THREE.Vector2(0, 0)) },
    };

    // Fragment shader with proper spotlight effect
    const fragmentShader = `
      precision highp float;
      
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec3 u_dots[12];
      uniform float u_dotActive[12];
      uniform vec2 u_dotDirections[12];
      
      // Convert screen coordinates to normalized coordinates  
      vec2 screenToNorm(vec2 screen) {
        return screen / u_resolution.xy;
      }
      
      // Leiden orange gradient background
      vec3 getBackground(vec2 uv) {
        vec2 center = vec2(0.5, 0.5);
        float dist = length(uv - center);
        
        // Radial gradient from center (QR area) to edges
        vec3 centerColor = vec3(0.957, 0.431, 0.196); // #f46e32
        vec3 edgeColor = vec3(0.831, 0.314, 0.102);   // #d4501a
        
        float t = smoothstep(0.2, 0.8, dist);
        return mix(centerColor, edgeColor, t);
      }
      
      // Line visibility based on distance to dots
      float getLineVisibility(vec2 pos, vec3 dotPos, float radius) {
        if (dotPos.z < 0.5) return 0.0; // Dot not active
        
        vec2 dotScreen = screenToNorm(dotPos.xy);
        float dist = length(pos - dotScreen);
        
        // Smooth falloff within radius
        return 1.0 - smoothstep(0.0, radius, dist);
      }
      
      // Draw grid lines
      vec3 drawGrid(vec2 uv) {
        vec3 color = vec3(0.0);
        
        // QR bounds in normalized coordinates (avoid drawing lines here)
        vec2 qrCenter = vec2(0.5, 0.5);
        vec2 qrSize = vec2((250.0 + 32.0 + 200.0) / u_resolution.x, (250.0 + 32.0 + 200.0) / u_resolution.y);
        vec4 qrBounds = vec4(
          qrCenter.x - qrSize.x * 0.5,
          qrCenter.y - qrSize.y * 0.5,
          qrCenter.x + qrSize.x * 0.5,
          qrCenter.y + qrSize.y * 0.5
        );
        
        // Skip if in QR area
        if (uv.x >= qrBounds.x && uv.x <= qrBounds.z && 
            uv.y >= qrBounds.y && uv.y <= qrBounds.w) {
          return color;
        }
        
        // Grid line positions in normalized coordinates
        // Vertical lines
        float verticalLines[6];
        verticalLines[0] = 0.10;  // Left 1 (10vw)
        verticalLines[1] = 0.15;  // Left 2 (15vw)
        verticalLines[2] = 0.20;  // Left 3 (20vw)
        verticalLines[3] = 0.80;  // Right 3 (80vw)
        verticalLines[4] = 0.85;  // Right 2 (85vw)
        verticalLines[5] = 0.90;  // Right 1 (90vw)
        
        // Horizontal lines
        float horizontalLines[6];
        horizontalLines[0] = 0.90;  // Top 1 (90vh)
        horizontalLines[1] = 0.85;  // Top 2 (85vh)
        horizontalLines[2] = 0.80;  // Top 3 (80vh)
        horizontalLines[3] = 0.20;  // Bottom 3 (20vh)
        horizontalLines[4] = 0.15;  // Bottom 2 (15vh)
        horizontalLines[5] = 0.10;  // Bottom 1 (10vh)
        
        // Calculate visibility for each pixel based on nearby dots
        float lineVisibility = 0.0;
        for (int i = 0; i < 12; i++) {
          if (u_dotActive[i] > 0.5) {
            vec2 dotUV = u_dots[i].xy / u_resolution.xy;
            vec2 toPixel = uv - dotUV;
            float dist = length(toPixel);
            
            // Directional radius - 60px front, 30px sides
            vec2 direction = u_dotDirections[i];
            float frontRadius = 60.0 / min(u_resolution.x, u_resolution.y);
            float sideRadius = 30.0 / min(u_resolution.x, u_resolution.y);
            
            // Calculate elliptical radius based on direction
            float directionDot = dot(normalize(toPixel + vec2(0.001)), direction);
            float radius = mix(sideRadius, frontRadius, max(0.0, directionDot));
            
            if (dist < radius) {
              lineVisibility = max(lineVisibility, 1.0 - (dist / radius));
            }
          }
        }
        
        // Draw vertical lines only if they're outside QR bounds
        for (int i = 0; i < 6; i++) {
          float lineX = verticalLines[i];
          if (lineX < qrBounds.x || lineX > qrBounds.z) {
            float distToLine = abs(uv.x - lineX);
            float lineWidth = 1.5 / u_resolution.x;
            if (distToLine < lineWidth) {
              float lineAlpha = (lineWidth - distToLine) * lineVisibility * 0.6;
              color += vec3(0.0, 0.067, 0.345) * lineAlpha; // Leiden blue
            }
          }
        }
        
        // Draw horizontal lines only if they're outside QR bounds
        for (int i = 0; i < 6; i++) {
          float lineY = horizontalLines[i];
          if (lineY < qrBounds.y || lineY > qrBounds.w) {
            float distToLine = abs(uv.y - lineY);
            float lineWidth = 1.5 / u_resolution.y;
            if (distToLine < lineWidth) {
              float lineAlpha = (lineWidth - distToLine) * lineVisibility * 0.6;
              color += vec3(0.0, 0.067, 0.345) * lineAlpha; // Leiden blue
            }
          }
        }
        
        return color;
      }
      
      // Draw glowing dots
      vec3 drawDots(vec2 uv) {
        vec3 color = vec3(0.0);
        
        for (int i = 0; i < 12; i++) {
          if (u_dotActive[i] < 0.5) continue;
          
          vec2 dotUV = u_dots[i].xy / u_resolution.xy;
          vec2 toPixel = uv - dotUV;
          float dist = length(toPixel);
          
          // Directional glow - oval shape based on movement
          vec2 direction = u_dotDirections[i];
          float frontGlow = 60.0 / min(u_resolution.x, u_resolution.y);
          float sideGlow = 30.0 / min(u_resolution.x, u_resolution.y);
          
          // Calculate oval glow radius
          float directionDot = dot(normalize(toPixel + vec2(0.001)), direction);
          float glowRadius = mix(sideGlow, frontGlow, max(0.0, directionDot));
          
          // Smooth circular falloff
          float normalizedDist = dist / glowRadius;
          
          // Outer glow - Strong Leiden blue
          float outerGlow = 1.0 / (1.0 + normalizedDist * normalizedDist * 50.0);
          color += vec3(0.0, 0.067, 0.345) * outerGlow * 1.5; // Pure Leiden blue
          
          // Middle glow - Brighter Leiden blue  
          float middleGlow = 1.0 / (1.0 + normalizedDist * normalizedDist * 150.0);
          color += vec3(0.0, 0.2, 0.8) * middleGlow * 1.0; // Brighter blue
          
          // Inner core - Bright Leiden blue center
          float innerCore = 1.0 / (1.0 + normalizedDist * normalizedDist * 500.0);
          color += vec3(0.2, 0.4, 1.0) * innerCore * 0.8; // Bright blue core
          
          // Central bright spot
          float centerSpot = 1.0 / (1.0 + normalizedDist * normalizedDist * 2000.0);
          color += vec3(0.4, 0.6, 1.0) * centerSpot * 0.6; // Very bright center
        }
        
        return color;
      }
      
      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        
        vec3 bgColor = getBackground(uv);
        vec3 gridColor = drawGrid(uv);
        vec3 dotColor = drawDots(uv);
        
        vec3 finalColor = bgColor + gridColor + dotColor;
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const vertexShader = `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    // Create shader material
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Grid system state
    const gridSystem = {
      dots: Array(12)
        .fill(null)
        .map((_, i) => ({
          x: 0,
          y: 0,
          direction: 'up' as 'up' | 'down' | 'left' | 'right',
          speed: 50 + Math.random() * 30,
          active: false,
          lineIndex: i,
          directionVector: { x: 0, y: 1 }, // Default upward
        })),
    };

    function getQRBounds() {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const qrSize = 250 + 32; // QR code width + padding
      return {
        left: centerX - qrSize / 2 - 100,
        right: centerX + qrSize / 2 + 100,
        top: centerY - qrSize / 2 - 100,
        bottom: centerY + qrSize / 2 + 100,
      };
    }

    function initDots() {
      const vw = window.innerWidth * 0.01;
      const vh = window.innerHeight * 0.01;
      // const qrBounds = getQRBounds();

      let dotIndex = 0;

      // Left vertical lines (3 dots) - 2 up, 1 down (middle)
      for (let i = 0; i < 3; i++) {
        const x = 10 * vw + i * 5 * vw;
        if (dotIndex < 12) {
          const dot = gridSystem.dots[dotIndex];
          dot.x = x;
          dot.direction = i === 1 ? 'down' : 'up'; // Middle goes down, others up
          dot.y = dot.direction === 'up' ? window.innerHeight + 50 : -50;
          dot.directionVector = dot.direction === 'up' ? { x: 0, y: -1 } : { x: 0, y: 1 };
          dot.active = true;
          dotIndex++;
        }
      }

      // Right vertical lines (3 dots) - 2 down, 1 up (middle)
      for (let i = 0; i < 3; i++) {
        const x = window.innerWidth - (10 * vw + i * 5 * vw);
        if (dotIndex < 12) {
          const dot = gridSystem.dots[dotIndex];
          dot.x = x;
          dot.direction = i === 1 ? 'up' : 'down'; // Middle goes up, others down
          dot.y = dot.direction === 'down' ? -50 : window.innerHeight + 50;
          dot.directionVector = dot.direction === 'down' ? { x: 0, y: 1 } : { x: 0, y: -1 };
          dot.active = true;
          dotIndex++;
        }
      }

      // Top horizontal lines (3 dots) - 2 right, 1 left (middle)
      for (let i = 0; i < 3; i++) {
        const y = 10 * vh + i * 5 * vh;
        if (dotIndex < 12) {
          const dot = gridSystem.dots[dotIndex];
          dot.y = y;
          dot.direction = i === 1 ? 'left' : 'right'; // Middle goes left, others right
          dot.x = dot.direction === 'right' ? -50 : window.innerWidth + 50;
          dot.directionVector = dot.direction === 'right' ? { x: 1, y: 0 } : { x: -1, y: 0 };
          dot.active = true;
          dotIndex++;
        }
      }

      // Bottom horizontal lines (3 dots) - 2 left, 1 right (middle)
      for (let i = 0; i < 3; i++) {
        const y = window.innerHeight - (10 * vh + i * 5 * vh);
        if (dotIndex < 12) {
          const dot = gridSystem.dots[dotIndex];
          dot.y = y;
          dot.direction = i === 1 ? 'right' : 'left'; // Middle goes right, others left
          dot.x = dot.direction === 'left' ? window.innerWidth + 50 : -50;
          dot.directionVector = dot.direction === 'left' ? { x: -1, y: 0 } : { x: 1, y: 0 };
          dot.active = true;
          dotIndex++;
        }
      }
    }

    function updateDots(dt: number) {
      const qrBounds = getQRBounds();

      for (const dot of gridSystem.dots) {
        if (!dot.active) continue;

        // Update position based on direction
        switch (dot.direction) {
          case 'up':
            dot.y -= dot.speed * dt;
            if (dot.y <= qrBounds.bottom && dot.y >= qrBounds.top) {
              dot.y = qrBounds.top;
            }
            if (dot.y < -50) {
              dot.y = window.innerHeight + 50 + Math.random() * 200;
              dot.speed = 50 + Math.random() * 30;
            }
            break;
          case 'down':
            dot.y += dot.speed * dt;
            if (dot.y >= qrBounds.top && dot.y <= qrBounds.bottom) {
              dot.y = qrBounds.bottom;
            }
            if (dot.y > window.innerHeight + 50) {
              dot.y = -50 - Math.random() * 200;
              dot.speed = 50 + Math.random() * 30;
            }
            break;
          case 'right':
            dot.x += dot.speed * dt;
            if (dot.x >= qrBounds.left && dot.x <= qrBounds.right) {
              dot.x = qrBounds.right;
            }
            if (dot.x > window.innerWidth + 50) {
              dot.x = -50 - Math.random() * 200;
              dot.speed = 50 + Math.random() * 30;
            }
            break;
          case 'left':
            dot.x -= dot.speed * dt;
            if (dot.x <= qrBounds.right && dot.x >= qrBounds.left) {
              dot.x = qrBounds.left;
            }
            if (dot.x < -50) {
              dot.x = window.innerWidth + 50 + Math.random() * 200;
              dot.speed = 50 + Math.random() * 30;
            }
            break;
        }
      }
    }

    function updateUniforms() {
      // Update dot positions and directions in uniforms
      for (let i = 0; i < 12; i++) {
        const dot = gridSystem.dots[i];
        if (dot && dot.active) {
          uniforms.u_dots.value[i].set(dot.x, dot.y, 1.0);
          uniforms.u_dotActive.value[i] = 1.0;
          uniforms.u_dotDirections.value[i].set(dot.directionVector.x, dot.directionVector.y);
        } else {
          uniforms.u_dotActive.value[i] = 0.0;
        }
      }
    }

    function resize() {
      const width = window.innerWidth;
      const height = window.innerHeight;

      renderer.setSize(width, height);
      uniforms.u_resolution.value.set(width, height);

      initDots();
    }

    function animate() {
      // TODO: correct typing
      const currentTime = performance.now() * 0.001;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const deltaTime = Math.min(0.05, currentTime - (animate as any).lastTime || 0);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (animate as any).lastTime = currentTime;

      uniforms.u_time.value = currentTime;

      updateDots(deltaTime);
      updateUniforms();

      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(animate);
    }

    const handleResize = () => resize();
    window.addEventListener('resize', handleResize);

    resize();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (rendererRef.current) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      if (sceneRef.current) {
        sceneRef.current.clear();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 h-screen w-screen"
      style={{
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1,
      }}
    />
  );
}
