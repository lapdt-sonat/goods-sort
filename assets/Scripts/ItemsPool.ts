import { _decorator, Component, Node, Prefab } from "cc";
const { ccclass, property } = _decorator;

const itemIndexMap: Record<string, number> = {
  teddy_white: 0,
  teddy_blue: 1,
  sheep: 2,
  horse: 3,
  elephant: 4,
  duck: 5,
  dragon: 6,
  doll_2: 7,
  doll_1: 8,
  dinosaur: 9,
  bunny_orange: 10,
  avocado: 11,
  alpaca: 12,
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
