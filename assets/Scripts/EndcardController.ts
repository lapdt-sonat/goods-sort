import { _decorator, Component, Input, Node, tween, Vec3 } from "cc";
import playableHelper from "./helper/playable";
const { ccclass, property } = _decorator;

@ccclass("EndcardController")
export class EndcardController extends Component {
  @property(Node)
  public ctaButton: Node = null!;

  start() {
    this.node.scale = new Vec3(0, 0, 0);
    this.ctaButton.on(Input.EventType.TOUCH_START, this.redirectToStore, this);
  }

  update(deltaTime: number) {}

  redirectToStore(event: TouchEvent) {
    playableHelper.redirect();
  }

  showEndcard() {
    tween(this.node)
      .to(1, { scale: new Vec3(1, 1, 1) }, { easing: "backOut" })
      .start();
  }
}
