// 全局主题：配色取自原视频「小克剪辑」手绘风格
export const C = {
  page: '#E7DDC6',
  windowBg: '#F8F3E6',
  panelBg: '#FDFAF1',
  ink: '#3A3129',
  inkSoft: '#8A7E6B',
  line: '#E2D8BF',
  dog: '#E8613C',
  dogDark: '#C74E2C',
  red: '#E14B4B',
  teal: '#3FA98F',
  purple: '#8A5CF6',
  yellow: '#FFD24D',
  blue: '#4E8CFF',
  green: '#4CAF6D',
  sliderFill: '#F08A3C',
  night1: '#161E42',
  night2: '#2B3772',
  moon: '#FFE28A',
  ramen: '#E2574C',
  shibaBg: '#CFE6F5',
  shiba: '#E8B84B',
  disco: '#7B4FD0',
};

export const FONT =
  'YouYuan, 幼圆, "Microsoft YaHei", "Comic Sans MS", sans-serif';

// 布局常量（1280x720 画布）
export const L = {
  winX: 36,
  winY: 24,
  winW: 1208,
  winH: 672,
  titleH: 56,
  panelX: 52,
  panelY: 96,
  panelW: 204,
  panelH: 452,
  phoneX: 508,
  phoneY: 100,
  phoneW: 196,
  phoneH: 372,
  rightX: 1004,
  rightY: 96,
  rightW: 224,
  rightH: 452,
  trackX0: 56,
  trackX1: 1224,
  trackW: 1168,
  rulerY: 554,
  rulerH: 30,
  videoTrackY: 590,
  videoTrackH: 58,
  textTrackY: 652,
  textTrackH: 26,
  audioTrackY: 682,
  audioTrackH: 22,
};

export const PX_PER_SEC = L.trackW / 30; // 38.93

export const timeToX = (t) => L.trackX0 + t * PX_PER_SEC;
