// src/utils/AudioManager.js

class AudioManager {
  constructor() {
    this.bgmAudio = new Audio();
    this.bgmAudio.loop = true;
    this.currentBgmKey = null;

    // 缓存音效对象，避免重复加载
    this.sfxCache = new Map();

    // 默认音量
    this.masterVolume = 1.0;
    this.bgmVolume = 0.5;
    this.sfxVolume = 1.0;

    // 资源路径映射 (你可以根据实际文件位置修改)
    this.basePath = '/audio/';
    this.resources = {
      bgm: {
        main_menu: 'bgm_menu.mp3',
        exploration: 'bgm_explore.mp3',
        battle: 'bgm_battle.mp3'
      },
      sfx: {
        click: 'ui_click.mp3',
        hover: 'ui_hover.mp3',
        equip: 'equip.mp3',
        error: 'error.mp3'
      }
    };
  }

  // 初始化设置
  setVolumes(master, bgm, sfx) {
    this.masterVolume = master;
    this.bgmVolume = bgm;
    this.sfxVolume = sfx;
    this.updateBgmVolume();
  }

  updateBgmVolume() {
    if (this.bgmAudio) {
      this.bgmAudio.volume = this.bgmVolume * this.masterVolume;
    }
  }

  // 播放背景音乐
  playBgm(key) {
    if (this.currentBgmKey === key) return; // 已经在播放同一首

    const fileName = this.resources.bgm[key];
    if (!fileName) {
      console.warn(`BGM key '${key}' not found.`);
      return;
    }

    // 简单的淡出效果 (可选)
    this.bgmAudio.pause();
    this.bgmAudio.src = this.basePath + fileName;
    this.bgmAudio.currentTime = 0;

    // 尝试播放 (需要用户交互后才能生效)
    const playPromise = this.bgmAudio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.currentBgmKey = key;
        })
        .catch(error => {
          console.log("Audio play prevented (waiting for interaction):", error);
        });
    }

    this.updateBgmVolume();
  }

  stopBgm() {
    this.bgmAudio.pause();
    this.bgmAudio.currentTime = 0;
    this.currentBgmKey = null;
  }

  // 播放音效 (Fire and forget)
  playSfx(key) {
    const fileName = this.resources.sfx[key];
    if (!fileName) return;

    // 每次创建新的 Audio 对象以支持重叠播放 (Polyphony)
    // 对于高频短音效这是可接受的，如果性能敏感可以改用对象池
    const audio = new Audio(this.basePath + fileName);
    audio.volume = this.sfxVolume * this.masterVolume;

    audio.play().catch(() => {
      // 忽略因未交互导致的播放失败
    });
  }
}

// 导出单例
export const audioManager = new AudioManager();

