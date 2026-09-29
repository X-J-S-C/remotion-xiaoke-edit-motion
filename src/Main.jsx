import React from 'react';
import {useCurrentFrame, spring, interpolate, staticFile, Audio} from 'remotion';
import {C, FONT, L, PX_PER_SEC, timeToX} from './theme';
import {B, PHONE_SCENES, DOG_PATH, BUBBLES} from './beats';
import {AppChrome, PhoneFrame, Clock} from './components/Chrome';
import {LeftPanel} from './components/LeftPanel';
import {AdjustPanel, phoneFilter} from './components/AdjustPanel';
import {Timeline} from './components/Timeline';
import {Dog, Bubble} from './components/Dog';
import {PhoneScene} from './components/PhoneScenes';
import {Boot} from './components/Boot';
import {RedLabel, SpeedLines, X10, Bonk, CtrlZ, FixedStamp, QianFang, HandCursor} from './components/Annotations';
import {StickyNote, SocialRail, Nazhile, Confetti} from './components/Finale';

// 纸纹理
const PaperTexture = () => (
  <div style={{
    position: 'absolute', inset: 0, opacity: 0.5,
    backgroundImage: 'radial-gradient(rgba(58,49,41,0.06) 1.2px, transparent 1.2px)',
    backgroundSize: '22px 22px',
  }} />
);

// 沿线移动
const moveAlong = (path, t) => {
  if (t <= path[0][0]) return [path[0][1], path[0][2]];
  for (let i = 0; i < path.length - 1; i++) {
    const [t0, x0, y0] = path[i];
    const [t1, x1, y1] = path[i + 1];
    if (t >= t0 && t <= t1) {
      const k = (t - t0) / (t1 - t0);
      const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      return [x0 + (x1 - x0) * e, y0 + (y1 - y0) * e];
    }
  }
  const last = path[path.length - 1];
  return [last[1], last[2]];
};

