"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function InteractiveNebulaShader({
  hasActiveReminders = false,
  hasUpcomingReminders = false,
  disableCenterDimming = false,
  className = "",
}) {
  const containerRef = useRef(null);
  const materialRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const opcionesContexto = {
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    };
    const lienzo = document.createElement("canvas");
    let contextoWebGL;

    try {
      contextoWebGL = lienzo.getContext("webgl2", opcionesContexto);
    } catch {
      return undefined;
    }

    if (!contextoWebGL) return undefined;

    let renderer;

    try {
      renderer = new THREE.WebGLRenderer({
        ...opcionesContexto,
        canvas: lienzo,
        context: contextoWebGL,
      });
    } catch {
      contextoWebGL.getExtension("WEBGL_lose_context")?.loseContext();
      return undefined;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.className = "absolute inset-0 z-10 block size-full";
    renderer.domElement.setAttribute("aria-hidden", "true");
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const temporizador = new THREE.Timer();
    temporizador.connect(document);

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision mediump float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform vec2 iMouse;
      uniform bool hasActiveReminders;
      uniform bool hasUpcomingReminders;
      uniform bool disableCenterDimming;
      varying vec2 vUv;

      #define t iTime
      mat2 m(float a){ float c=cos(a), s=sin(a); return mat2(c,-s,s,c); }
      float map(vec3 p){
        p.xz *= m(t*0.4);
        p.xy *= m(t*0.3);
        vec3 q = p*2. + t;
        return length(p + vec3(sin(t*0.7))) * log(length(p)+1.0)
             + sin(q.x + sin(q.z + sin(q.y))) * 0.5 - 1.0;
      }

      void mainImage(out vec4 O, in vec2 fragCoord) {
        vec2 uv = fragCoord / min(iResolution.x, iResolution.y) - vec2(.9, .5);
        vec2 mouse = iMouse / max(iResolution, vec2(1.0));
        uv.x += .4;
        uv += (mouse - .5) * .08;
        vec3 col = vec3(0.0);
        float d = 2.5;

        for (int i = 0; i <= 5; i++) {
          vec3 p = vec3(0,0,5.) + normalize(vec3(uv, -1.)) * d;
          float rz = map(p);
          float f  = clamp((rz - map(p + 0.1)) * 0.5, -0.1, 1.0);

          vec3 base = hasActiveReminders
            ? vec3(0.05,0.2,0.5) + vec3(4.0,2.0,5.0)*f
            : hasUpcomingReminders
            ? vec3(0.05,0.3,0.1) + vec3(2.0,5.0,1.0)*f
            : vec3(0.1,0.3,0.4) + vec3(5.0,2.5,3.0)*f;

          col = col * base + smoothstep(2.5, 0.0, rz) * 0.7 * base;
          d += min(rz, 1.0);
        }

        float dist   = distance(fragCoord, iResolution*0.5);
        float radius = min(iResolution.x, iResolution.y) * 0.5;
        float dim    = disableCenterDimming
                     ? 1.0
                     : smoothstep(radius*0.3, radius*0.5, dist);

        O = vec4(col, 1.0);
        if (!disableCenterDimming) {
          O.rgb = mix(O.rgb * 0.3, O.rgb, dim);
        }
      }

      void main() {
        mainImage(gl_FragColor, vUv * iResolution);
      }
    `;

    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector2(1, 1) },
      iMouse: { value: new THREE.Vector2(0.5, 0.5) },
      hasActiveReminders: { value: false },
      hasUpcomingReminders: { value: false },
      disableCenterDimming: { value: false },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    });
    materialRef.current = material;

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const onResize = () => {
      const width = Math.max(container.clientWidth, 1);
      const height = Math.max(container.clientHeight, 1);
      renderer.setSize(width, height, false);
      uniforms.iResolution.value.set(width, height);
      if (uniforms.iMouse.value.x <= 1 && uniforms.iMouse.value.y <= 1) {
        uniforms.iMouse.value.set(width * 0.5, height * 0.5);
      }
    };

    const onPointerMove = (event) => {
      const limites = container.getBoundingClientRect();
      uniforms.iMouse.value.set(
        event.clientX - limites.left,
        limites.bottom - event.clientY,
      );
    };

    const resizeObserver = new ResizeObserver(onResize);
    const preferenciaMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)");

    const renderizar = (marcaTiempo) => {
      temporizador.update(marcaTiempo);
      uniforms.iTime.value = temporizador.getElapsed();
      renderer.render(scene, camera);
    };

    const sincronizarAnimacion = () => {
      if (document.hidden || preferenciaMovimiento.matches) {
        renderer.setAnimationLoop(null);
        renderer.render(scene, camera);
        return;
      }
      renderer.setAnimationLoop(renderizar);
    };

    resizeObserver.observe(container);
    container.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", sincronizarAnimacion);
    preferenciaMovimiento.addEventListener("change", sincronizarAnimacion);
    onResize();
    sincronizarAnimacion();

    return () => {
      resizeObserver.disconnect();
      container.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", sincronizarAnimacion);
      preferenciaMovimiento.removeEventListener("change", sincronizarAnimacion);
      renderer.setAnimationLoop(null);
      scene.remove(mesh);
      geometry.dispose();
      material.dispose();
      temporizador.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      materialRef.current = null;
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    const material = materialRef.current;
    if (!material) return;
    material.uniforms.hasActiveReminders.value = hasActiveReminders;
    material.uniforms.hasUpcomingReminders.value = hasUpcomingReminders;
    material.uniforms.disableCenterDimming.value = disableCenterDimming;
  }, [hasActiveReminders, hasUpcomingReminders, disableCenterDimming]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 isolate overflow-hidden bg-[#02040a] ${className}`}
      aria-hidden="true"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,#02040a_0%,#07111e_48%,#090511_100%)]" />
      <div className="pointer-events-none absolute -left-[24%] top-[6%] h-[88%] w-[72%] origin-[62%_48%] rounded-full bg-cyan-500/20 blur-[120px] motion-safe:animate-[spin_24s_linear_infinite]" />
      <div className="pointer-events-none absolute -left-[20%] top-[5%] h-[98%] w-[56%] -rotate-12 rounded-[46%] border-[32px] border-cyan-300/10 blur-[32px] motion-safe:animate-[spin_30s_linear_infinite]" />
      <div className="pointer-events-none absolute -right-[18%] -top-[20%] h-[76%] w-[62%] origin-[35%_62%] rounded-full bg-violet-700/20 blur-[140px] motion-safe:animate-[spin_32s_linear_infinite_reverse]" />
      <div className="pointer-events-none absolute bottom-[-36%] left-[24%] h-[66%] w-[58%] rounded-full bg-blue-600/15 blur-[130px] motion-safe:animate-[pulse_8s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,4,10,0.2)_44%,rgba(2,4,10,0.88)_100%)]" />
    </div>
  );
}

export default InteractiveNebulaShader;
