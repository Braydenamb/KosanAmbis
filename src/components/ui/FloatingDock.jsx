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
  return (
    <div
      id="floating-dock-desktop"
      className="hidden md:flex fixed bottom-6 left-0 right-0 justify-center z-[200]"
    >
      <div
        className="flex items-end gap-1.5 px-4 pt-2.5 pb-3
                   bg-white/40 backdrop-blur-3xl
                   border border-white/60
                   rounded-[28px]
                   shadow-[0_8px_40px_rgba(15,23,42,0.11),0_1.5px_0_rgba(255,255,255,0.7)_inset]"
      >
        {/* Nav items */}
        {navItems.map(item => (
          <DesktopDockItem key={item.id} item={item} />
        ))}

        {/* Separator */}
        {toolItems.length > 0 && (
          <div className="self-center mx-2 w-px h-8 bg-slate-300/60 rounded-full shrink-0" />
        )}

        {/* Tool items */}
        {toolItems.map(item => (
          <DesktopDockItem key={item.id} item={item} isTool />
        ))}
      </div>
    </div>
  );
}

/* ─── Desktop Dock Item ───────────────────────────────────────── */
function DesktopDockItem({ item, isTool = false }) {
  const size = isTool ? 40 : 48;
  const bgActive = item.activeColor ?? 'rgba(15,23,42,0.92)';
  const bgRest = 'rgba(255,255,255,0.5)';
  
  return (
    <button
      onClick={item.onClick}
      className="group relative flex flex-col items-center gap-1 cursor-pointer select-none focus:outline-none transition-transform duration-200 hover:-translate-y-1 active:scale-95"
      aria-label={item.label}
    >
      {/* Tooltip */}
      <span
        className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 
                   opacity-0 group-hover:opacity-100 group-hover:-translate-y-1
                   transition-all duration-200 pointer-events-none whitespace-nowrap z-[9999]
                   bg-slate-900/95 text-white text-[10px] font-black font-mono
                   px-3 py-1.5 rounded-xl border border-white/10 shadow-xl backdrop-blur-md"
      >
        {item.label}
        {item.badge > 0 && <span className="ml-1.5 text-rose-400">({item.badge})</span>}
      </span>

      {/* Icon Box */}
      <div
        style={{
          width: size,
          height: size,
          background: item.active ? bgActive : bgRest,
          boxShadow: item.active
            ? '0 6px 20px rgba(15,23,42,0.22), 0 1px 0 rgba(255,255,255,0.12) inset'
            : '0 2px 10px rgba(15,23,42,0.05)',
        }}
        className="relative flex items-center justify-center rounded-[20px] group-hover:bg-white/80 transition-colors duration-200"
      >
        {item.emoji ? (
          <span
            className="select-none transition-transform duration-200 group-hover:scale-110"
            style={{ fontSize: Math.round(size * 0.5) }}
          >
            {item.emoji}
          </span>
        ) : (
          <span
            style={{
              color: item.active && item.activeColor?.includes('0.85') ? '#fff'
                   : item.active ? '#6366f1'
                   : '#64748b',
              width: Math.round(size * 0.46),
              height: Math.round(size * 0.46),
            }}
            className="flex transition-colors duration-200 group-hover:text-slate-700"
          >
            {React.cloneElement(item.icon, { style: { width: '100%', height: '100%' } })}
          </span>
        )}

        {/* Badge */}
        {item.badge > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1
                           rounded-full bg-rose-500 text-white text-[9px]
                           font-black font-mono flex items-center justify-center
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
