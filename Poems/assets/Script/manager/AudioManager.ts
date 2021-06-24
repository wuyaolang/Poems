export default class AudioManager {

  public _musicName: string = "";

  public audioClips;

  constructor() {
    this.audioClips = {};
  }

  playLocalMusic(name, volume) {
    this._musicName = name;
    cc.audioEngine.playMusic(this.audioClips[name], true);
    cc.audioEngine.setMusicVolume(volume);
  }

  stopLocalMusic() {
    cc.audioEngine.setMusicVolume(0);
  }

  playCloudSound(url, callback) {
    cc.loader.load(url, function (err, audio) {
      if (audio) {
        cc.audioEngine.playEffect(audio, false);
        if (callback) {
          callback();
        }
      }
    });
  }

  pauseMusic() {
    cc.audioEngine.pauseMusic();
  }

  resumeMusic() {
    cc.audioEngine.resumeMusic();
  }

  setMusicVolume(volume) {
    cc.audioEngine.setMusicVolume(volume);
  }

  playEffect(name, volume = 1) {
    cc.audioEngine.playEffect(this.audioClips[name], false);
    cc.audioEngine.setEffectsVolume(volume);
  }

  setEffectVolume(volume) {
    cc.audioEngine.setEffectsVolume(volume);
  }
}
