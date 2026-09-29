import React from 'react';
import {useCurrentFrame, spring, random} from 'remotion';
import {C, L} from '../theme';
import {B} from '../beats';

// 手写风红字 + 弯箭头
export const RedLabel = ({x, y, tx, ty, t0, t1, text, badge = false}) => {
  const frame = useCurrentFrame();
  const fps = 30;
  const a = t0 * fps;
  const b = t1 * fps;
  if (frame < a || frame > b) return null;
  const s = spring({frame: frame - a, fps, config: {damping: 10, stiffness: 240}});
  const out = frame > b - 10;
  const fade = out ? (b - frame) / 10 : 1;
  const wob = Math.sin((frame - a) * 0.18) * 3;

  // 从标签到目标点的弧形箭头
  const mx = (x + tx) / 2;
  const my = (y + ty) / 2 - 46;
  const ang = Math.atan2(ty - my, tx - mx);

  return (
    <div style={{position: 'absolute', inset: 0, opacity: fade, pointerEvents: 'none'}}>
      <svg width={1280} height={720} style={{position: 'absolute', left: 0, top: 0}}>
        <path
          d={`M${x} ${y + 16} Q${mx} ${my} ${tx} ${ty}`}
          stroke={C.red}
          strokeWidth={4.5}
          fill="none"
          strokeLinecap="round"
          style={{
            strokeDasharray: 420,
            strokeDashoffset: 420 - s * 420,
            filter: 'drop-shadow(2px 2px 0 rgba(225,75,75,0.25))',
          }}
        />
        <g transform={`translate(${tx} ${ty}) rotate(${(ang * 180) / Math.PI}) scale(${s})`}>
          <path d="M0 0 L-16 -9 L-13 0 L-16 9 Z" fill={C.red} />
        </g>
      </svg>
      <div
        style={{
          position: 'absolute', left: x, top: y - 8 + wob * 0.4,
          transform: `translate(-50%,-100%) rotate(${-4 + wob * 0.3}deg) scale(${0.5 + 0.5 * s})`,
          fontSize: 26, fontWeight: 900, color: C.red, whiteSpace: 'nowrap',
          textShadow: '2px 2px 0 rgba(255,255,255,0.9), -1px -1px 0 rgba(255,255,255,0.9)',
        }}
      >
        {text}
      </div>
      {badge ? (
        <div
          style={{
            position: 'absolute', left: x + 88, top: y + 22,
            background: C.red, color: '#fff', fontWeight: 900, fontSize: 19,
            padding: '4px 12px', borderRadius: 10, transform: `rotate(6deg) scale(${0.6 + 0.4 * s})`,
            border: `3px solid #B93333`,
            boxShadow: '3px 3px 0 rgba(58,49,41,0.18)',
          }}
        >
          爆表!!
        </div>
      ) : null}
    </div>
  );
};

// 竖排速度线
export const SpeedLines = ({t0, t1}) => {
  const frame = useCurrentFrame();
  const fps = 30;
  if (frame < t0 * fps || frame > t1 * fps) return null;
  const lines = Array.from({length: 26}, (_, i) => i * 53 % 1168);
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1280, height: 720, overflow: 'hidden', pointerEvents: 'none'}}>
      {lines.map((x, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: ((x + frame * (14 + (i % 3) * 5)) % 1168) - 100,
            top: 60 + ((i * 89) % 500),
            width: 60 + (i % 3) * 26,
            height: 3,
            background: 'rgba(255,255,255,0.85)',
            borderRadius: 2,
          }}
        />
      ))}
    </div>
  );
};

// 漫画大字（10倍速!!! / BONK!）
const Comic = ({text, t0, t1, x, y, size = 64, color = C.yellow}) => {
  const frame = useCurrentFrame();
  const fps = 30;
  const a = t0 * fps, b = t1 * fps;
  if (frame < a || frame > b) return null;
  const s = spring({frame: frame - a, fps, config: {damping: 7, stiffness: 300, mass: 0.6}});
  const fade = frame > b - 12 ? (b - frame) / 12 : 1;
  const shake = Math.sin(frame * 1.3) * (2 + (frame - a) * 0.05);
  return (
    <div
      style={{
        position: 'absolute', left: x, top: y,
        transform: `translate(-50%,-50%) rotate(${(random(x + y) * 8 - 4)}deg) scale(${0.4 + s * 0.6})`,
        fontSize: size, fontWeight: 900, color,
        WebkitTextStroke: '4px #C73E2E',
        textShadow: '5px 5px 0 rgba(58,49,41,0.25)',
        opacity: fade, whiteSpace: 'nowrap',
      }}
    >
      <span style={{display: 'inline-block', transform: `translateX(${shake}px)`}}>{text}</span>
    </div>
  );
};

