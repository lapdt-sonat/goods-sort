import { _decorator, Component, Node, Prefab } from "cc";
const { ccclass, property } = _decorator;

const itemIndexMap: Record<string, number> = {
  soda_1: 0,
  soda_2: 1,
  coffee_1: 2,
  juice_orange: 3,
  juice_strawberry: 4,
  pop_bottle_1: 5,
  togo_cup_1: 6,
  water_bottle_1: 7,
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
