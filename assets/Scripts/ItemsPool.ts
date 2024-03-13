import { _decorator, Component, Node, Prefab } from "cc";
const { ccclass, property } = _decorator;

const itemIndexMap: Record<string, number> = {
  soda_1: 0,
  soda_2: 1,
};

@ccclass("ItemsPool")
export class ItemsPool extends Component {
  @property({ type: [Prefab] })
  public items: Prefab[] = [];

  start() {}

  update(deltaTime: number) {}

  getItem(id: string) {
    return this.items[itemIndexMap[id]];
  }
}
