import React, { useState, useEffect, useRef } from 'react';

export default function KineticCounter({ value, className = '' }) {
  const [pulse, setPulse] = useState(false);
  const [shake, setShake] = useState(false);
  const prevValueRef = useRef(value);

  // Detect Reduced Motion browser preference
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    try {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mediaQuery.matches);
      const listener = (e) => setReducedMotion(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    } catch (e) {
      // Fallback
    }
  }, []);

  // Compute animations on value change
  useEffect(() => {
    const prev = prevValueRef.current;
    if (prev !== value && !reducedMotion) {
      const numericPrev = parseFloat(String(prev).replace(/[^\d.-]/g, '')) || 0;
      const numericCurr = parseFloat(String(value).replace(/[^\d.-]/g, '')) || 0;

      if (numericCurr > numericPrev) {
        setPulse(true);
        const t = setTimeout(() => setPulse(false), 450);
        return () => clearTimeout(t);
      } else if (numericCurr < numericPrev) {
        setShake(true);
        const t = setTimeout(() => setShake(false), 450);
        return () => clearTimeout(t);
      }
    }
    prevValueRef.current = value;
  }, [value, reducedMotion]);

  // Convert value to string characters
  const chars = String(value).split('');

  // Individual digit roll ribbon
  const DigitRoll = ({ digit }) => {
    const isNum = /\d/.test(digit);
    if (!isNum || reducedMotion) {
      return <span className="inline-block transition-transform duration-100">{digit}</span>;
    }

    const num = parseInt(digit, 10);
    // Vertical offset: each digit occupies 1em height
    const translateY = -num * 10; // in percentage of height of 10-digit block

    return (
      <span className="inline-block relative overflow-hidden h-[1.25em] w-[0.62em] leading-none align-baseline select-none">
        <span 
          className="flex flex-col absolute left-0 transition-transform duration-600 cubic-bezier(0.16, 1, 0.3, 1)"
          style={{ transform: `translateY(${translateY}%)` }}
        >
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
            <span key={n} className="h-[1.25em] flex items-center justify-center font-mono">{n}</span>
          ))}
        </span>
      </span>
    );
  };

  const getAnimationClass = () => {
    if (reducedMotion) return '';
    if (pulse) return 'animate-kinetic-pulse text-emerald-650 filter drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]';
    if (shake) return 'animate-kinetic-shake text-rose-600';
    return '';
  };

  return (
    <span className={`inline-flex items-baseline font-mono tracking-tight transition-all duration-300 ${getAnimationClass()} ${className}`}>
      {chars.map((char, idx) => (
        <DigitRoll key={idx} digit={char} />
      ))}
    </span>
  );
}
