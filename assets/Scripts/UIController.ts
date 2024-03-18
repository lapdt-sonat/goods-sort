import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("UIController")
export class UIController extends Component {
  @property(Node)
  public callToPlay: Node = null!;

  private _mute = false;

  start() {}

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
