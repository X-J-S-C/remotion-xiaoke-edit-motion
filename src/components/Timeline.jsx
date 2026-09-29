import React from 'react';
import {useCurrentFrame, spring} from 'remotion';
import {C, L, timeToX} from '../theme';
import {CLIPS} from '../beats';

const Mini = ({scene}) => (
  <svg width="100%" height="100%" viewBox="0 0 40 24" preserveAspectRatio="xMidYMid slice" style={{display: 'block'}}>
    {scene === 'night' ? (
      <>
        <rect width={40} height={24} fill={C.night1} />
        <circle cx={32} cy={6} r={3.4} fill={C.moon} />
        <rect x={0} y={16} width={8} height={8} fill="#0D1230" />
        <rect x={12} y={12} width={7} height={12} fill="#0D1230" />
        <rect x={23} y={15} width={6} height={9} fill="#0D1230" />
      </>
    ) : null}
    {scene === 'ramen' ? (
      <>
        <rect width={40} height={24} fill="#F6E7C6" />
        <ellipse cx={20} cy={14} rx={11} ry={6} fill={C.ramen} stroke={C.ink} strokeWidth={1.6} />
        <ellipse cx={20} cy={13} rx={8} ry={4} fill="#E9B25C" />
      </>
    ) : null}
    {scene === 'shiba' ? (
      <>
        <rect width={40} height={24} fill={C.shibaBg} />
        <circle cx={20} cy={12} r={8} fill={C.shiba} stroke={C.ink} strokeWidth={1.6} />
        <ellipse cx={20} cy={15} rx={4} ry={3} fill="#FFF6EA" />
      </>
    ) : null}
    {scene === 'disco' ? (
      <>
        <rect width={40} height={24} fill={C.disco} />
        <circle cx={20} cy={6} r={3.4} fill="#C9A6FF" />
        <rect x={10} y={12} width={20} height={11} rx={5} fill={C.dog} stroke={C.ink} strokeWidth={1.6} />
      </>
    ) : null}
  </svg>
);

const ClipDrop = ({inAt, children}) => {
  const frame = useCurrentFrame();
  const fps = 30;
  const s = spring({frame: frame - inAt * fps, fps, config: {damping: 10, stiffness: 280, mass: 0.8}});
  if (frame < inAt * fps) return null;
  return (
    <div style={{
      width: '100%', height: '100%',
      opacity: Math.min(1, s * 2),
      transform: `scale(${0.82 + 0.18 * s}) rotate(${(1 - s) * 2.5}deg)`,
    }}>{children}</div>
  );
};

