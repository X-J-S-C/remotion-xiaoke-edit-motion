import React from 'react';
import {useCurrentFrame, spring, interpolate} from 'remotion';
import {C, L} from '../theme';
import {MATERIALS, TRANSITIONS, TEXT_PRESETS, B} from '../beats';

const Mini = ({scene, size = 40}) => (
  <div style={{width: size, height: size * 0.72, borderRadius: 6, overflow: 'hidden', position: 'relative', border: `2px solid ${C.ink}`, flex: 'none'}}>
    <svg width="100%" height="100%" viewBox="0 0 40 29">
      {scene === 'night' ? (
        <>
          <rect width={40} height={29} fill={C.night1} />
          <circle cx={31} cy={7} r={4} fill={C.moon} />
          <rect x={0} y={20} width={9} height={9} fill="#0D1230" />
          <rect x={13} y={16} width={8} height={13} fill="#0D1230" />
          <rect x={24} y={19} width={7} height={10} fill="#0D1230" />
        </>
      ) : null}
      {scene === 'ramen' ? (
        <>
          <rect width={40} height={29} fill="#F6E7C6" />
          <ellipse cx={20} cy={18} rx={13} ry={7} fill={C.ramen} stroke={C.ink} strokeWidth={2} />
          <ellipse cx={20} cy={17} rx={10} ry={4.5} fill="#E9B25C" />
        </>
      ) : null}
      {scene === 'shiba' ? (
        <>
          <rect width={40} height={29} fill={C.shibaBg} />
          <circle cx={20} cy={15} r={10} fill={C.shiba} stroke={C.ink} strokeWidth={2} />
          <ellipse cx={20} cy={19} rx={5} ry={4} fill="#FFF6EA" />
        </>
      ) : null}
      {scene === 'disco' ? (
        <>
          <rect width={40} height={29} fill={C.disco} />
          <circle cx={20} cy={7} r={4} fill="#C9A6FF" />
          <rect x={11} y={15} width={18} height={13} rx={6} fill={C.dog} stroke={C.ink} strokeWidth={2} />
        </>
      ) : null}
    </svg>
  </div>
);

const Pop = ({inAt, children, delay = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfigLike();
  const s = spring({frame: frame - (inAt + delay) * fps, fps, config: {damping: 11, stiffness: 300}});
  if (frame < (inAt + delay) * fps) return null;
  return (
    <div style={{
      opacity: Math.min(1, s * 2),
      transform: `scale(${0.6 + 0.4 * s})`,
      transformOrigin: 'left center',
    }}>{children}</div>
  );
};

// 本地取 fps，避免顶层 import 复杂化
function useVideoConfigLike() {
  return {fps: 30};
}

export const LeftPanel = ({activeTab, cursorAt}) => {
  const frame = useCurrentFrame();
  const {fps} = {fps: 30};
  const visible =
    (activeTab !== null && frame < B.tabText[1] * fps) || (activeTab !== null && frame >= 9.8 * fps && frame < 12.9 * fps);
  if (!activeTab) return null;

  const rows = [];
  if (activeTab === '素材') {
    MATERIALS.forEach((m, i) => {
      const hl = frame >= (2.0 + i * 0.5) * fps && frame < (2.5 + i * 0.5) * fps;
      rows.push(
        <div key={m.name} style={rowStyle(hl)}>
          <Mini scene={m.scene} />
          <div style={{marginLeft: 10}}>
            <div style={{fontSize: 14, fontWeight: 700, color: C.ink}}>{m.name}</div>
            <div style={{fontSize: 11, color: C.inkSoft}}>00:0{2 + i}.4s</div>
          </div>
        </div>
      );
    });
  }
  if (activeTab === '转场') {
    TRANSITIONS.forEach((t) => {
      const delay = TRANSITIONS.indexOf(t) * 0.12;
      rows.push(
        <Pop key={t} inAt={B.tabTransition[0]} delay={delay}>
          <div style={rowStyle(t === '空心入网')}>
            <div style={gridIconStyle(t)} />
            <div style={{marginLeft: 10, fontSize: 14, fontWeight: t === '空心入网' ? 800 : 600, color: C.ink}}>{t}</div>
          </div>
        </Pop>
      );
    });
  }
  if (activeTab === '文字') {
    TEXT_PRESETS.forEach((t, i) => {
      const click = t === '前方高能' && cursorAt !== null;
      rows.push(
        <Pop key={t} inAt={B.tabText[0]} delay={i * 0.1}>
          <div style={rowStyle(t === '前方高能')}>
            <div style={{
              fontSize: 17, fontWeight: 800, color: t === '前方高能' ? '#E8A21C' : t === '好耶～' ? C.green : C.purple,
              textShadow: '1.5px 1.5px 0 rgba(58,49,41,0.15)',
            }}>{t}</div>
          </div>
        </Pop>
      );
    });
  }

  return (
    <div style={{
      position: 'absolute', left: L.panelX, top: L.panelY, width: L.panelW, height: L.panelH,
      background: C.panelBg, border: `2.5px solid ${C.ink}`, borderRadius: 14, padding: 12,
      boxShadow: '4px 5px 0 rgba(58,49,41,0.12)',
    }}>
      <div style={{
        fontSize: 15, fontWeight: 800, color: C.ink, marginBottom: 10,
        display: 'flex', justifyContent: 'space-between',
      }}>
        <span>{activeTab}</span>
        <span style={{color: C.inkSoft, fontWeight: 600, fontSize: 12}}>共 12 个</span>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>{rows}</div>
    </div>
  );
};

const rowStyle = (hl) => ({
  display: 'flex',
  alignItems: 'center',
  height: 46,
  borderRadius: 10,
  border: `2.5px solid ${hl ? '#E8A21C' : C.line}`,
  background: hl ? '#FFF3D6' : 'transparent',
  paddingLeft: 6,
  transition: 'all .12s',
});

const gridIconStyle = (t) => ({
  width: 26, height: 26, borderRadius: 7, flex: 'none',
  background: t === '闪白' ? '#FFFDF4' : t === '闪黑' ? '#3A3129' : t === '爱心' ? '#F2555A' : t === '圆形' ? '#8FB8FF' : t === '撕纸' ? '#F2D8A0' : 'transparent',
  border: `2.5px solid ${C.ink}`,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: t === '爱心' ? 15 : 13, color: '#fff',
});
