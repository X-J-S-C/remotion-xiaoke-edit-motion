// 纯 JS 合成 30s BGM + 音效 → public/bgm.wav（120 BPM，无外部依赖）
import {mkdirSync, writeFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const SR = 44100;
const DUR = 30;
const N = SR * DUR;
const left = new Float32Array(N);
const right = new Float32Array(N);

let noiseSeed = 42;
const noise = () => {
  noiseSeed = (noiseSeed * 1103515245 + 12345) & 0x7fffffff;
  return (noiseSeed / 0x3fffffff) - 1;
};

const add = (t, len, fn) => {
  const start = Math.floor(t * SR);
  const count = Math.floor(len * SR);
  for (let i = 0; i < count; i++) {
    const idx = start + i;
    if (idx >= N) break;
    const k = i / count;
    const [l, r] = fn(k, i / SR);
    left[idx] += l;
    right[idx] += r;
  }
};

const tone = (freq, k, t, decay, pan = 0.5) => {
  const env = Math.exp(-t * decay);
  return [toneVal(freq, t) * env * (1 - pan), toneVal(freq, t) * env * pan];
};
const toneVal = (f, t) => Math.sin(2 * Math.PI * f * t);
const square = (f, t) => (Math.sin(2 * Math.PI * f * t) >= 0 ? 1 : -1) * 0.6;
const tri = (f, t) => 2 * Math.abs(2 * (t * f - Math.floor(t * f + 0.75))) - 1;

// ---- 鼓组 ----
const kick = (t, amp = 0.85) => add(t, 0.16, (k, tt) => {
  const f = 130 * Math.exp(-tt * 22) + 44;
  const env = Math.exp(-tt * 26);
  const v = toneVal(f, tt) * env * amp;
  return [v, v];
});
const clap = (t, amp = 0.32) => add(t, 0.1, (k, tt) => {
  const env = Math.exp(-tt * 46);
  const bp = Math.sin(2 * Math.PI * 1600 * tt) * 0.6 + noise() * 0.5;
  const v = bp * env * amp;
  return [v * 0.55, v * 0.45];
});
const hat = (t, amp = 0.05) => add(t, 0.035, (k, tt) => {
  const env = Math.exp(-tt * 160);
  const v = (noise() * 0.6 + toneVal(8200, tt) * 0.4) * env * amp;
  return [v, v];
});

// ---- 音乐 ----
const bassSeq = [110, 110, 164.81, 110, 98, 98, 146.83, 98]; // 一小节 8 个八分音符
const meloSeq = [523.25, 0, 659.25, 783.99, 0, 659.25, 587.33, 0, 440, 0, 523.25, 587.33, 659.25, 0, 587.33, 0];
const BPM = 120;
const BEAT = 60 / BPM; // 0.5s
const half = BEAT / 2; // 0.25s（八分音符）

for (let bar = 0; bar < 15; bar++) {
  const barT = bar * BEAT * 4;
  const quiet = bar === 0; // 第 1 小节渐入
  const full = bar >= 1 ? 1 : 0.35;

  // 底鼓踩镲
  for (let b = 0; b < 8; b++) {
    const t = barT + b * half;
    if (b % 2 === 0) kick(t, b % 4 === 0 ? 0.85 * full : 0.5 * full);
    if (b % 4 === 2) clap(t, 0.3 * full);
    hat(t, (b % 2 === 1 ? 0.075 : 0.04) * full);
  }
  // 贝斯（弹跳八分）
  bassSeq.forEach((f, i) => {
    if (!f) return;
    const t = barT + i * half;
    add(t, half * 0.9, (k, tt) => {
      const env = Math.exp(-tt * 9) * 0.34 * full;
      const v = (square(f, tt) * 0.7 + toneVal(f, tt) * 0.3) * env;
      return [v * 0.6, v * 0.4];
    });
  });
  // 八音盒旋律（后半程 + 齐整拍）
  if (bar >= 2) {
    meloSeq.forEach((f, i) => {
      if (!f) return;
      const t = barT + i * half;
      add(t, half * 2.4, (k, tt) => {
        const env = Math.exp(-tt * 5.2) * 0.16;
        const v = tri(f, tt) * env * (bar >= 6 ? 1 : 0.7);
        return [v, v];
      });
    });
  }
}

// ---- 音效 ----
// BONK!（21.4s）：低频重击 + 金属感
add(21.4, 0.5, (k, tt) => {
  const f = 90 * Math.exp(-tt * 12) + 40;
  const env = Math.exp(-tt * 8) * 0.95;
  const metal = toneVal(2100, tt) * Math.exp(-tt * 30) * 0.25;
  const v = (toneVal(f, tt) * env + metal) * 1.0;
  return [v, v];
});
// 收工撒花（26.8s）：上行琶音 ta-da
[440, 554.37, 659.25, 880].forEach((f, i) => {
  add(26.9 + i * 0.09, 0.5, (k, tt) => {
    const env = Math.exp(-tt * 4.5) * 0.2;
    const v = tri(f, tt) * env + toneVal(f * 2, tt) * env * 0.3;
    return [v * 0.55, v * 0.45];
  });
});
// 点赞「叮」（27.5s / 28.0s）
[28.0, 28.9].forEach((t0, i) => {
  add(t0, 0.18, (k, tt) => {
    const f = i ? 1318.5 : 1568;
    const env = Math.exp(-tt * 14) * 0.16;
    const v = toneVal(f, tt) * env * (i ? 0.5 : 0.8);
    return [v, v];
  });
});

// ---- 归一化 + 写 WAV ----
const bytes = Buffer.alloc(44 + N * 4);
bytes.write('RIFF', 0);
bytes.writeUInt32LE(36 + N * 4, 4);
bytes.write('WAVE', 8);
bytes.write('fmt ', 12);
bytes.writeUInt32LE(16, 16);
bytes.writeUInt16LE(1, 20); // PCM
bytes.writeUInt16LE(2, 22); // stereo
bytes.writeUInt32LE(SR, 24);
bytes.writeUInt32LE(SR * 4, 28);
bytes.writeUInt16LE(4, 32);
bytes.writeUInt16LE(16, 34);
bytes.write('data', 36);
bytes.writeUInt32LE(N * 4, 40);

let peak = 0;
for (let i = 0; i < N; i++) {
  peak = Math.max(peak, Math.abs(left[i]), Math.abs(right[i]));
}
const g = 0.89 / (peak || 1);
for (let i = 0; i < N; i++) {
  const l = Math.max(-1, Math.min(1, left[i] * g));
  const r = Math.max(-1, Math.min(1, right[i] * g));
  bytes.writeInt16LE(Math.round(l * 32767), 44 + i * 4);
  bytes.writeInt16LE(Math.round(r * 32767), 44 + i * 4 + 2);
}

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, '..', 'public', 'bgm.wav');
mkdirSync(dirname(out), {recursive: true});
writeFileSync(out, bytes);
console.log('written', out, (bytes.length / 1024 / 1024).toFixed(2), 'MB');
