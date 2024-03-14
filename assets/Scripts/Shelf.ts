import { _decorator, Component, Node, Vec2, Vec3 } from "cc";
import { Item } from "./Item";
const { ccclass, property } = _decorator;

const SLOT_POS = [
  new Vec3(0.2, 0, 0.1),
  new Vec3(0.5, 0, 0.1),
  new Vec3(0.8, 0, 0.1),
];

@ccclass("ShelfController")
export class Shelf extends Component {
  @property({ type: [Node] })
  public slots: Node[] = [null, null, null];

  private _hasItemSlot: boolean[] = [false, false, false];

  start() {
    // console.log(this.node.getWorldScale());
  }

  update(deltaTime: number) {}

  updateItemToShelf(index: number, item: Node | null) {
    console.log("updateItemToShelf", index, item);
    if (item !== null) {
      const slotItemPos = SLOT_POS[index];
      const itemComponent = item.getComponent(Item);
      const itemWorldPos = new Vec3(this.node.getPosition());
      Vec3.add(itemWorldPos, itemWorldPos, slotItemPos);

      console.log("itemWorldPos", itemWorldPos, slotItemPos);

      itemComponent.placeToPos(itemWorldPos, slotItemPos);
      this.node.addChild(item);
      this._hasItemSlot[index] = true;
      this.slots[index] = item;
    }
  }

  insertItem(index: number, item: Node | null) {
    if (item !== null) {
      const itemPos = SLOT_POS[index];
      item.setPosition(itemPos);
      this.node.addChild(item);
      this._hasItemSlot[index] = true;
      this.slots[index] = item;
    } else {
      this._hasItemSlot[index] = false;
      this.slots[index] = null;
    }
  }

  calcSlotIndex(hitPoint: Vec2) {
    const localPoint = new Vec2(this.node.position.x, this.node.position.y);
    Vec2.subtract(localPoint, hitPoint, localPoint);
    const localXPos = localPoint.x;
    let index = -1;

    if (localXPos > 0 && localXPos <= 0.333) {
      index = 0;
    } else if (localXPos > 0.33 && localXPos <= 0.666) {
      index = 1;
    } else {
      index = 2;
    }

    if (this._hasItemSlot[index]) {
      return -1;
    }
    return index;
  }

  removeItem(item: Node, index: number) {
    this._hasItemSlot[index] = false;
    this.node.removeChild(item);
    // item.removeFromParent();
  }

  checkWinCondition() {
    if (this._hasItemSlot.every((slot) => slot === true)) {
      let flag = true;
      this.slots.forEach((slot) => {
        if (slot && slot.name !== this.slots[0].name) {
          flag = false;
        }
      });

      return flag;
    }

    return false;
  }

  close() {
    console.log("animation shelf close");
  }
}
