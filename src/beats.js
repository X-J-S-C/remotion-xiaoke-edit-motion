// 全片节拍表（单位：秒）。参考原视频 30s/30fps 逐帧比对得出。
export const B = {
  // 开机
  bootIn: 0.0,
  bootDone: 1.15,
  appIn: 1.35,
  // 素材面板 / 拖拽吃面.mp4
  tabMaterial: [1.35, 5.2],
  tabTransition: [5.2, 7.4],
  tabText: [7.4, 9.8],
  dragIn: 2.7, // 手型光标抓住
  dragOut: 3.5, // 吃面.mp4 落进轨道
  // 文字预设「前方高能」
  presetClick: 7.55,
  textClipIn: 7.85,
  qianfang: [8.2, 11.8],
  // 字幕轨道聚犬.mp4
  clipJuquan: 8.0,
  // 调整面板（右侧）：逐条拉满
  flash: [10.4, 11.4],
  sat: [11.4, 12.8],
  zoom: [12.8, 13.8],
  speed: [15.4, 16.0],
  speedBack: [17.4, 18.2],
  // 手写红字标注
  satLabel: [12.8, 15.3],
  speedLabel: [15.6, 18.0],
  // 修好了 / Ctrl+Z / 已修好
  fix: [14.1, 15.2],
  // 10倍速 & BONK
  x10: [16.4, 18.6],
  bonk: [21.2, 22.3],
  discoClip: 21.6,
  // 稳了
  wen: [24.8, 26.2],
  // 收尾
  note: [26.0, 26.6],
  confetti: [26.8, 30.0],
  like: [27.4, 27.9],
  comment: [27.9, 28.3],
  share: [28.3, 28.7],
  doneBtn: 28.6,
};

// 电视画面分段：[起, 止, 场景]
export const PHONE_SCENES = [
  [1.35, 4.2, 'night'],
  [4.2, 5.2, 'ramen'],
  [5.2, 7.9, 'night'],
  [7.9, 8.6, 'ramen'], // 转场闪切
  [8.6, 11.5, 'shiba'],
  [11.5, 21.5, 'night'],
  [21.5, 26.6, 'disco'],
  [26.6, 30.0, 'disco'],
];

// 狗勾站位 x（秒 -> 位置）
export const DOG_PATH = [
  [1.3, 300, 592],
  [3.6, 420, 592],
  [8.9, 640, 592],
  [12.9, 700, 470],
  [15.6, 820, 470],
  [21.2, 590, 260],
  [22.4, 880, 556],
  [26.0, 1080, 592],
  [30.0, 1080, 592],
];

// 语音气泡 [文字, 起, 止]
export const BUBBLES = [
  ['开工!', 1.5, 3.2],
  ['赚到了!', 8.9, 10.4],
  ['修好了!', 14.1, 15.2],
  ['稳了!', 24.8, 26.2],
  ['拿捏了!', 26.8, 30.0],
];

export const CLIPS = [
  { name: '夜景.mp4', t0: 0, t1: 3.5, scene: 'night', inAt: 0 },
  { name: '吃面.mp4', t0: 3.5, t1: 7.0, scene: 'ramen', inAt: 3.5 },
  { name: '聚犬.mp4', t0: 7.0, t1: 11.0, scene: 'shiba', inAt: 8.0 },
  { name: '小克蹦迪.mp4', t0: 11.0, t1: 30.0, scene: 'disco', inAt: 21.6 },
];

export const MATERIALS = [
  { name: '夜景.mp4', scene: 'night' },
  { name: '吃面.mp4', scene: 'ramen' },
  { name: '长大10倍', scene: 'shiba' },
  { name: '小克素材', scene: 'disco' },
];

export const TRANSITIONS = ['闪黑', '闪白', '空心入网', '爱心', '圆形', '撕纸'];

export const TEXT_PRESETS = ['前方高能', '好耶～', '霓虹 NEON'];

export const SLIDERS = [
  { key: 'flash', label: '闪光', max: '100%' },
  { key: 'sat', label: '饱和度', max: '150%' },
  { key: 'zoom', label: '缩放冲击', max: '100%' },
  { key: 'speed', label: '速度', max: '2.0x' },
];
