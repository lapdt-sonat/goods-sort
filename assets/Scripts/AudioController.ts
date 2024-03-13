import { _decorator, AudioSource, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("AudioController")
export class AudioController extends Component {
  @property({ type: AudioSource })
  public pickSfx: AudioSource = null!;

  @property({ type: AudioSource })
  public soldOutSfx: AudioSource = null!;

  start() {}

  update(deltaTime: number) {}

  public playPickSfx() {
    this.pickSfx.play();
  }

  public playSoldOutSfx() {
    this.soldOutSfx.play();
  }
}
