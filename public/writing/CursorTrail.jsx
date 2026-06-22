// Ink-red pen cursor trail — follows the pointer, fades over ~550ms.
// Mirrors the live site's canvas trail (rgba(197,20,20), multiply blend).
function CursorTrail() {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const points = [];
    const maxAgeMs = 550;
    const host = canvas.parentElement;

    const resize = () => {
      const w = host.clientWidth, h = host.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    let raf = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      const now = performance.now();
      while (points.length && now - points[0].t > maxAgeMs) points.shift();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (points.length < 2) return;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (let i = 1; i < points.length; i++) {
        const a = points[i - 1], b = points[i];
        const alpha = Math.max(0, 1 - (now - b.t) / maxAgeMs);
        ctx.strokeStyle = `rgba(197, 20, 20, ${0.75 * alpha})`;
        ctx.lineWidth = 1.5 + 3.5 * alpha;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    };

    const onMove = (e) => {
      const r = host.getBoundingClientRect();
      points.push({ x: e.clientX - r.left, y: e.clientY - r.top, t: performance.now() });
      if (points.length > 90) points.splice(0, points.length - 90);
    };

    window.addEventListener("resize", resize);
    host.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(draw);
    return () => {
      window.removeEventListener("resize", resize);
      host.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return React.createElement("canvas", {
    ref,
    "aria-hidden": "true",
    style: {
      position: "absolute", inset: 0, zIndex: 40,
      pointerEvents: "none", mixBlendMode: "multiply",
    },
  });
}
window.CursorTrail = CursorTrail;
