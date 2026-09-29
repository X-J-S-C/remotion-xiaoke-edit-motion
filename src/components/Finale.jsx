import React from 'react';
import {useCurrentFrame, spring, random} from 'remotion';
import {C, L} from '../theme';
import {B} from '../beats';

// 便签纸：30秒剪完, Opus 5.5 — 小克收工
export const StickyNote = () => {
  const frame = useCurrentFrame();
  const fps = 30;
  const a = B.note[0] * fps;
  if (frame < a) return null;
  const s = spring({frame: frame - a, fps, config: {damping: 11, stiffness: 220, mass: 0.9}});
  const rot = -4 + Math.sin(frame * 0.07) * 1.4;
  return (
    <div style={{
      position: 'absolute', left: 84, top: 150,
      width: 258, height: 158,
      background: 'linear-gradient(180deg,#FFEB9C,#FFDE72)',
      border: `3px solid ${C.ink}`, borderRadius: 6,
      transform: `translateX(${(1 - s) * -360}px) rotate(${rot}deg) scale(${0.9 + s * 0.1})`,
      boxShadow: '8px 10px 0 rgba(58,49,41,0.16)',
      padding: '22px 22px 14px',
    }}>
      {/* 胶带 */}
      <div style={{
        position: 'absolute', left: 96, top: -14, width: 66, height: 26,
        background: 'rgba(255,255,255,0.55)', border: '2px solid rgba(58,49,41,0.25)',
        transform: 'rotate(-3deg)', borderRadius: 2,
      }} />
      <div style={{fontSize: 16, fontWeight: 700, color: '#8A6A18', marginBottom: 10}}>30秒剪完,</div>
      <div style={{
        display: 'inline-block', border: `2.5px solid ${C.ink}`, borderRadius: 8,
        padding: '5px 14px', fontSize: 25, fontWeight: 900, color: C.ink,
        background: 'rgba(255,255,255,0.5)',
      }}>
        Opus 5.5
      </div>
      <div style={{fontSize: 15, fontWeight: 700, color: '#8A6A18', marginTop: 12, textAlign: 'right'}}>— 小克收工</div>
    </div>
  );
};

// 手机竖排互动栏（拿捏了! / 10.2w / 2831 / 分享）
export const SocialRail = () => {
  const frame = useCurrentFrame();
  const fps = 30;
  const item = (x, children) => {
    const s = spring({frame: frame - x * fps, fps, config: {damping: 9, stiffness: 280}});
    if (frame < x * fps) return null;
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
        transform: `scale(${0.3 + s * 0.7})`, opacity: Math.min(1, s * 2),
      }}>
        {children}
      </div>
    );
  };
  return (
    <div style={{
      position: 'absolute', right: 12, top: 150, display: 'flex', flexDirection: 'column',
      gap: 16, alignItems: 'center',
    }}>
      {item(B.like[0], (
        <>
          <svg width={30} height={30} viewBox="0 0 24 24">
            <path d="M12 21 C6 15.5, 2.5 12.3, 2.5 8.6 C2.5 5.9, 4.6 4, 7 4 C9 4, 11 5.2, 12 7 C13 5.2, 15 4, 17 4 C19.4 4, 21.5 5.9, 21.5 8.6 C21.5 12.3, 18 15.5, 12 21 Z"
              fill="#FF4D5E" stroke="#fff" strokeWidth={1.6} />
          </svg>
          <span style={{color: '#fff', fontSize: 12, fontWeight: 800, textShadow: '1px 1px 0 rgba(0,0,0,0.4)'}}>10.2w</span>
        </>
      ))}
      {item(B.comment[0], (
        <>
          <svg width={28} height={28} viewBox="0 0 24 24">
            <path d="M4 5 h16 a2 2 0 0 1 2 2 v8 a2 2 0 0 1 -2 2 H10 l-5 4 v-4 H4 a2 2 0 0 1 -2 -2 V7 a2 2 0 0 1 2 -2 z"
              fill="#FFFFFF" stroke={C.ink} strokeWidth={1.6} />
          </svg>
          <span style={{color: '#fff', fontSize: 12, fontWeight: 800, textShadow: '1px 1px 0 rgba(0,0,0,0.4)'}}>2831</span>
        </>
      ))}
      {item(B.share[0], (
        <svg width={28} height={28} viewBox="0 0 24 24">
          <path d="M3 12 L17 5 L17 19 Z" fill="#FFFFFF" stroke={C.ink} strokeWidth={1.8} strokeLinejoin="round" />
          <rect x={18} y={14} width={3} height={12} rx={1.5} fill="#FFFFFF" stroke={C.ink} strokeWidth={1.4} />
        </svg>
      ))}
    </div>
  );
};

// 「拿捏了！」大字
export const Nazhile = () => {
  const frame = useCurrentFrame();
  const fps = 30;
  const a = 26.8 * fps;
  if (frame < a) return null;
  const s = spring({frame: frame - a, fps, config: {damping: 8, stiffness: 250}});
  const pulse = 1 + Math.sin(frame * 0.3) * 0.04;
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 64, display: 'flex', justifyContent: 'center',
    }}>
      <div style={{
        fontSize: 46, fontWeight: 900, color: C.yellow, WebkitTextStroke: '3.5px #C73E2E',
        textShadow: '4px 4px 0 rgba(58,49,41,0.25)',
        transform: `rotate(-5deg) scale(${0.4 + s * 0.6 * pulse})`, whiteSpace: 'nowrap',
      }}>
        拿捏了!
      </div>
    </div>
  );
};

// 彩带
export const Confetti = () => {
  const frame = useCurrentFrame();
  const fps = 30;
  const a = B.confetti[0] * fps;
  if (frame < a) return null;
  const t = (frame - a) / fps;
  const palette = [C.dog, C.yellow, C.teal, C.purple, '#FFFFFF', C.blue, C.red];
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none'}}>
      {Array.from({length: 90}, (_, i) => {
        const r = random(i + 7);
        const r2 = random(i + 130);
        const x = r * 1280;
        const delay = r2 * 0.8;
        const local = t - delay;
        if (local < 0) return null;
        const speed = 260 + r * 320;
        const y = -24 + local * speed + r2 * 40;
        if (y > 740) return null;
        const w = 7 + r2 * 9;
        return (
          <div
            key={i}
            style={{
              position: 'absolute', left: x, top: y, width: w, height: w * 0.55,
              background: palette[i % palette.length],
              transform: `rotate(${(local * (r > 0.5 ? 400 : -360)) % 360}deg)`,
              opacity: 0.92,
              borderRadius: 2,
            }}
          />
        );
      })}
    </div>
  );
};
