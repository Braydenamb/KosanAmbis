import React, { useRef, useState, useCallback, useEffect } from 'react';

/**
 * FloatingDock — macOS-style bottom dock with JS magnify effect.
 *
 * Props:
 *   items: Array<{
 *     id, emoji?, icon?: ReactNode, label,
 *     badge?: number, active, onClick,
 *     type?: 'nav'|'tool', activeColor?: string
 *   }>
 */
export default function FloatingDock({ items = [] }) {
  const dockRef     = useRef(null);
  const itemRefs    = useRef({});
  const [mouseX, setMouseX] = useState(null);
  const [scales, setScales] = useState({});

  const BASE_SIZE = 44;
  const MAX_SCALE = 1.6;
  const REACH     = 110; // px

  /* Recompute scales whenever mouseX changes */
  useEffect(() => {
    if (mouseX === null) { setScales({}); return; }
    const dock = dockRef.current;
    if (!dock) return;
    const dockLeft = dock.getBoundingClientRect().left;

    const next = {};
    Object.entries(itemRefs.current).forEach(([id, el]) => {
      if (!el) return;
      const r    = el.getBoundingClientRect();
      const cx   = r.left + r.width / 2 - dockLeft;
      const dist = Math.abs(mouseX - cx);
      next[id]   = dist > REACH ? 1 : 1 + (MAX_SCALE - 1) * Math.pow(Math.cos((dist / REACH) * (Math.PI / 2)), 2);
    });
    setScales(next);
  }, [mouseX]);

  const handleMouseMove  = useCallback(e => {
    const dock = dockRef.current;
    if (!dock) return;
    setMouseX(e.clientX - dock.getBoundingClientRect().left);
  }, []);

  const handleMouseLeave = useCallback(() => setMouseX(null), []);

  const navItems  = items.filter(i => i.type !== 'tool');
  const toolItems = items.filter(i => i.type === 'tool');

  return (
    <div id="floating-dock" className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[200]">
      {/* Glass pill */}
      <div
        ref={dockRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ overflow: 'visible' }}
        className="flex items-end gap-1 px-3 pt-2 pb-3
                   bg-white/25 backdrop-blur-3xl
                   border border-white/55
                   rounded-2xl
                   shadow-[0_8px_40px_rgba(15,23,42,0.12),0_1.5px_0_rgba(255,255,255,0.7)_inset]"
      >
        {/* ── Nav items ── */}
        {navItems.map(item => (
          <DockItem
            key={item.id}
            item={item}
            scale={scales[item.id] ?? 1}
            baseSize={BASE_SIZE}
            setRef={el => { itemRefs.current[item.id] = el; }}
          />
        ))}

        {/* ── Separator ── */}
        {toolItems.length > 0 && (
          <div className="self-center mx-1.5 w-px h-7 bg-slate-400/25 rounded-full shrink-0" />
        )}

        {/* ── Tool items ── */}
        {toolItems.map(item => (
          <DockItem
            key={item.id}
            item={item}
            scale={scales[item.id] ?? 1}
            baseSize={BASE_SIZE - 2}      /* tools slightly smaller */
            setRef={el => { itemRefs.current[item.id] = el; }}
            isTool
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Individual Dock Item ───────────────────────────────────────── */
function DockItem({ item, scale, baseSize, setRef, isTool = false }) {
  const [hovered, setHovered] = useState(false);
  const size   = Math.round(baseSize * scale);
  const liftPx = Math.round((scale - 1) * 22);

  const bgActive  = item.activeColor ?? 'rgba(15,23,42,0.92)';
  const bgRest    = 'rgba(255,255,255,0.52)';
  const bgHovered = 'rgba(255,255,255,0.80)';

  return (
    <button
      ref={setRef}
      onClick={item.onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ transform: `translateY(-${liftPx}px)`, transition: 'transform 0.12s ease' }}
      className="relative flex flex-col items-center gap-0 cursor-pointer select-none focus:outline-none"
      aria-label={item.label}
    >

      {/* ── Tooltip (rendered in a portal-like way via fixed+zIndex trick) ── */}
      <span
        style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: `translateX(-50%) translateY(${hovered ? -6 : 0}px)`,
          marginBottom: 10,
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.1s ease, transform 0.1s ease',
          zIndex: 9999,
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}
        className="bg-slate-900/95 text-white text-[9px] font-black font-mono
                   px-2.5 py-1.5 rounded-xl
                   border border-white/10 shadow-xl backdrop-blur-md"
      >
        {item.label}
        {item.badge > 0 && <span className="ml-1 text-rose-400">({item.badge})</span>}
      </span>

      {/* ── Icon box ── */}
      <div
        style={{
          width: size,
          height: size,
          background: item.active ? bgActive : hovered ? bgHovered : bgRest,
          boxShadow: item.active
            ? '0 6px 20px rgba(15,23,42,0.22), 0 1px 0 rgba(255,255,255,0.12) inset'
            : hovered
            ? '0 3px 12px rgba(15,23,42,0.10)'
            : 'none',
          transition: 'width 0.12s ease, height 0.12s ease, background 0.15s ease, box-shadow 0.15s ease',
        }}
        className="relative flex items-center justify-center rounded-2xl"
      >
        {/* Emoji */}
        {item.emoji ? (
          <span
            style={{ fontSize: Math.round(size * 0.48), lineHeight: 1, transition: 'font-size 0.12s ease' }}
            className="select-none"
          >
            {item.emoji}
          </span>
        ) : (
          /* Lucide icon */
          <span
            style={{
              color: item.active && !item.activeColor?.includes('0.1') ? '#fff' : item.active ? '#6366f1' : hovered ? '#334155' : '#94a3b8',
              transition: 'color 0.15s',
              display: 'flex',
              width: Math.round(size * 0.45),
              height: Math.round(size * 0.45),
            }}
          >
            {React.cloneElement(item.icon, { style: { width: '100%', height: '100%' } })}
          </span>
        )}

        {/* Badge */}
        {item.badge > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-0.5
                           rounded-full bg-rose-500 text-white text-[7px]
                           font-black font-mono flex items-center justify-center
                           border-2 border-white shadow-sm leading-none">
            {item.badge > 9 ? '9+' : item.badge}
          </span>
        )}
      </div>

      {/* ── Short label below icon ── */}
      <span
        style={{
          fontSize: 7.5,
          marginTop: 4,
          color: item.active ? '#6366f1' : '#94a3b8',
          fontWeight: 900,
          fontFamily: 'monospace',
          letterSpacing: '0.04em',
          maxWidth: 52,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          transition: 'color 0.15s',
          opacity: item.active || hovered ? 1 : 0.65,
        }}
      >
        {/* First word only to keep labels short */}
        {item.label.split(' ')[0]}
      </span>

      {/* ── Active glow dot ── */}
      <span
        style={{
          display: 'block',
          width: item.active ? 4 : 0,
          height: item.active ? 4 : 0,
          marginTop: 2,
          borderRadius: '50%',
          background: '#6366f1',
          boxShadow: item.active ? '0 0 6px #818cf8' : 'none',
          opacity: item.active ? 1 : 0,
          transition: 'width 0.2s ease, height 0.2s ease, opacity 0.2s ease',
        }}
      />
    </button>
  );
}
