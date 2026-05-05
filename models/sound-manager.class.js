/**
 * Manages all game audio: playback, volume, muting, and background music switching.
 */
class SoundManager {
  muted;
  /**
   * Initialises all Audio instances, sets per-track volumes, and restores the saved mute state.
   */
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

  /**
   * Persists the current mute state to localStorage.
   */
  saveVolumeMuteState() {
    localStorage.setItem("muted", this.muted);
  }

  /**
   * Reads the mute state from localStorage and applies it.
   */
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

  /**
   * Applies per-track volumes scaled by the master volume to all sound instances.
   */
  applyVolumes() {
    Object.keys(this.sounds).forEach((key) => {
      const singleVolume = this.volumes[key] ?? 1;
      this.sounds[key].volume = Math.min(
        1,
        Math.max(0, singleVolume * this.masterVolume),
      );
    });
  }

  /**
   * Sets the master volume and reapplies all individual track volumes.
   *
   * @param {number} value - Master volume between 0 and 1.
   */
  setMasterVolume(value) {
    this.masterVolume = Math.min(1, Math.max(0, value));
    this.applyVolumes();
  }

  /**
   * Plays a sound effect from the beginning.
   *
   * @param {string} sound - The key of the sound to play (e.g. 'coin', 'hit').
   */
  play(sound) {
    if (this.sounds[sound]) {
      const audio = this.sounds[sound];
      audio.currentTime = 0;
      audio._playPromise = audio.play().catch(() => {});
    }
  }

  /**
   * Starts the main level background music if not already playing.
   */
  playBackgroundMusic() {
    this.playBackgroundTrack("backgroundMusic");
  }

  /**
   * Switches to the endboss fight music if not already playing.
   */
  playEndbossBackgroundMusic() {
    this.playBackgroundTrack("endbossBackgroundMusic");
  }

  /**
   * Switches to the post-endboss victory music if not already playing.
   */
  playAfterEndbossMusic() {
    this.playBackgroundTrack("afterEndbossMusic");
  }

  /**
   * Switches the looping background music to the specified track.
   * Stops the current track before starting the new one.
   *
   * @param {string} trackName - The key of the background track to play.
   */
  playBackgroundTrack(trackName) {
    const track = this.sounds[trackName];
    if (!track || this.currentBackgroundTrack === trackName) return;
    if (this.currentBackgroundTrack) this.stop(this.currentBackgroundTrack);
    track.loop = true;
    track.currentTime = 0;
    track._playPromise = track.play().catch(() => {});
    this.currentBackgroundTrack = trackName;
  }

  /**
   * Mutes all sounds and saves the mute state.
   */
  muteAll() {
    this.muted = true;
    Object.values(this.sounds).forEach((audio) => {
      audio.muted = true;
    });
    this.saveVolumeMuteState();
  }

  /**
   * Unmutes all sounds and saves the mute state.
   */
  unmuteAll() {
    this.muted = false;
    Object.values(this.sounds).forEach((audio) => {
      audio.muted = false;
    });
    this.saveVolumeMuteState();
  }

  /**
   * Pauses a sound and resets it to the beginning.
   *
   * @param {string} sound - The key of the sound to stop.
   */
  async stop(sound) {
    if (this.sounds[sound]) {
      const audio = this.sounds[sound];
      try {
        await audio._playPromise;
        audio.pause();
        audio.currentTime = 0;
        audio._playPromise = null;
      } catch {}
    }
  }

  /**
   * Pauses and resets all sounds and clears the current background track reference.
   */
  async stopAll() {
    const stops = Object.values(this.sounds).map(async (audio) => {
      try {
        await audio._playPromise;
        audio.pause();
        audio.currentTime = 0;
        audio._playPromise = null;
      } catch {}
    });
    await Promise.all(stops);
    this.currentBackgroundTrack = null;
  }
}
