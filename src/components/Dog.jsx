import React from 'react';
import {useCurrentFrame, useVideoConfig, spring} from 'remotion';
import {C} from '../theme';

// 小克：橘色圆滚滚小狗。pose: walk / point / celebrate / sit
export const Dog = ({x, y, pose = 'walk', scale = 1, sunglasses = false}) => {
  const frame = useCurrentFrame();
  const bob = pose === 'walk' ? Math.sin(frame * 0.35) * 2.5 : Math.sin(frame * 0.18) * 1.5;
  const jump = pose === 'celebrate' ? Math.abs(Math.sin(frame * 0.3)) * 6 : 0;
  const tilt = pose === 'point' ? -4 : Math.sin(frame * 0.12) * 1.2;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%,-100%) scale(${scale}) rotate(${tilt}deg)`,
        transformOrigin: 'bottom center',
      }}
    >
      <svg
        width={100}
        height={92}
        viewBox="0 0 100 92"
        style={{transform: `translateY(${bob - jump}px)`}}
      >
        <g style={{transformOrigin: '86px 52px', transform: `rotate(${Math.sin(frame * 0.4) * 14}deg)`}}>
          <path d="M86 50 Q100 44 96 30" stroke={C.dog} strokeWidth={9} strokeLinecap="round" fill="none" />
        </g>
        <rect x={13} y={6} width={17} height={30} rx={8} fill={C.dogDark} transform="rotate(-8 21 20)" />
        <rect x={70} y={6} width={17} height={30} rx={8} fill={C.dogDark} transform="rotate(8 79 20)" />
        <rect x={16} y={34} width={68} height={42} rx={19} fill={C.dog} stroke={C.ink} strokeWidth={3} />
        <rect x={28} y={72} width={13} height={12} rx={6} fill={C.dogDark} />
        <rect x={59} y={72} width={13} height={12} rx={6} fill={C.dogDark} />
        {pose === 'point' ? (
          <rect x={76} y={30} width={26} height={11} rx={5.5} fill={C.dog} stroke={C.ink} strokeWidth={2.5} transform="rotate(-14 76 36)" />
        ) : pose === 'celebrate' ? (
          <>
            <rect x={4} y={12} width={11} height={26} rx={5.5} fill={C.dog} stroke={C.ink} strokeWidth={2.5} transform="rotate(24 9 38)" />
            <rect x={85} y={12} width={11} height={26} rx={5.5} fill={C.dog} stroke={C.ink} strokeWidth={2.5} transform="rotate(-24 91 38)" />
          </>
        ) : (
          <>
            <rect x={9} y={44} width={12} height={26} rx={6} fill={C.dog} stroke={C.ink} strokeWidth={2.5} transform="rotate(10 15 57)" />
            <rect x={79} y={44} width={12} height={26} rx={6} fill={C.dog} stroke={C.ink} strokeWidth={2.5} transform="rotate(-10 85 57)" />
          </>
        )}
        <ellipse cx={50} cy={46} rx={21} ry={16} fill="#FFF6EA" stroke={C.ink} strokeWidth={2.5} />
        {sunglasses ? (
          <g>
            <rect x={30} y={38} width={16} height={11} rx={5} fill="#2B2B33" transform="rotate(-6 38 43)" />
            <rect x={54} y={38} width={16} height={11} rx={5} fill="#2B2B33" transform="rotate(6 62 43)" />
            <rect x={45} y={41} width={10} height={3} fill="#2B2B33" />
            <path d="M33 41 l2 2" stroke="#8FB8FF" strokeWidth={1.6} />
          </g>
        ) : (
          <>
            <circle cx={40} cy={42} r={3.4} fill={C.ink} />
            <circle cx={60} cy={42} r={3.4} fill={C.ink} />
            <circle cx={41} cy={40.8} r={1.1} fill="#fff" />
            <circle cx={61} cy={40.8} r={1.1} fill="#fff" />
            <ellipse cx={28} cy={49} rx={4} ry={2.6} fill="#F5A8A0" opacity={0.8} />
            <ellipse cx={72} cy={49} rx={4} ry={2.6} fill="#F5A8A0" opacity={0.8} />
            <path d="M45 52 Q50 56 55 52" stroke={C.ink} strokeWidth={2.4} fill="none" strokeLinecap="round" />
          </>
        )}
        <ellipse cx={50} cy={51} rx={3.2} ry={2.4} fill={C.ink} />
      </svg>
    </div>
  );
};

// 语音气泡：t0 是出现时刻（秒），内部做弹性放大
export const Bubble = ({text, x, y, t0, color = '#FFFFFF', tail = true}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({
    frame: frame - t0 * fps,
    fps,
    config: {damping: 9, stiffness: 320, mass: 0.7},
  });
  if (frame < t0 * fps) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%,-100%) scale(${0.3 + 0.7 * s})`,
        background: color,
        border: `3px solid ${C.ink}`,
        borderRadius: 18,
        padding: '8px 16px',
        fontWeight: 700,
        fontSize: 20,
        color: C.ink,
        boxShadow: '4px 4px 0 rgba(58,49,41,0.18)',
        whiteSpace: 'nowrap',
      }}
    >
      {text}
      {tail ? (
        <>
          <div style={triangleStyle(-12, 9, 9, C.ink)} />
          <div style={triangleStyle(-7, 7, 7, color)} />
        </>
      ) : null}
    </div>
  );
};

const triangleStyle = (bottom, half, height, color) => ({
  position: 'absolute',
  left: 22,
  bottom,
  width: 0,
  height: 0,
  borderLeft: `${half}px solid transparent`,
  borderRight: `${half}px solid transparent`,
  borderTop: `${height}px solid ${color}`,
});
