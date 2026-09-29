import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../theme';

// 手机预览里的四段「素材画面」，全部 SVG 手绘
export const PhoneScene = ({scene, t}) => {
  const frame = useCurrentFrame();
  const wobble = Math.sin(frame * 0.25) * 1.1;

  return (
    <div style={{width: '100%', height: '100%', position: 'relative', overflow: 'hidden', transform: `rotate(${wobble * 0.3}deg)`}}>
      {scene === 'night' ? <Night t={t} /> : null}
      {scene === 'ramen' ? <Ramen t={t} /> : null}
      {scene === 'shiba' ? <Shiba t={t} /> : null}
      {scene === 'disco' ? <Disco t={t} /> : null}
    </div>
  );
};

const Night = ({t}) => {
  const frame = useCurrentFrame();
  const stars = Array.from({length: 22}, (_, i) => ({
    x: (i * 37) % 172,
    y: (i * 53) % 150,
    r: 1 + ((i * 7) % 3) * 0.5,
    phase: i * 0.8,
  }));
  return (
    <div style={{position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${C.night1} 0%, ${C.night2} 62%, #3A4A8F 100%)`}}>
      <svg width="100%" height="100%" viewBox="0 0 172 364">
        {stars.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#FFF6C9" opacity={0.5 + 0.5 * Math.sin(frame * 0.1 + s.phase)} />
        ))}
        {/* 月亮 */}
        <g transform="translate(126 44)">
          <circle r={22} fill={C.moon} stroke="#E8B93F" strokeWidth={2} />
          <circle cx={-8} cy={2} r={3} fill="#B98A1E" />
          <circle cx={9} cy={-5} r={2.2} fill="#B98A1E" />
          <path d="M-7 8 Q0 14 7 8" stroke="#B98A1E" strokeWidth={2.4} fill="none" strokeLinecap="round" />
        </g>
        {/* 云 */}
        <g fill="#4A5899" opacity={0.85}>
          <ellipse cx={44 + Math.sin(frame * 0.05) * 4} cy={54} rx={26} ry={10} />
          <ellipse cx={62 + Math.sin(frame * 0.05) * 4} cy={48} rx={16} ry={8} />
        </g>
        {/* 城市剪影 */}
        <g fill="#0D1230">
          <rect x={0} y={240} width={26} height={124} rx={2} />
          <rect x={30} y={268} width={20} height={96} rx={2} />
          <rect x={54} y={220} width={24} height={144} rx={2} />
          <rect x={82} y={252} width={18} height={112} rx={2} />
          <rect x={104} y={228} width={26} height={136} rx={2} />
          <rect x={134} y={262} width={38} height={102} rx={2} />
        </g>
        <g fill="#FFD86B">
          {Array.from({length: 34}, (_, i) => {
            const bx = [2, 34, 58, 86, 108, 138][i % 6] + 4 + ((i * 13) % 14);
            const by = [248, 276, 230, 260, 236, 272][i % 6] + 12 + ((i * 7) % 40);
            return <rect key={i} x={bx} y={by % 360} width={5} height={7} rx={1} opacity={0.6 + 0.4 * ((i * 37) % 7) / 7} />;
          })}
        </g>
        <rect x={0} y={358} width={172} height={6} fill="#0A0E24" />
      </svg>
    </div>
  );
};

