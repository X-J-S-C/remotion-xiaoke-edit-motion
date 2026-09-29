import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {C, L} from '../theme';

export const Clock = () => {
  const frame = useCurrentFrame();
  const s = Math.min(29, Math.floor(frame / 30));
  const f = Math.floor(frame % 30);
  return (
    <span style={{fontFamily: 'Consolas, monospace', fontSize: 15, color: C.ink, letterSpacing: 1}}>
      {`00:00:${String(s).padStart(2, '0')}:${String(f).padStart(2, '0')}`}
    </span>
  );
};

// 应用窗口 + 顶栏
export const AppChrome = ({activeTab, doneOn, children}) => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin(frame * 0.35) * 0.05;
  return (
    <div
      style={{
        position: 'absolute',
        left: L.winX,
        top: L.winY,
        width: L.winW,
        height: L.winH,
        background: C.windowBg,
        border: `3px solid ${C.ink}`,
        borderRadius: 22,
        boxShadow: '10px 12px 0 rgba(58,49,41,0.13)',
        overflow: 'hidden',
      }}
    >
      {/* 顶栏 */}
      <div style={{position: 'absolute', left: 0, top: 0, width: '100%', height: L.titleH, borderBottom: `2.5px solid ${C.ink}`}}>
        <div style={{position: 'absolute', left: 26, top: 21, display: 'flex', gap: 10}}>
          {['#F76F6F', '#F7C948', '#6FCF76'].map((c, i) => (
            <div key={i} style={{width: 14, height: 14, borderRadius: 7, background: c, border: `2.5px solid ${C.ink}`}} />
          ))}
        </div>
        <div style={{position: 'absolute', left: 330, top: 13, display: 'flex', gap: 8}}>
          {['素材', '转场', '文字'].map((t) => {
            const on = activeTab === t;
            return (
              <div key={t} style={{
                padding: '5px 16px',
                borderRadius: 15,
                background: on ? C.ink : 'transparent',
                color: on ? '#FFF6E4' : C.inkSoft,
                border: `2.5px solid ${on ? C.ink : 'transparent'}`,
                fontWeight: 700,
                fontSize: 16,
              }}>{t}</div>
            );
          })}
        </div>
        <div style={{position: 'absolute', left: 745, top: 16, transform: 'translateX(-50%)', fontSize: 14, color: C.inkSoft, fontWeight: 600}}>
          小克剪辑 - 最终版 - <span style={{color: C.ink}}>打死不改(3).mp4</span>
        </div>
        <div style={{position: 'absolute', right: 158, top: 18}}>
          <Clock />
        </div>
        <div style={{
          position: 'absolute', right: 108, top: 14, padding: '3px 10px', borderRadius: 8,
          background: C.ink, color: '#FFF6E4', fontSize: 13, fontWeight: 700,
        }}>1080P</div>
        <div style={{
          position: 'absolute', right: 24, top: 12, width: 72, height: 32, borderRadius: 12,
          background: doneOn ? C.blue : '#D8CDB4',
          border: `2.5px solid ${C.ink}`,
          color: doneOn ? '#fff' : C.inkSoft,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: 16,
          transform: doneOn ? `scale(${pulse})` : 'scale(1)',
          boxShadow: doneOn ? `0 0 0 4px rgba(78,140,255,0.22)` : 'none',
        }}>✓ 完成</div>
      </div>
      {children}
    </div>
  );
};

// 手机模型（屏幕 filter 由调整面板驱动）
export const PhoneFrame = ({filter, children}) => {
  const frame = useCurrentFrame();
  const shakeBase = 0;
  let shake = shakeBase;
  if (frame >= 21.2 * 30 && frame <= 22.0 * 30) {
    shake = Math.sin(frame * 2.7) * 5;
  }
  return (
    <div style={{
      position: 'absolute',
      left: L.phoneX,
      top: L.phoneY,
      width: L.phoneW,
      height: L.phoneH,
      background: '#241F1C',
      borderRadius: 30,
      border: `3px solid #17130F`,
      boxShadow: '6px 8px 0 rgba(58,49,41,0.2)',
      padding: 8,
      transform: `translateX(${shake}px)`,
    }}>
      <div style={{
        position: 'absolute', left: 76, top: 14, width: 44, height: 12, borderRadius: 6, background: '#17130F', zIndex: 5,
      }} />
      <div style={{
        width: '100%', height: '100%', borderRadius: 22, overflow: 'hidden', position: 'relative',
        background: '#000', filter,
      }}>
        {children}
      </div>
      <div style={{
        position: 'absolute', left: 8, right: 8, bottom: 4, height: 4, margin: '0 34px', borderRadius: 2, background: '#4A4238',
      }} />
    </div>
  );
};
