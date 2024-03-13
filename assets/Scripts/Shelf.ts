import { _decorator, Component, Node, Vec3 } from "cc";
const { ccclass, property } = _decorator;

const _slotsPos = [
  new Vec3(0.2, 0, 0.1),
  new Vec3(0.5, 0, 0.1),
  new Vec3(0.8, 0, 0.1),
];

@ccclass("ShelfController")
export class Shelf extends Component {
  @property({ type: [Node] })
  public slots: Node[] = [];

  private _itemSlots: boolean[] = [false, false, false];

  start() {
    console.log(this.node.getWorldScale());
  }

  update(deltaTime: number) {}

  insertItem(index: number, item: Node | null) {
    if (item !== null) {
      this._itemSlots[index] = true;
    } else {
      this._itemSlots[index] = false;
      this.slots[index] = null;
    }
  }

  removeItem(item: Node) {}
}