const Ramen = ({t}) => {
  const frame = useCurrentFrame();
  const steam = (i) => Math.sin(frame * 0.09 + i * 1.7) * 3;
  return (
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #F6E7C6 0%, #EFD9AE 100%)'}}>
      <svg width="100%" height="100%" viewBox="0 0 172 364">
        <rect x={8} y={8} width={156} height={40} rx={8} fill="#FFF6E2" stroke={C.ink} strokeWidth={2.5} />
        <text x={86} y={35} textAnchor="middle" fontSize={19} fontWeight={700} fill={C.ink}>30秒看完</text>
        {/* 桌面 */}
        <rect x={0} y={268} width={172} height={96} fill="#E8C79A" />
        <rect x={0} y={264} width={172} height={8} fill="#D9B285" />
        {/* 碗 */}
        <path d="M32 216 Q40 292 86 292 Q132 292 140 216 Z" fill={C.ramen} stroke={C.ink} strokeWidth={3} />
        <ellipse cx={86} cy={216} rx={54} ry={12} fill="#F4F0E4" stroke={C.ink} strokeWidth={3} />
        <ellipse cx={86} cy={216} rx={44} ry={8.5} fill="#E9B25C" />
        {/* 面条 */}
        <path d="M58 212 q8 -10 16 -2 q8 8 16 -2" stroke="#F7E7B4" strokeWidth={4} fill="none" strokeLinecap="round" />
        <path d="M70 210 q8 -10 16 -2 q8 8 16 -2" stroke="#F7E7B4" strokeWidth={4} fill="none" strokeLinecap="round" />
        {/* 蛋 */}
        <ellipse cx={64} cy={214} rx={13} ry={9} fill="#FFFDF4" stroke={C.ink} strokeWidth={2} />
        <ellipse cx={64} cy={214} rx={5} ry={3.6} fill={C.yellow} />
        {/* 海苔 */}
        <rect x={98} y={196} width={18} height={26} rx={3} fill="#2F3A52" transform="rotate(12 107 209)" />
        {/* 筷子 */}
        <rect x={112} y={150} width={5} height={80} rx={2.5} fill="#C89B5E" transform="rotate(14 114 190)" />
        <rect x={122} y={148} width={5} height={80} rx={2.5} fill="#C89B5E" transform="rotate(18 124 188)" />
        {/* 蒸汽 */}
        <g stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" fill="none" opacity={0.75}>
          <path d={`M60 190 q${steam(0)} -12 0 -22 q${-steam(0)} -12 0 -20`} />
          <path d={`M86 186 q${steam(1)} -12 0 -22 q${-steam(1)} -12 0 -20`} />
          <path d={`M108 190 q${steam(2)} -12 0 -22 q${-steam(2)} -12 0 -20`} />
        </g>
        {/* 馋嘴表情 */}
        <text x={86} y={330} textAnchor="middle" fontSize={26} fill={C.ink}>~ 呲溜 ~</text>
      </svg>
    </div>
  );
};

