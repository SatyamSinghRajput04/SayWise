import React, { useEffect, useRef } from 'react';

interface CosmicBlackHoleVisualizerProps {
  isRecording: boolean;
  audioLevel: number; // 0.0 to 1.0
  isAnalyzing?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

const VERTEX_SHADER = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_audioLevel;
uniform float u_isRecording;
uniform float u_isAnalyzing;

#define PI 3.14159265359

// High-speed 2D Hash
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

// 2D Value Noise
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

// 4-Octave FBM
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = rot * p * 2.05 + vec2(30.0);
    a *= 0.5;
  }
  return v;
}

void main() {
  // Screen-space aspect ratio normalization (Wide horizontal plane)
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution) / u_resolution.y;
  float r = length(uv);

  // Black hole core dimensions
  float r_core = 0.18;
  float r_photon = 0.23 + (u_isRecording > 0.5 ? u_audioLevel * 0.04 : 0.0);

  // Motion speed: Calm Idle = 0.45, Energetic Recording = 1.1 + voice, Rapid Analyzing = 2.6
  float speed = u_isAnalyzing > 0.5 ? 2.6 : (u_isRecording > 0.5 ? (1.1 + u_audioLevel * 0.8) : 0.45);
  float t = u_time * speed;

  // SayWise Palette: Deep Midnight Void, Electric Cyan, Oceanic Sapphire, Indigo, Ice White
  vec3 c_deepVoid = vec3(0.01, 0.035, 0.09);    // #030b18 (Deep Midnight Void)
  vec3 c_cyan = vec3(0.22, 0.74, 0.97);        // #38bdf8 (Electric Cyan)
  vec3 c_sapphire = vec3(0.01, 0.45, 0.75);    // #0273c0 (Sapphire Blue)
  vec3 c_indigo = vec3(0.39, 0.40, 0.95);      // #6366f1 (Soft Violet/Indigo)
  vec3 c_iceWhite = vec3(0.92, 0.97, 1.0);     // #eaf5ff (Luminous Ice)

  // 1. Central Event Horizon (Pitch Navy/Black Void)
  if (r < r_core) {
    float coreVignette = smoothstep(0.0, r_core, r);
    vec3 coreColor = mix(c_deepVoid * 1.2, c_deepVoid * 0.7, coreVignette);
    
    // Voice-reactive inner warmth
    if (u_isRecording > 0.5) {
      coreColor += c_sapphire * (u_audioLevel * 0.4);
    }
    
    float edgeBlend = smoothstep(r_core - 0.015, r_core, r);
    gl_FragColor = vec4(mix(coreColor, c_deepVoid * 1.4, edgeBlend), 1.0);
    return;
  }

  // 2. Wide Inclined Accretion Disk (Horizontal Perspective tilt = 0.22)
  float tilt = 0.22;
  vec2 diskUV = vec2(uv.x, uv.y / tilt);
  float diskR = length(diskUV);

  // Accretion disk band boundaries (Spans wide horizontally)
  float diskInner = 0.32;
  float diskOuter = 1.85 + (u_isRecording > 0.5 ? u_audioLevel * 0.25 : 0.0);
  float diskMask = smoothstep(diskInner, diskInner + 0.15, diskR) * smoothstep(diskOuter, diskOuter - 0.6, diskR);

  // Plasma streams flowing across the horizontal disk
  vec2 streamUV = vec2(diskUV.x * 1.8 - t * 0.7, diskUV.y * 1.2 + sin(diskUV.x * 2.0 + t * 0.5) * 0.3);
  float plasmaFlow = fbm(streamUV);

  // Relativistic Doppler Beaming (approaching side on left is brighter & crisper)
  float doppler = 1.0 - 0.45 * (uv.x / max(r, 0.01));

  // Disk Color Composition
  float diskColorMix = smoothstep(diskInner, 1.2, diskR);
  vec3 diskColor = mix(c_cyan, c_sapphire, diskColorMix);
  diskColor = mix(diskColor, c_indigo, smoothstep(0.3, 0.9, diskColorMix));
  
  float brightness = (u_isRecording > 0.5 ? (1.0 + u_audioLevel * 1.2) : 0.75);
  diskColor += c_iceWhite * pow(plasmaFlow, 2.2) * brightness;
  diskColor *= diskMask * doppler * 1.6;

  // 3. Gravitational Lensing: Upper & Lower Einstein Arcs (The Interstellar Silhouette)
  float lensDist = abs(r - r_photon);
  float lensHalo = exp(-pow(lensDist / 0.028, 2.0));
  
  // Upper Arc (Lensed light curved over the top of horizon)
  float upperArch = smoothstep(-0.02, 0.20, uv.y) * lensHalo;
  // Lower Arc (Lensed light curved under the bottom of horizon)
  float lowerArch = smoothstep(0.02, -0.16, uv.y) * lensHalo * 0.65;
  
  float totalArch = upperArch + lowerArch;
  vec3 archColor = mix(c_cyan, c_iceWhite, lensHalo) * totalArch * (1.6 + (u_isRecording > 0.5 ? u_audioLevel * 1.2 : 0.0));

  // 4. Soft Fluid Voice Waves (Option B integration - Organic soundwaves rippling outward)
  float waveDist = r;
  float wavePhase = sin(waveDist * 14.0 - t * 1.5);
  float fluidWaves = smoothstep(0.2, 0.8, wavePhase) * exp(-waveDist * 2.5);
  vec3 waveColor = mix(c_sapphire, c_cyan, waveDist * 1.2) * fluidWaves * (0.35 + (u_isRecording > 0.5 ? u_audioLevel * 0.6 : 0.0));

  // 5. Outer Atmospheric Haze
  float haze = exp(-r * 2.5) * (0.3 + (u_isRecording > 0.5 ? u_audioLevel * 0.35 : 0.0));
  vec3 hazeColor = mix(c_sapphire, c_cyan, exp(-r * 1.8)) * haze;

  // Composite complete cosmic structure
  vec3 color = diskColor + archColor + waveColor + hazeColor;

  // Infinite soft radial falloff (NO hard circular boundary crop!)
  float horizontalFalloff = smoothstep(1.7, 0.8, length(vec2(uv.x * 0.65, uv.y)));
  gl_FragColor = vec4(color, horizontalFalloff);
}
`;

export const CosmicBlackHoleVisualizer: React.FC<CosmicBlackHoleVisualizerProps> = ({
  isRecording,
  audioLevel,
  isAnalyzing = false,
  onClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioLevelRef = useRef(audioLevel);
  const isRecordingRef = useRef(isRecording);
  const isAnalyzingRef = useRef(isAnalyzing);

  audioLevelRef.current = audioLevel;
  isRecordingRef.current = isRecording;
  isAnalyzingRef.current = isAnalyzing;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: false });
    if (!gl) {
      console.warn('WebGL not supported');
      return;
    }

    const vShader = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vShader, VERTEX_SHADER);
    gl.compileShader(vShader);

    const fShader = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fShader, FRAGMENT_SHADER);
    gl.compileShader(fShader);

    if (!gl.getShaderParameter(fShader, gl.COMPILE_STATUS)) {
      console.error('Fragment shader compile error:', gl.getShaderInfoLog(fShader));
      return;
    }

    const program = gl.createProgram()!;
    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
         1.0,  1.0,
      ]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uAudioLevel = gl.getUniformLocation(program, 'u_audioLevel');
    const uIsRecording = gl.getUniformLocation(program, 'u_isRecording');
    const uIsAnalyzing = gl.getUniformLocation(program, 'u_isAnalyzing');

    let animId: number;
    let startTime = performance.now();

    const render = (now: number) => {
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }

      const elapsed = (now - startTime) * 0.001;

      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, elapsed);
      gl.uniform1f(uAudioLevel, audioLevelRef.current);
      gl.uniform1f(uIsRecording, isRecordingRef.current ? 1.0 : 0.0);
      gl.uniform1f(uIsAnalyzing, isAnalyzingRef.current ? 1.0 : 0.0);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      gl.deleteProgram(program);
      gl.deleteShader(vShader);
      gl.deleteShader(fShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, []);

  return (
    <div
      onClick={onClick}
      className="relative w-full max-w-md h-56 sm:h-64 flex items-center justify-center cursor-pointer select-none group transition-transform duration-300 active:scale-[0.98] my-1"
    >
      {/* Soft Ambient Nebula Glow Behind Accretion Structure */}
      <div
        className="absolute inset-0 rounded-full filter blur-3xl pointer-events-none transition-all duration-500"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(56,189,248,0.3) 0%, rgba(2,132,199,0.18) 45%, rgba(99,102,241,0.08) 70%, transparent 85%)',
          opacity: isRecording ? 0.9 : 0.45,
          transform: `scale(${isRecording ? 1.15 + audioLevel * 0.15 : 1.0})`,
        }}
      />

      {/* Wide Cinematic WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="relative z-10 w-full h-full"
        style={{
          filter: 'drop-shadow(0 14px 28px rgba(2,132,199,0.25))',
        }}
      />
    </div>
  );
};
