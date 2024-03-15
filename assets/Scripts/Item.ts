import { _decorator, Component, Node, tween, Vec2, Vec3 } from "cc";
const { ccclass, property } = _decorator;

const SCREEN_WIDTH = 414;
const SCREEN_HEIGHT = 896;

@ccclass("Item")
export class Item extends Component {
  protected onLoad(): void {
    this.node.on("picked", this.onPickedUp, this);
    this.node.on("release", this.onRelease, this);
    this.node.on("drag", this.onDrag, this);
  }

  private _originPos: Vec3 = new Vec3();
  private _pickUpVector: Vec3 = new Vec3();

  start() {
    this._originPos = this.node.getPosition();
    this._pickUpVector = new Vec3(0, 0, 0.5);
  }

  update(deltaTime: number) {}

  onPickedUp() {
    const pickingUpPos = new Vec3();
    Vec3.add(pickingUpPos, this.node.position, this._pickUpVector);

    tween(this.node).to(0.05, { position: pickingUpPos }).start();
  }

  onRelease() {
    console.log("on release");
    const pickUpPos = new Vec3();
    Vec3.add(pickUpPos, this._originPos, this._pickUpVector);

    tween(this.node)
      .to(0.2, { position: pickUpPos })
      .to(0.2, { position: this._originPos })
      .union()
      .start();
  }

  onDrag(newPos: Vec3) {
    Vec3.add(newPos, newPos, this._pickUpVector);

    this.node.setWorldPosition(newPos);
  }

  placeToPos(worldPos: Vec3, slotItemPos: Vec3) {
    this._originPos = new Vec3(slotItemPos);

    // this.node.setWorldPosition(worldPos);
    tween(this.node)
      .to(
        0.1,
        { worldPosition: worldPos },
        {
          onComplete: () => {
            this.node.setPosition(slotItemPos);
          },
        }
      )
      .union()
      .start();
  }
}