export const X10 = () => <Comic text="10倍速!!!" t0={B.x10[0]} t1={B.x10[1]} x={606} y={180} />;
export const Bonk = () => (
  <>
    <Comic text="BONK!" t0={B.bonk[0]} t1={B.bonk[1]} x={606} y={252} size={92} />
    <Comic text="哐当" t0={B.bonk[0] + 0.12} t1={B.bonk[1]} x={480} y={330} size={34} color="#FFF6E4" />
  </>
);

// Ctrl+Z 键盘帽
export const CtrlZ = () => {
  const frame = useCurrentFrame();
  const fps = 30;
  const a = B.fix[0] * fps, b = B.fix[1] * fps + 4;
  if (frame < a || frame > b) return null;
  const s = spring({frame: frame - a, fps, config: {damping: 10, stiffness: 260}});
  const out = frame > b - 8 ? (b - frame) / 8 : 1;
  return (
    <div style={{position: 'absolute', left: 430, top: 470, transform: `scale(${0.4 + s * 0.6}) rotate(-6deg)`, opacity: out, display: 'flex', gap: 6, alignItems: 'center'}}>
      <div style={keyStyle()}>Ctrl</div>
      <div style={{fontSize: 18, fontWeight: 900, color: C.ink}}>+</div>
      <div style={keyStyle()}>Z</div>
      <div style={{
        marginLeft: 10, background: '#fff', border: `2.5px solid ${C.ink}`, borderRadius: 12,
        padding: '4px 10px', fontSize: 15, fontWeight: 800, color: C.green, rotate: '-3deg',
      }}>撤回!</div>
    </div>
  );
};

const keyStyle = () => ({
  width: 44, height: 40, borderRadius: 8, background: '#FFFFFF',
  border: `2.5px solid ${C.ink}`, boxShadow: `0 4px 0 ${C.ink}`,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: 15, fontWeight: 800, color: C.ink,
});

// 「已修好」印章
export const FixedStamp = () => {
  const frame = useCurrentFrame();
  const fps = 30;
  const a = B.fix[0] * fps, b = 15.9 * fps;
  if (frame < a || frame > b) return null;
  const t = (frame - a) / 9;
  const s = t < 1 ? 2.4 - 1.4 * t : 1;
  const fade = frame > b - 10 ? (b - frame) / 10 : 1;
  return (
    <div style={{
      position: 'absolute', left: 610, top: 268,
      transform: `rotate(-14deg) scale(${s})`,
      border: `4px solid ${C.green}`, color: C.green, borderRadius: 10,
      padding: '4px 14px', fontSize: 27, fontWeight: 900, letterSpacing: 4,
      opacity: fade * (t < 1 ? t : 1),
      boxShadow: `0 0 0 3px rgba(76,175,109,0.18)`,
      textShadow: '1px 1px 0 rgba(76,175,109,0.2)',
    }}>
      已修好
    </div>
  );
};

// 手机顶部黄字横幅「前方高能预警」
export const QianFang = () => {
  const frame = useCurrentFrame();
  const fps = 30;
  const a = B.qianfang[0] * fps, b = B.qianfang[1] * fps;
  if (frame < a || frame > b) return null;
  const s = spring({frame: frame - a, fps, config: {damping: 9, stiffness: 300}});
  const sh = Math.sin(frame * 0.9) * 1.6;
  const fade = frame > b - 12 ? (b - frame) / 12 : 1;
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, top: 30,
      display: 'flex', justifyContent: 'center', opacity: fade,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        background: 'linear-gradient(180deg,#FFE066,#F5B81B)',
        border: `2.5px solid ${C.ink}`, borderRadius: 8, padding: '4px 10px',
        transform: `scale(${0.4 + s * 0.6}) skewX(${sh}deg)`,
        boxShadow: '3px 3px 0 rgba(58,49,41,0.2)',
      }}>
        <span style={{fontSize: 14, fontWeight: 900, color: '#7A2E12'}}>⚠ 前方高能预警</span>
      </div>
    </div>
  );
};

export const HandCursor = ({x, y, active}) => {
  const frame = useCurrentFrame();
  if (!active) return null;
  const click = Math.floor(frame / 10) % 2 === 0;
  return (
    <svg
      width={30}
      height={34}
      viewBox="0 0 30 34"
      style={{
        position: 'absolute', left: x, top: y, transform: `translate(-4px,-2px) scale(${click ? 0.88 : 1}) rotate(-12deg)`,
        filter: 'drop-shadow(2px 3px 0 rgba(58,49,41,0.25))',
      }}
    >
      <path d="M7 3 L7 24 L12 20 L16 30 L21 28 L17 18 L24 17 L7 3 Z"
        fill="#FFF6E4" stroke={C.ink} strokeWidth={2.6} strokeLinejoin="round" />
    </svg>
  );
};
