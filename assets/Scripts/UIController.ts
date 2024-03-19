import { _decorator, Component, Node, Tween, tween, Vec3 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("UIController")
export class UIController extends Component {
  @property(Node)
  public callToPlay: Node = null!;

  @property(Node)
  public introBG: Node = null!;

  @property(Node)
  public introLabel: Node = null!;

  private _mute = false;

  start() {
    this.playIntro();
  }

  playIntro() {
    this.callToPlay.active = false;
    this.introBG.active = true;

    tween(this.introLabel)
      .tag(12)
      .to(0.3, { scale: new Vec3(1.1, 1.1, 1.1) })
      .to(0.3, { scale: new Vec3(1, 1, 1) })
      .union()
      .repeatForever()
      .start();
  }

  stopIntro() {
    Tween.stopAllByTag(12);
    this.introBG.active = false;
    this.introLabel.active = false;
    this.callToPlay.active = true;
  }

  update(deltaTime: number) {}

  spawnCTP() {
    if (!this.callToPlay.active) {
      this.callToPlay.active = true;
    }
  }

  removeCTP() {
    if (this.callToPlay.active) {
      this.callToPlay.active = false;
    }
  }

  onMute() {
    // @ts-ignore
    if (typeof onMute !== "undefined") onMute();
  }
}
