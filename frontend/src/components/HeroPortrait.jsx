import { useRef } from 'react';
import './HeroPortrait.css';

// Measured nonzero-alpha bounds (right/bottom exclusive), in source pixels.
const normal = { width: 1085, height: 1450, top: 47, contentHeight: 1403 };
const cyberpunk = { width: 6130, height: 8192, top: 77, contentHeight: 8115 };
const contentScaleY = normal.contentHeight / cyberpunk.contentHeight;

export default function HeroPortrait() {
  const activePointer = useRef(null);

  function updateReveal(event) {
    if (activePointer.current !== null && activePointer.current !== event.pointerId) return;
    if (event.pointerType !== 'mouse' && activePointer.current === null) return;
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    // The mask covers the host, so use its local CSS pixels, including CSS scaling.
    element.style.setProperty('--pointer-x', `${(event.clientX - rect.left) * element.clientWidth / rect.width}px`);
    element.style.setProperty('--pointer-y', `${(event.clientY - rect.top) * element.clientHeight / rect.height}px`);
    element.dataset.revealing = 'true';
  }

  function startReveal(event) {
    if (!event.isPrimary) return;
    activePointer.current = event.pointerId;
    if (event.pointerType !== 'mouse') event.currentTarget.setPointerCapture(event.pointerId);
    updateReveal(event);
  }

  function hideReveal(event) {
    if (activePointer.current !== null && activePointer.current !== event.pointerId) return;
    activePointer.current = null;
    delete event.currentTarget.dataset.revealing;
  }

  return (
    <div
      className="hero-portrait"
      onPointerDown={startReveal}
      onPointerMove={updateReveal}
      onPointerUp={hideReveal}
      onPointerLeave={hideReveal}
      onPointerCancel={hideReveal}
      onLostPointerCapture={hideReveal}
      aria-label="Move your cursor or touch the portrait to reveal its cyberpunk version"
    >
      <img
        className="portrait-image portrait-normal"
        src="/images/aditya.png"
        alt="Aditya Dugar"
        draggable="false"
      />
      <div className="portrait-cyberpunk" aria-hidden="true">
        <svg className="portrait-image" viewBox={`0 0 ${normal.width} ${normal.height}`} preserveAspectRatio="xMidYMid meet">
          {/* Map cyberpunk alpha bounds to normal alpha bounds before contain-fitting.
              Both bounds span the full source width; only vertical padding differs. */}
          <image
            href="/images/aditya-cyberpunk.png"
            x="0"
            y={normal.top - cyberpunk.top * contentScaleY}
            width={normal.width}
            height={cyberpunk.height * contentScaleY}
            preserveAspectRatio="none"
          />
        </svg>
      </div>
    </div>
  );
}
