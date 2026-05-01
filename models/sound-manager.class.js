class SoundManager {
  muted;
  constructor() {
    this.sounds = {
      coin: new Audio("audio/coin_collected.mp3"),
      bottle: new Audio("audio/Glass_bottle_pickup.mp3"),
      bottleSplash: new Audio("audio/splash_sound.mp3"),
      hit: new Audio("audio/hit_sound.mp3"),
      hitChicken: new Audio("audio/hit_normal_chicken_sound.mp3"),
      hitEndboss: new Audio("audio/hit_endboss_sound.mp3"),
      backgroundMusic: new Audio("audio/El_Pollo_Loco_background_level1.mp3"),
      endbossBackgroundMusic: new Audio("audio/endboss_fight_bg_music.mp3"),
      afterEndbossMusic: new Audio("audio/after_endboss_music.mp3"),
      buy: new Audio("audio/buy_sound.mp3"),
      gameOver: new Audio("audio/game_over_sound.mp3"),
      win: new Audio("audio/you_win_sound.mp3"),
      footstep: new Audio("audio/footsteps_sound.mp3"),
    };
    this.currentBackgroundTrack = null;
    this.masterVolume = 0.6;
    this.volumes = {
      coin: 0.35,
      bottle: 0.4,
      bottleSplash: 0.45,
      hit: 0.4,
      hitChicken: 0.45,
      hitEndboss: 0.55,
      backgroundMusic: 0.2,
      endbossBackgroundMusic: 0.24,
      afterEndbossMusic: 0.22,
      buy: 0.35,
      gameOver: 0.6,
      win: 0.6,
      footstep: 0.15,
    };

    this.applyVolumes();
    this.loadVolumeMuteState();
  }

  saveVolumeMuteState() {
    localStorage.setItem("muted", this.muted);
  }

  loadVolumeMuteState() {
    try {
      const muted = localStorage.getItem("muted");
      this.muted = muted === "true";
      if (this.muted) {
        this.muteAll();
      } else {
        this.unmuteAll();
      }
    } catch (e) {
      console.error("Error loading volume mute state:", e);
    }
  }

  applyVolumes() {
    Object.keys(this.sounds).forEach((key) => {
      const singleVolume = this.volumes[key] ?? 1;
      this.sounds[key].volume = Math.min(
        1,
        Math.max(0, singleVolume * this.masterVolume),
      );
    });
  }

  setMasterVolume(value) {
    this.masterVolume = Math.min(1, Math.max(0, value));
    this.applyVolumes();
  }

  play(sound) {
    if (this.sounds[sound]) {
      this.sounds[sound].currentTime = 0;
      this.sounds[sound].play();
    }
  }

  playBackgroundMusic() {
    this.playBackgroundTrack("backgroundMusic");
  }

  playEndbossBackgroundMusic() {
    this.playBackgroundTrack("endbossBackgroundMusic");
  }

  playAfterEndbossMusic() {
    this.playBackgroundTrack("afterEndbossMusic");
  }

  playBackgroundTrack(trackName) {
    const track = this.sounds[trackName];
    if (!track || this.currentBackgroundTrack === trackName) return;
    if (this.currentBackgroundTrack) this.stop(this.currentBackgroundTrack);
    track.loop = true;
    track.currentTime = 0;
    track.play();
    this.currentBackgroundTrack = trackName;
  }

  muteAll() {
    this.muted = true;
    Object.values(this.sounds).forEach((audio) => {
      audio.muted = true;
    });
    this.saveVolumeMuteState();
  }

  unmuteAll() {
    this.muted = false;
    Object.values(this.sounds).forEach((audio) => {
      audio.muted = false;
    });
    this.saveVolumeMuteState();
  }

  stop(sound) {
    if (this.sounds[sound]) {
      this.sounds[sound].pause();
      this.sounds[sound].currentTime = 0;
    }
  }

  stopAll() {
    Object.values(this.sounds).forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
    this.currentBackgroundTrack = null;
  }
}
