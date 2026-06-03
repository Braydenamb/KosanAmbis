import React, { useRef, useState, useCallback, useEffect } from 'react';

/**
 * FloatingDock — Adaptive navigation.
 *
 * • Mobile  (<= md): Full-width iOS-style bottom tab bar
 *   - Always-visible labels, large touch targets, safe-area-inset-bottom
 *   - Only nav items shown (tools hidden — not needed on mobile nav)
 *
 * • Desktop (> md): macOS-style floating glass pill
 *   - JS magnify effect on hover, tooltips, compact
 *   - Nav items + separator + tool items
 *
 * Props:
 *   items: Array<{
 *     id, emoji?, icon?: ReactNode, label,
 *     badge?: number, active, onClick,
 *     type?: 'nav'|'tool', activeColor?: string,
 *     mobileHidden?: boolean   — exclude from mobile tab bar
 *   }>
 */
export default function FloatingDock({ items = [], isDrawerOpen = false }) {
  const navItems  = items.filter(i => i.type !== 'tool');
  const toolItems = items.filter(i => i.type === 'tool');

  // Mobile: show only first 5 nav items to avoid overcrowding
  // (user can access others via another pattern if needed)
  const mobileItems = navItems.filter(i => !i.mobileHidden);

  return (
    <>
      {/* ═══════════════════════════════════════════════
          MOBILE: Full-width Native Tab Bar
          hidden on md and above
      ═══════════════════════════════════════════════ */}
      <div
        id="native-tabbar-mobile"
        className={`fixed bottom-0 left-0 right-0 z-[200] md:hidden transition-transform duration-300 ${isDrawerOpen ? 'translate-y-full' : 'translate-y-0'}`}
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px) saturate(200%)',
          WebkitBackdropFilter: 'blur(20px) saturate(200%)',
          borderTop: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.05)',
        }}
      >
        <div className="flex items-center justify-between w-full px-2 py-1 pb-[env(safe-area-inset-bottom,2px)] overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {mobileItems.map(item => (
            <MobileTab key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          DESKTOP: Floating glass pill
          hidden below md
      ═══════════════════════════════════════════════ */}
      <DesktopDock navItems={navItems} toolItems={toolItems} />
    </>
  );
}

