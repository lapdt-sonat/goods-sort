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
    // const dragEndpoint = new Vec3(
    //   (pointer.x / SCREEN_WIDTH) * 5,
    //   (pointer.y / SCREEN_HEIGHT) * 12,
    //   this.node.position.z
    // );

    // Vec3.subtract(dragEndpoint, dragEndpoint, new Vec3(2.5, 6, 0));

    this.node.setWorldPosition(newPos);

    // tween(this.node).to(0.1, { worldPosition: dragEndpoint }).start();
  }

  placeToPos(worldPos: Vec3, slotItemPos: Vec3) {
    const upPos = new Vec3(worldPos);
    // Vec3.add(upPos, worldPos, this._pickUpVector);
    this.node.setPosition(slotItemPos);

    // this.node.setWorldPosition(worldPos);
    // tween(this.node)
    //   .to(0.2, { worldPosition: upPos })
    //   .to(0.2, { worldPosition: worldPos })
    //   .union()
    //   .start();
  }
}
