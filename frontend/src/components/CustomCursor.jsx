import React, { useEffect, useRef } from 'react';
import './CustomCursor.css';

// Custom cursor component – small cyan dot (instant) and a larger ring (smooth lag).
// Disabled on touch‑only devices (media query "hover: none").
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  // Detect if the device supports hover. If not, render nothing.
  const isTouch = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;
  if (isTouch) return null;

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Instant dot follows cursor
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    };

    const animate = () => {
      // Lerp for the ring (smooth trailing effect)
      ringX += (mouseX - ringX) * 0.2;
      ringY += (mouseY - ringY) * 0.2;
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouseMove);
    animate();
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" ref={dotRef} />
      <div className="cursor-ring" ref={ringRef} />
    </>
  );
}
