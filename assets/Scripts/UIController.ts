import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("UIController")
export class UIController extends Component {
  @property(Node)
  public callToPlay: Node = null!;

  @property(Node)
  public tutHand: Node = null!;

  start() {}

  update(deltaTime: number) {}

  removeCTP() {
    if (this.callToPlay.active) {
      this.callToPlay.active = false;
    }
  }
}