/* ─── Mobile Tab Item ─────────────────────────────────────────── */
function MobileTab({ item }) {
  const activeColor = item.activeColor || '#6366f1';
  
  return (
    <button
      onClick={item.onClick}
      className="flex flex-col items-center justify-center py-2 px-1 cursor-pointer select-none relative focus:outline-none active:opacity-70 transition-colors shrink-0"
      aria-label={item.label}
      style={{
        flex: '1 1 auto',
        minWidth: '3.5rem',
        maxWidth: '5rem',
      }}
    >
      {/* Icon */}
      <div className="relative flex items-center justify-center" style={{ width: 26, height: 26 }}>
        {item.emoji ? (
          <span
            className="leading-none select-none"
            style={{ fontSize: 22, filter: item.active ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' : 'none', opacity: item.active ? 1 : 0.6 }}
          >
            {item.emoji}
          </span>
        ) : (
          <span
            style={{
              display: 'flex',
              width: 24,
              height: 24,
              color: item.active ? activeColor : '#94a3b8',
            }}
          >
            {React.cloneElement(item.icon, { style: { width: '100%', height: '100%', strokeWidth: item.active ? 2.5 : 2 } })}
          </span>
        )}

        {/* Badge */}
        {item.badge > 0 && (
          <span
            className="absolute -top-1 -right-1 min-w-[18px] h-4.5 px-1 rounded-full bg-rose-500 text-white font-black font-mono flex items-center justify-center border-[1.5px] border-white leading-none text-[9px] shadow-sm"
          >
            {item.badge > 9 ? '9+' : item.badge}
          </span>
        )}
      </div>

      {/* Label (iOS style) */}
      <span
        style={{
          fontSize: 10,
          fontWeight: item.active ? 700 : 500,
          color: item.active ? (item.emoji ? '#475569' : activeColor) : '#94a3b8',
          marginTop: 4,
          letterSpacing: '0.01em',
        }}
      >
        {item.label.split(' ')[0]}
      </span>
    </button>
  );
}

/* ─── Desktop Dock ────────────────────────────────────────────── */
function DesktopDock({ navItems, toolItems }) {
  const dockRef  = useRef(null);
  const itemRefs = useRef({});
  const [mouseX, setMouseX] = useState(null);
  const [scales, setScales] = useState({});

  const BASE_SIZE = 44;
  const MAX_SCALE = 1.52;
  const REACH     = 100;

  useEffect(() => {
    if (mouseX === null) { setScales({}); return; }
    const dock = dockRef.current;
    if (!dock) return;
    const dockLeft = dock.getBoundingClientRect().left;
    const next = {};
    Object.entries(itemRefs.current).forEach(([id, el]) => {
      if (!el) return;
      const r  = el.getBoundingClientRect();
      const cx = r.left + r.width / 2 - dockLeft;
      const d  = Math.abs(mouseX - cx);
      next[id] = d > REACH ? 1 : 1 + (MAX_SCALE - 1) * Math.pow(Math.cos((d / REACH) * (Math.PI / 2)), 2);
    });
    setScales(next);
  }, [mouseX]);

  const handleMouseMove  = useCallback(e => {
    const dock = dockRef.current;
    if (!dock) return;
    setMouseX(e.clientX - dock.getBoundingClientRect().left);
  }, []);
  const handleMouseLeave = useCallback(() => setMouseX(null), []);

  return (
    <div
      id="floating-dock"
      className="hidden md:flex fixed bottom-5 left-0 right-0 justify-center z-[200]"
    >
      <div
        ref={dockRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ overflow: 'visible' }}
        className="flex items-end gap-1 px-3 pt-2 pb-3
                   bg-white/22 backdrop-blur-3xl
                   border border-white/50
                   rounded-2xl
                   shadow-[0_8px_40px_rgba(15,23,42,0.11),0_1.5px_0_rgba(255,255,255,0.7)_inset]"
      >
        {/* Nav items */}
        {navItems.map(item => (
          <DesktopDockItem
            key={item.id}
            item={item}
            scale={scales[item.id] ?? 1}
            baseSize={BASE_SIZE}
            setRef={el => { itemRefs.current[item.id] = el; }}
          />
        ))}

        {/* Separator */}
        {toolItems.length > 0 && (
          <div className="self-center mx-1.5 w-px h-6 bg-slate-300/40 rounded-full shrink-0" />
        )}

        {/* Tool items */}
        {toolItems.map(item => (
          <DesktopDockItem
            key={item.id}
            item={item}
            scale={scales[item.id] ?? 1}
            baseSize={36}
            setRef={el => { itemRefs.current[item.id] = el; }}
            isTool
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Desktop Dock Item ───────────────────────────────────────── */
function DesktopDockItem({ item, scale, baseSize, setRef, isTool = false }) {
  const [hovered, setHovered] = useState(false);
  const size   = Math.round(baseSize * scale);
  const liftPx = Math.round((scale - 1) * 20);

  const bgActive  = item.activeColor ?? 'rgba(15,23,42,0.92)';
  const bgRest    = 'rgba(255,255,255,0.5)';
  const bgHovered = 'rgba(255,255,255,0.82)';

  const isLightActive = item.activeColor && item.activeColor.includes('0.1') || item.activeColor?.includes('0.18') || item.activeColor?.includes('0.85') && item.activeColor?.includes('indigo');

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
      {/* Tooltip */}
      <span
        style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: `translateX(-50%) translateY(${hovered ? -6 : 0}px)`,
          marginBottom: 8,
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

      {/* Icon box */}
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
        {item.emoji ? (
          <span
            style={{ fontSize: Math.round(size * 0.48), lineHeight: 1, transition: 'font-size 0.12s ease' }}
            className="select-none"
          >
            {item.emoji}
          </span>
        ) : (
          <span
            style={{
              color: item.active && item.activeColor?.includes('0.85') ? '#fff'
                   : item.active ? '#6366f1'
                   : hovered ? '#334155' : '#94a3b8',
              transition: 'color 0.15s',
              display: 'flex',
              width: Math.round(size * 0.46),
              height: Math.round(size * 0.46),
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

      {/* Short label */}
      <span
        style={{
          fontSize: 7.5,
          marginTop: 3,
          color: item.active ? '#6366f1' : '#94a3b8',
          fontWeight: 900,
          fontFamily: 'monospace',
          letterSpacing: '0.04em',
          maxWidth: 50,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          transition: 'color 0.15s',
          opacity: item.active || hovered ? 1 : 0.6,
        }}
      >
        {item.label.split(' ')[0]}
      </span>

      {/* Active dot */}
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
