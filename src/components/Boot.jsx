import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {C} from '../theme';

// 开机画面：手机虚影 + 进度卡
export const Boot = () => {
  const frame = useCurrentFrame();
  const fps = 30;
  const p = interpolate(frame, [4, 1.0 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      {/* 背后手机虚影 */}
      <div style={{
        position: 'absolute', left: 508, top: 100, width: 196, height: 372, borderRadius: 30,
        background: 'rgba(36,31,28,0.55)', border: '3px solid rgba(36,31,28,0.7)', marginTop: 30,
      }} />
      <div style={{
        position: 'absolute', left: 530, top: 380, background: C.yellow, border: `2.5px solid ${C.ink}`,
        borderRadius: 8, padding: '3px 10px', fontSize: 14, fontWeight: 800, color: '#7A2E12',
        transform: 'rotate(-4deg)', marginTop: 40,
      }}>30秒前</div>
      {/* 进度卡 */}
      <div style={{
        position: 'relative', width: 420, height: 208, background: C.windowBg,
        border: `3px solid ${C.ink}`, borderRadius: 18, boxShadow: '8px 9px 0 rgba(58,49,41,0.14)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14,
      }}>
        <div style={{position: 'absolute', left: 20, top: 16, display: 'flex', gap: 8}}>
          {['#F76F6F', '#F7C948', '#6FCF76'].map((c, i) => (
            <div key={i} style={{width: 12, height: 12, borderRadius: 6, background: c, border: `2.5px solid ${C.ink}`}} />
          ))}
        </div>
        {/* 图标 */}
        <div style={{width: 54, height: 54, borderRadius: 14, background: C.dog, border: `3px solid ${C.ink}`, position: 'relative'}}>
          <div style={{position: 'absolute', left: 14, top: 26, width: 26, height: 15, borderRadius: 8, background: '#FFF6EA', border: `2px solid ${C.ink}`}} />
          <div style={{position: 'absolute', left: 20, top: 30, width: 4, height: 4, borderRadius: 2, background: C.ink}} />
          <div style={{position: 'absolute', left: 30, top: 30, width: 4, height: 4, borderRadius: 2, background: C.ink}} />
        </div>
        <div style={{fontSize: 21, fontWeight: 900, color: C.ink}}>小克剪辑</div>
        <div style={{width: 280, height: 14, borderRadius: 7, background: '#E9DFC5', border: `2.5px solid ${C.ink}`}}>
          <div style={{width: `${p * 100}%`, height: '100%', borderRadius: 5, background: C.sliderFill, transition: 'none'}} />
        </div>
        <div style={{fontSize: 14, fontWeight: 700, color: C.inkSoft}}>
          正在加载剪辑工程… {Math.round(p * 100)}%
        </div>
      </div>
    </div>
  );
};