const Shiba = ({t}) => {
  const frame = useCurrentFrame();
  const heartY = 120 - ((frame * 0.6) % 60);
  return (
    <div style={{position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${C.shibaBg} 0%, #B9DCF0 100%)`}}>
      <svg width="100%" height="100%" viewBox="0 0 172 364">
        <circle cx={140} cy={44} r={16} fill="#FFF3B8" />
        <g transform="translate(96 44)">
          <path d="M0 8 C-6 -2, -14 -6, -12 4 C-10 12, -2 14, 0 8 Z" fill="#FFF3B8" />
        </g>
        {/* 柴犬身体 */}
        <ellipse cx={86} cy={286} rx={62} ry={44} fill={C.shiba} stroke={C.ink} strokeWidth={3} />
        <ellipse cx={86} cy={296} rx={34} ry={30} fill="#FFF6EA" />
        {/* 头 */}
        <circle cx={86} cy={190} r={58} fill={C.shiba} stroke={C.ink} strokeWidth={3} />
        <path d="M36 152 L26 108 L62 136 Z" fill={C.shiba} stroke={C.ink} strokeWidth={3} strokeLinejoin="round" />
        <path d="M136 152 L146 108 L110 136 Z" fill={C.shiba} stroke={C.ink} strokeWidth={3} strokeLinejoin="round" />
        <path d="M38 148 L33 122 L56 138 Z" fill="#F2A0A0" />
        <path d="M134 148 L139 122 L116 138 Z" fill="#F2A0A0" />
        {/* 脸 */}
        <ellipse cx={86} cy={206} rx={34} ry={28} fill="#FFF6EA" />
        <circle cx={66} cy={188} r={4.2} fill={C.ink} />
        <circle cx={106} cy={188} r={4.2} fill={C.ink} />
        <path d="M62 178 q5 -4 10 0" stroke={C.ink} strokeWidth={2.4} fill="none" strokeLinecap="round" />
        <path d="M100 178 q5 -4 10 0" stroke={C.ink} strokeWidth={2.4} fill="none" strokeLinecap="round" />
        <ellipse cx={86} cy={210} rx={6} ry={4.6} fill={C.ink} />
        <path d="M76 220 Q86 232 96 220" stroke={C.ink} strokeWidth={3} fill="none" strokeLinecap="round" />
        <ellipse cx={56} cy={214} rx={7} ry={4.6} fill="#F5A8A0" />
        <ellipse cx={116} cy={214} rx={7} ry={4.6} fill="#F5A8A0" />
        {/* 飘心 */}
        <g transform={`translate(0 ${heartY})`} opacity={0.9}>
          <path d="M86 150 c-4 -8 -16 -6 -16 4 c0 8 10 14 16 20 c6 -6 16 -12 16 -20 c0 -10 -12 -12 -16 -4z" fill="#F2555A" />
        </g>
      </svg>
    </div>
  );
};

const Disco = ({t}) => {
  const frame = useCurrentFrame();
  const angle = frame * 3;
  const bounce = Math.abs(Math.sin(frame * 0.32)) * 8;
  return (
    <div style={{position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${C.disco} 0%, #4E2E96 70%, #35206E 100%)`}}>
      <svg width="100%" height="100%" viewBox="0 0 172 364">
        {/* 旋转光束 */}
        {Array.from({length: 8}, (_, i) => (
          <rect key={i} x={84} y={44} width={4} height={230} fill="#C9A6FF" opacity={0.28}
            transform={`rotate(${angle + i * 45} 86 44)`} />
        ))}
        {/* 迪斯科球 */}
        <g transform="translate(86 44)">
          <circle r={20} fill="#241B4E" stroke="#8F7BD8" strokeWidth={2} />
          {Array.from({length: 12}, (_, i) => {
            const a = (i / 12) * Math.PI * 2 + frame * 0.05;
            return <rect key={i} x={Math.cos(a) * 14 - 3} y={Math.sin(a) * 14 - 3} width={6} height={6}
              fill={i % 2 ? '#FFFFFF' : '#8FE8FF'} opacity={0.55 + 0.45 * ((i + Math.floor(frame / 4)) % 3) / 2} />;
          })}
        </g>
        {/* 地面网格 */}
        <g stroke="#B08CFF" strokeWidth={1.4} opacity={0.7}>
          {[0, 1, 2, 3, 4].map((i) => (
            <line key={`h${i}`} x1={0} y1={318 + i * 10} x2={172} y2={318 + i * 10} />
          ))}
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <line key={`v${i}`} x1={i * 28.7} y1={318} x2={86 + (i * 28.7 - 86) * 2.4} y2={364} />
          ))}
        </g>
        {/* 蹦迪小狗 */}
        <g transform={`translate(86 ${248 - bounce})`}>
          <rect x={-30} y={-26} width={60} height={40} rx={17} fill={C.dog} stroke={C.ink} strokeWidth={3} />
          <rect x={-38} y={-46} width={15} height={24} rx={7} fill={C.dogDark} transform="rotate(-14 -30 -34)" />
          <rect x={23} y={-46} width={15} height={24} rx={7} fill={C.dogDark} transform="rotate(14 30 -34)" />
          <ellipse cx={0} cy={-12} rx={18} ry={13} fill="#FFF6EA" />
          <circle cx={-7} cy={-16} r={3} fill={C.ink} />
          <circle cx={7} cy={-16} r={3} fill={C.ink} />
          <path d="M-5 -7 Q0 -2 5 -7" stroke={C.ink} strokeWidth={2.2} fill="none" strokeLinecap="round" />
          <g transform={`rotate(${Math.sin(frame * 0.4) * 24})`}>
            <rect x={-46} y={-30} width={20} height={9} rx={4.5} fill={C.dog} stroke={C.ink} strokeWidth={2.5} />
          </g>
          <g transform={`rotate(${-Math.sin(frame * 0.4) * 24})`}>
            <rect x={26} y={-30} width={20} height={9} rx={4.5} fill={C.dog} stroke={C.ink} strokeWidth={2.5} />
          </g>
        </g>
        {/* 音符 */}
        {['♩', '♪', '♫'].map((n, i) => (
          <text key={i} x={[30, 140, 52][i]} y={[110 - (frame * 0.5 + i * 30) % 90, 150 - (frame * 0.4 + i * 20) % 100, 90 - (frame * 0.6 + i * 25) % 80][i]}
            fontSize={22} fill="#FFE28A" opacity={0.9}>{n}</text>
        ))}
      </svg>
    </div>
  );
};
