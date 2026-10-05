// Ultra-lightweight 60fps Golden Embers & Sparks Particle Engine

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  rotation: number;
  vRot: number;
}

const GOLD_PALETTE = ['#ffe57f', '#ffd700', '#d4af37', '#f59e0b', '#ffffff', '#e5b842'];

export function triggerGoldenBurst(originX?: number, originY?: number, particleCount = 45) {
  if (typeof window === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.remove();
    return;
  }

  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);

  const startX = originX ?? width / 2;
  const startY = originY ?? height / 2;

  const particles: Particle[] = [];

  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 8 + 2;
    particles.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2, // Slight upward bias
      size: Math.random() * 4 + 2,
      color: GOLD_PALETTE[Math.floor(Math.random() * GOLD_PALETTE.length)],
      alpha: 1,
      decay: Math.random() * 0.02 + 0.015,
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 12
    });
  }

  let animationFrameId: number;

  function render() {
    ctx?.clearRect(0, 0, width, height);

    let activeCount = 0;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (p.alpha <= 0) continue;

      activeCount++;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.18; // gravity
      p.vx *= 0.98; // air drag
      p.alpha -= p.decay;
      p.rotation += p.vRot;

      ctx!.save();
      ctx!.translate(p.x, p.y);
      ctx!.rotate((p.rotation * Math.PI) / 180);
      ctx!.globalAlpha = Math.max(0, p.alpha);
      ctx!.fillStyle = p.color;
      ctx!.shadowColor = '#f59e0b';
      ctx!.shadowBlur = 6;

      // Draw diamond / star spark
      ctx!.beginPath();
      ctx!.moveTo(0, -p.size);
      ctx!.lineTo(p.size * 0.7, 0);
      ctx!.lineTo(0, p.size);
      ctx!.lineTo(-p.size * 0.7, 0);
      ctx!.closePath();
      ctx!.fill();

      ctx!.restore();
    }

    if (activeCount > 0) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      cancelAnimationFrame(animationFrameId);
      canvas.remove();
    }
  }

  animationFrameId = requestAnimationFrame(render);
}
