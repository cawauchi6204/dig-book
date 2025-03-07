/**
 * 効果音を生成・再生するためのユーティリティ関数
 */

// AudioContextのインスタンスを保持
let audioContext: AudioContext | null = null;

// AudioContextを初期化する関数
const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    // TypeScriptの型定義のため、window.AudioContextが存在しない場合の代替処理
    const AudioContextClass = window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioContext = new AudioContextClass();
  }
  return audioContext;
};

/**
 * スワイプ右（Like）の効果音を再生
 */
export const playLikeSound = (): void => {
  const context = getAudioContext();
  
  // オシレーターを作成
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();
  
  // 音量設定
  gainNode.gain.value = 0.1;
  
  // オシレーターの設定（明るい音）
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(880, context.currentTime); // A5
  oscillator.frequency.exponentialRampToValueAtTime(1760, context.currentTime + 0.1); // A6
  
  // 接続
  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  
  // 再生
  oscillator.start();
  
  // 0.15秒後に停止
  oscillator.stop(context.currentTime + 0.15);
};

/**
 * スワイプ左（Nope）の効果音を再生
 */
export const playNopeSound = (): void => {
  const context = getAudioContext();
  
  // オシレーターを作成
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();
  
  // 音量設定
  gainNode.gain.value = 0.1;
  
  // オシレーターの設定（軽い音）
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(440, context.currentTime); // A4
  oscillator.frequency.exponentialRampToValueAtTime(220, context.currentTime + 0.1); // A3
  
  // 接続
  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  
  // 再生
  oscillator.start();
  
  // 0.15秒後に停止
  oscillator.stop(context.currentTime + 0.15);
};

/**
 * スワイプ方向に応じた効果音を再生
 * @param direction スワイプ方向 ('right' または 'left')
 */
export const playSwipeSound = (direction: string): void => {
  if (direction === 'right') {
    playLikeSound();
  } else if (direction === 'left') {
    playNopeSound();
  }
};
