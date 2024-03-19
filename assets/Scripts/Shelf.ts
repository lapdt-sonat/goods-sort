import { _decorator, Component, Node, Vec2, Vec3, Animation } from "cc";
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

  // @property({ type: Node })
  // public door: Node | null = null;

  private _closed: boolean = false;

  private _hasItemSlot: boolean[] = [false, false, false];

  start() {
    // this.door.active = false;
  }

  update(deltaTime: number) {}

  updateItemToShelf(index: number, item: Node | null) {
    if (item !== null) {
      const slotItemPos = SLOT_POS[index];
      const itemComponent = item.getComponent(Item);
      const itemWorldPos = new Vec3(this.node.getPosition());
      Vec3.add(itemWorldPos, itemWorldPos, slotItemPos);

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

  calcEndSlotIndex(hitPoint: Vec2) {
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

  calcStartSlotIndex(hitPoint: Vec2) {
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

    return index;
  }

  removeItem(item: Node, index: number) {
    this._hasItemSlot[index] = false;
    this.slots[index] = null;
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
    // this.door.active = true;
    // const animation = this.node.getComponent(Animation);
    // animation.play("close-shelf");
    this._closed = true;
    // console.log("animation shelf close");
  }

  isClosed() {
    return this._closed;
  }

  isGoodTarget(): boolean {
    let checker = true;

    checker = !this._closed;

    const numberOfItemInShelf = this._hasItemSlot.filter((slot) => slot).length;
    if (numberOfItemInShelf !== 2) {
      checker = false;
    }

    const items = this.slots.filter((slot) => slot !== null);
    if (items.length !== 2) {
      checker = false;
    } else {
      checker = items[0].name === items[1].name;
    }

    return checker;
  }

  getRepresentItem() {
    return this.slots.find((slot) => slot);
  }

  getWorldBlankSpot() {
    const worldBlankSpot = new Vec3(0, 0, 0);
    Vec3.add(
      worldBlankSpot,
      this.node.worldPosition,
      SLOT_POS[this._hasItemSlot.indexOf(false)]
    );

    return worldBlankSpot;
  }

  checkRepresentItem(name: string) {
    if (this._closed) {
      return { hasItem: false, itemWorldPos: new Vec3() };
    }

    const item = this.slots.find((slot) => {
      return slot?.name === name;
    });

    if (item) {
      const itemWorldPos = new Vec3(item.worldPosition);
      return { hasItem: true, itemWorldPos };
    }

    return { hasItem: false, itemWorldPos: new Vec3() };
  }

  removeAll() {
    this.slots.forEach((slot, index) => {
      if (slot) {
        slot.getComponent(Animation).play("teddy-win");
        // @ts-ignore
        slot.getComponent(Animation).on("finished", () => {
          this.removeItem(slot, index);
          slot.removeFromParent();
        });
      }
    });
  }
}
