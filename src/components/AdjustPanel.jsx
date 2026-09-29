import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {C, L} from '../theme';
import {SLIDERS, B} from '../beats';

const lerp = (frame, fps, range, from, to) =>
  interpolate(frame, [range[0] * fps, range[1] * fps], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

// 当前各滑杆的实时值（0..1 归一 + 展示串）
export const sliderState = (frame, fps) => {
  const flash = lerp(frame, fps, B.flash, 0, 0.7);
  const sat = lerp(frame, fps, B.sat, 0.3, 1.1);
  const zoom = lerp(frame, fps, B.zoom, 0, 0.6);
  const speedUp = lerp(frame, fps, B.speed, 1, 2);
  const speedDown = lerp(frame, fps, B.speedBack, 2, 1);
  const speed = Math.min(speedUp, speedDown);
  return {flash, sat, zoom, speed};
};

export const sliderLabel = (frame, fps) => {
  const s = sliderState(frame, fps);
  return {
    flash: `${Math.round(s.flash * 100)}%`,
    sat: `${Math.round(s.sat * 100)}%`,
    zoom: `${Math.round(s.zoom * 100)}%`,
    speed: `${s.speed.toFixed(1)}x`,
  };
};

// 手机画面的 filter（由滑杆驱动）
export const phoneFilter = (frame, fps) => {
  const s = sliderState(frame, fps);
  return `brightness(${1 + s.flash * 0.45}) saturate(${0.9 + s.sat * 0.55}) contrast(1.04)`;
};

const SliderRow = ({label, valueText, ratio, hot, activeDrag, frame, fps}) => {
  const dragT = activeDrag ? Math.min(1, (frame - activeDrag * fps) / 12) : 0;
  const knob = 20 + ratio * 128;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', height: 52, borderRadius: 10,
      border: `2.5px solid ${hot ? '#E8A21C' : C.line}`,
      background: hot ? '#FFF6DE' : 'transparent',
      padding: '0 12px',
      marginBottom: 10,
    }}>
      <span style={{fontSize: 14, fontWeight: 700, color: C.ink, width: 62, flex: 'none'}}>{label}</span>
      <div style={{flex: 1, position: 'relative', height: 24, marginLeft: 6}}>
        <div style={{position: 'absolute', top: 8, left: 0, right: 0, height: 9, borderRadius: 5, background: '#E9DFC5', border: `2px solid ${C.ink}`}} />
        <div style={{
          position: 'absolute', top: 8, left: 0, width: `${ratio * 100}%`, height: 9, borderRadius: 5,
          background: C.sliderFill, border: `2px solid ${C.ink}`, boxSizing: 'border-box',
        }} />
        <div style={{
          position: 'absolute', top: dragT ? 2 : 4, left: knob - 8, width: 17, height: 17, borderRadius: 9,
          background: '#FFFFFF', border: `3px solid ${C.ink}`,
          transform: `scale(${0.7 + dragT * 0.3})`,
        }} />
      </div>
      <span style={{
        marginLeft: 10, fontSize: 13, fontWeight: 800, width: 44, textAlign: 'right',
        color: hot ? '#C77A12' : C.inkSoft, flex: 'none',
      }}>{valueText}</span>
    </div>
  );
};

export const AdjustPanel = () => {
  const frame = useCurrentFrame();
  const fps = 30;
  const s = sliderState(frame, fps);
  const labels = sliderLabel(frame, fps);
  const inRange = (t0, t1) => frame >= t0 * fps && frame <= t1 * fps;
  const hotFlash = inRange(B.flash[0], B.flash[1]);
  const hotSat = inRange(B.sat[0], B.sat[1]);
  const hotZoom = inRange(B.zoom[0], B.zoom[1]);
  const hotSpeed = inRange(B.speed[0], B.speedBack[1]);

  return (
    <div style={{
      position: 'absolute', left: L.rightX, top: L.rightY, width: L.rightW, height: L.rightH,
      background: C.panelBg, border: `2.5px solid ${C.ink}`, borderRadius: 14, padding: 14,
      boxShadow: '4px 5px 0 rgba(58,49,41,0.12)',
    }}>
      <div style={{fontSize: 15, fontWeight: 800, color: C.ink, marginBottom: 12}}>调整</div>
      <SliderRow label="闪光" valueText={labels.flash} ratio={s.flash} hot={hotFlash} activeDrag={hotFlash ? B.flash[0] : 0} frame={frame} fps={fps} />
      <SliderRow label="饱和度" valueText={labels.sat} ratio={Math.min(1, s.sat / 1.5)} hot={hotSat} activeDrag={hotSat ? B.sat[0] : 0} frame={frame} fps={fps} />
      <SliderRow label="缩放冲击" valueText={labels.zoom} ratio={s.zoom} hot={hotZoom} activeDrag={hotZoom ? B.zoom[0] : 0} frame={frame} fps={fps} />
      <SliderRow label="速度" valueText={labels.speed} ratio={(s.speed - 0.5) / 2} hot={hotSpeed} activeDrag={hotSpeed ? B.speed[0] : 0} frame={frame} fps={fps} />
      <div style={{
        marginTop: 6, padding: '10px 12px', borderRadius: 10, background: '#FFF6DE',
        border: `2px dashed #E8A21C`, fontSize: 12, color: '#8A6A18', fontWeight: 700, lineHeight: 1.5,
      }}>
        Opus 5.5 配方：<br />闪光 70% · 饱和 110%<br />缩放冲击 60% · 1.0x
      </div>
    </div>
  );
};
