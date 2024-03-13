import { _decorator, Component, instantiate, Node, Prefab, Vec3 } from "cc";
import { Shelf } from "./Shelf";
import { ItemsPool } from "./ItemsPool";
const { ccclass, property } = _decorator;

type ShelfData = { index: number; slots: string[]; spawn: boolean };

const SHELF_HEIGHT = 0.75;
const SHELF_WIDTH = 1;

@ccclass("ShelfGroupController")
export class ShelfGroup extends Component {
  @property(Prefab)
  public shelfPrefab: Prefab = null!;

  @property({ type: ItemsPool })
  public itemsPool: ItemsPool = null!;

  private _shelfGroup: Node[] = [];
  private _originVector: Vec3 = new Vec3();

  start() {}

  update(deltaTime: number) {}

  initShelfGroup(map: string) {
    const mapObj = JSON.parse(map);

    const { width, height, shelves } = mapObj;
    this.calculateOriginVector(width, height);

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        const shelfData: ShelfData = shelves[i + j];
        if (shelfData.spawn) {
          const newShelf = this.spawnShelf(shelfData, i, j);
          this._shelfGroup.push(newShelf);
        }
      }
    }
  }

  spawnShelf(shelfData: ShelfData, x: number, y: number): Node {
    const shelf: Node = instantiate(this.shelfPrefab);
    const shelfPosition = new Vec3(x * SHELF_WIDTH, y * SHELF_HEIGHT);

    console.log("spawn shelf", shelfData, shelfPosition);

    Vec3.add(shelfPosition, shelfPosition, this._originVector);
    shelf.setPosition(shelfPosition);

    for (let i = 0; i < shelfData.slots.length; i++) {
      const itemPrefab = this.itemsPool.getItem(shelfData.slots[i]);
      if (itemPrefab) {
        const item = instantiate(itemPrefab);
        shelf.getComponent(Shelf)!.insertItem(i, item);
      }
    }

    return shelf;
  }

  calculateOriginVector(width: number, height: number) {
    const x = width / 2;
    const y = (height * 0.75) / 2;

    this._originVector = new Vec3(x, y, 0);
    Vec3.invert(this._originVector, this._originVector);
  }
}