export const Main = () => {
  const frame = useCurrentFrame();
  const fps = 30;
  const t = frame / fps;

  // tab 切换
  let activeTab = '素材';
  if (t >= B.tabTransition[0] && t < B.tabText[0]) activeTab = '转场';
  else if (t >= B.tabText[0] && t < B.tabText[1]) activeTab = '文字';
  else if (t >= 9.8 && t < 12.9) activeTab = '素材';
  else if (t >= 12.9) activeTab = null;

  // 手机场景
  const sceneEntry = PHONE_SCENES.find(([a, bnd]) => t >= a && t < bnd) ?? PHONE_SCENES[0];
  const scene = sceneEntry[2];
  const sceneStart = sceneEntry[0];
  const scenePulse = spring({
    frame: frame - sceneStart * fps,
    fps,
    config: {damping: 13, stiffness: 260},
  });
  const flashBoundary = (() => {
    for (const [a] of PHONE_SCENES) {
      const b = a * fps;
      if (frame >= b && frame < b + 5) return 1 - (frame - b) / 5;
    }
    return 0;
  })();

  // 窗口入场
  const appIn = spring({frame: frame - 1.15 * fps, fps, config: {damping: 14, stiffness: 120}});

  // 狗
  const [dogX, dogY] = moveAlong(DOG_PATH, t);
  let pose = 'walk';
  if (t >= 8.8 && t < 21.1) pose = 'point';
  if (t >= 26.0) pose = 'celebrate';
  const sunglasses = t >= 22.4 && t < 26.0;
  const fallSpin = t >= 21.2 && t < 22.4 ? interpolate(frame, [21.2 * fps, 22.4 * fps], [0, 540]) : 0;

  // 光标位置
  let cursor = null;
  if (t >= B.dragIn && t < B.dragOut) {
    const k = (t - B.dragIn) / (B.dragOut - B.dragIn);
    const cx = interpolate(k, [0, 1], [128, timeToX(B.clipJuquan || 5.2)]);
    const cy = interpolate(k, [0, 0.85, 1], [176, 470, 596]);
    cursor = {x: cx, y: cy, ghost: k > 0.06 && k < 0.95};
  } else if (t >= B.presetClick && t < 7.95) {
    cursor = {x: 150, y: 186, ghost: false};
  } else if (t >= B.sat[0] && t < B.sat[1]) {
    cursor = {x: 1150, y: 228, ghost: false};
  } else if (t >= B.zoom[0] && t < B.zoom[1]) {
    cursor = {x: 1150, y: 290, ghost: false};
  } else if (t >= B.speed[0] && t < B.speedBack[1]) {
    cursor = {x: 1150, y: 352, ghost: false};
  }

  const filter = phoneFilter(frame, 30);

  return (
    <div style={{
      width: '100%', height: '100%', background: C.page, position: 'relative',
      fontFamily: FONT, overflow: 'hidden', userSelect: 'none',
    }}>
      <PaperTexture />
      <Audio src={staticFile('bgm.wav')} volume={0.55} />

      {frame < 1.3 * fps ? <Boot /> : (
        <div style={{
          position: 'absolute', inset: 0,
          opacity: Math.min(1, appIn * 1.4),
          transform: `scale(${0.965 + 0.035 * appIn})`,
        }}>
          <AppChrome activeTab={activeTab} doneOn={t >= B.doneBtn}>
            {/* 左面板 */}
            <div style={{opacity: t < 9.8 || (t >= 9.8 && t < 12.9) ? 1 : 0}}>
              <LeftPanel activeTab={activeTab} />
            </div>
            {/* 手机 */}
            <PhoneFrame filter={filter}>
              <div style={{width: '100%', height: '100%', transform: `scale(${0.98 + scenePulse * 0.02})`}}>
                <PhoneScene scene={scene} t={frame} />
              </div>
              {scene !== 'disco' ? <QianFang /> : null}
              {flashBoundary > 0 ? (
                <div style={{position: 'absolute', inset: 0, background: '#fff', opacity: flashBoundary * 0.9}} />
              ) : null}
              {t >= 26.6 ? (
                <>
                  <Nazhile />
                  <SocialRail />
                </>
              ) : null}
            </PhoneFrame>
            {/* 右面板 */}
            <AdjustPanel />
            {/* 时间轴 */}
            <Timeline />
          </AppChrome>

          {/* 装饰层 */}
          <SpeedLines t0={15.4} t1={21.4} />
          <RedLabel x={660} y={430} tx={1120} ty={252} t0={B.satLabel[0]} t1={B.satLabel[1]} text="饱和度:拉满!" badge />
          <RedLabel x={830} y={455} tx={1110} ty={392} t0={B.speedLabel[0]} t1={B.speedLabel[1]} text="速度:拉满!" />
          <CtrlZ />
          <FixedStamp />
          <X10 />
          <Bonk />

          {/* 小克 */}
          <div style={{transform: `rotate(${fallSpin}deg)`, transformOrigin: `${dogX}px 600px`}}>
            <Dog x={dogX} y={dogY} pose={pose} sunglasses={sunglasses} scale={t >= 26 ? 0.92 : 1} />
          </div>
          {BUBBLES.map(([text, a, b]) => {
            const bx = a >= 12.9 && a < 15.6 ? dogX + 130 : dogX + 6;
            return t >= a && t < b ? (
              <Bubble key={text} text={text} x={bx} y={dogY - 92} t0={a} />
            ) : null;
          })}

          {/* 拾起的素材虚影 */}
          {cursor && cursor.ghost ? (
            <div style={{
              position: 'absolute', left: cursor.x + 16, top: cursor.y + 10, width: 44, height: 32,
              border: `2.5px solid ${C.ink}`, borderRadius: 6, overflow: 'hidden',
              background: '#F6E7C6', opacity: 0.95, transform: 'rotate(4deg)',
            }}>
              <svg width="100%" height="100%" viewBox="0 0 44 32">
                <rect width={44} height={32} fill="#F6E7C6" />
                <ellipse cx={22} cy={20} rx={13} ry={7} fill={C.ramen} stroke={C.ink} strokeWidth={2} />
                <ellipse cx={22} cy={19} rx={9} ry={4} fill="#E9B25C" />
              </svg>
            </div>
          ) : null}
          {cursor ? <HandCursor x={cursor.x} y={cursor.y} active /> : null}

          {/* 收尾 */}
          <StickyNote />
          <Confetti />
        </div>
      )}
    </div>
  );
};