export const Timeline = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // 标尺（容器本身左移了 12px，换算回容器相对坐标）
  const rel = (x) => x - (L.trackX0 - 12);
  const ticks = [];
  for (let t = 0; t <= 28; t += 2) {
    ticks.push(
      <div key={t} style={{position: 'absolute', left: rel(timeToX(t)), top: 0}}>
        <div style={{width: 2.5, height: 9, background: C.ink, opacity: 0.75}} />
        <div style={{fontSize: 11, color: C.inkSoft, fontFamily: 'Consolas, monospace', transform: 'translateX(-50%)', marginTop: 1, whiteSpace: 'nowrap'}}>
          {`00.${String(t).padStart(2, '0')}`}
        </div>
      </div>
    );
  }
  const sub = [];
  for (let t = 0.5; t < 30; t += 1) {
    sub.push(<div key={t} style={{position: 'absolute', left: rel(timeToX(t)), top: 0, width: 2, height: 5, background: C.ink, opacity: 0.4}} />);
  }

  const playX = rel(timeToX(frame / fps));

  return (
    <div style={{position: 'absolute', left: L.trackX0 - 12, top: L.rulerY, width: L.trackW + 24, height: 140}}>
      {/* 标尺 */}
      <div style={{
        position: 'absolute', left: 0, top: 0, width: '100%', height: L.rulerH,
        background: C.panelBg, border: `2.5px solid ${C.ink}`, borderRadius: 8,
      }}>
        <div style={{position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 6}}>
          {sub}
          {ticks}
          {/* 播放头 */}
          <div style={{position: 'absolute', left: playX, top: -4, transform: 'translateX(-50%)'}}>
            <div style={{width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: `10px solid ${C.red}`}} />
            <div style={{width: 2.5, height: 34, background: C.red, marginLeft: -1.25, marginTop: -2}} />
          </div>
        </div>
      </div>

      {/* 视频轨 */}
      <div style={{position: 'absolute', left: 0, top: L.videoTrackY - L.rulerY, width: '100%', height: L.videoTrackH}}>
        {CLIPS.map((clip) => {
          const x = timeToX(clip.t0);
          const w = timeToX(clip.t1) - x;
          const first = clip.inAt === 0;
          return (
            <div key={clip.name} style={{position: 'absolute', left: rel(x), top: 0, width: w, height: L.videoTrackH}}>
              {first ? (
                <div style={{
                  width: '100%', height: '100%', borderRadius: 10, border: `2.5px solid ${C.ink}`,
                  background: '#EFE6CF', overflow: 'hidden', position: 'relative', display: 'flex',
                }}>
                  <Mini scene={clip.scene} />
                  <div style={{position: 'absolute', left: 6, bottom: 3, fontSize: 11, fontWeight: 700, color: '#FFF6E4', textShadow: `1px 1px 0 ${C.ink}`, fontFamily: 'inherit'}}>
                    {clip.name}
                  </div>
                </div>
              ) : (
                <ClipDrop inAt={clip.inAt}>
                  <div style={{
                    width: '100%', height: '100%', borderRadius: 10, border: `2.5px solid ${C.ink}`,
                    background: '#EFE6CF', overflow: 'hidden', position: 'relative', display: 'flex',
                    boxShadow: '3px 3px 0 rgba(58,49,41,0.16)',
                  }}>
                    <Mini scene={clip.scene} />
                    <div style={{position: 'absolute', left: 6, bottom: 3, fontSize: 11, fontWeight: 700, color: '#FFF6E4', textShadow: `1px 1px 0 ${C.ink}`}}>
                      {clip.name}
                    </div>
                  </div>
                </ClipDrop>
              )}
            </div>
          );
        })}
      </div>

      {/* 文字轨 */}
      <div style={{position: 'absolute', left: 0, top: L.textTrackY - L.rulerY, width: '100%', height: L.textTrackH}}>
        <ClipDrop inAt={7.85}>
          <div style={{
            position: 'absolute', left: rel(timeToX(8.0)), width: timeToX(12.5) - timeToX(8.0), height: L.textTrackH,
            borderRadius: 8, background: C.purple, border: `2.5px solid ${C.ink}`,
            color: '#FFF6E4', fontSize: 12.5, fontWeight: 800, display: 'flex', alignItems: 'center', paddingLeft: 10,
          }}>
            前方高能预警
          </div>
        </ClipDrop>
      </div>

      {/* 音频轨 */}
      <div style={{position: 'absolute', left: 0, top: L.audioTrackY - L.rulerY, width: '100%', height: L.audioTrackH}}>
        <ClipDrop inAt={1.35}>
          <div style={{
            position: 'absolute', left: 0, width: '100%', height: L.audioTrackH, borderRadius: 8,
            background: '#DDEFE3', border: `2.5px solid ${C.ink}`, display: 'flex', alignItems: 'center', gap: 2,
            padding: '0 8px', overflow: 'hidden',
          }}>
            {Array.from({length: 90}, (_, i) => {
              const h = 4 + Math.abs(Math.sin(i * 0.55 + frame * 0.09)) * 8 + Math.abs(Math.sin(i * 1.3)) * 3;
              return <div key={i} style={{width: 2.5, height: h, background: C.teal, borderRadius: 2, flex: 'none'}} />;
            })}
            <div style={{position: 'absolute', left: 10, top: 1, fontSize: 11, fontWeight: 700, color: '#1F6B58', background: 'rgba(255,255,255,0.75)', borderRadius: 4, padding: '0 4px'}}>
              bgm_小克桑.wav
            </div>
          </div>
        </ClipDrop>
      </div>
    </div>
  );
};
