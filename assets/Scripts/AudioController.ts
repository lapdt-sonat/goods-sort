import { _decorator, AudioSource, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("AudioController")
export class AudioController extends Component {
  @property({ type: AudioSource })
  public pickSfx: AudioSource = null!;

  @property(AudioSource)
  public placeSfx: AudioSource = null!;

  @property({ type: AudioSource })
  public soldOutSfx: AudioSource = null!;

  @property({ type: AudioSource })
  public winSfx: AudioSource = null!;

  start() {
    this.pickSfx.volume = 1;
  }

  update(deltaTime: number) {
    this.pickSfx.pause();
  }

  public playPickSfx() {
    //@ts-ignore
    const volume = window.gameVolume ? window.gameVolume : 1;
    this.pickSfx.playOneShot(this.pickSfx.clip, volume);
  }

  public playPlaceSfx() {
    //@ts-ignore
    const volume = window.gameVolume ? window.gameVolume : 1;
    this.placeSfx.playOneShot(this.placeSfx.clip, volume);
  }

  public playSoldOutSfx() {
    //@ts-ignore
    const volume = window.gameVolume ? window.gameVolume : 1;

    this.soldOutSfx.playOneShot(this.soldOutSfx.clip, volume);
  }

  public playWinSfx() {
    //@ts-ignore
    const volume = window.gameVolume ? window.gameVolume : 1;

    this.winSfx.playOneShot(this.winSfx.clip, volume);
  }
}
