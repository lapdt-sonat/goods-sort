import {
  _decorator,
  Camera,
  Canvas,
  CCFloat,
  CCInteger,
  CCString,
  Component,
  director,
  EventTouch,
  geometry,
  Input,
  input,
  Mat4,
  Node,
  physics,
  PhysicsSystem,
  UITransform,
  Vec2,
  Vec3,
} from "cc";
import { ShelfGroup } from "./ShelfGroup";
import { UIController } from "./UIController";
import { EndcardController } from "./EndcardController";
import playableHelper from "./helper/playable";
import { AudioController } from "./AudioController";
import { Shelf } from "./Shelf";
const { ccclass, property } = _decorator;
const SHELF_HEIGHT = 0.75;
const SHELF_WIDTH = 1;

@ccclass("GameController")
export class GameController extends Component {
  @property({ type: CCString })
  public map: string = "";

  @property({ type: CCInteger })
  public moves: number = 0;

  @property({ type: ShelfGroup })
  public shelfGroup: ShelfGroup = null!;

  @property({ type: AudioController })
  public audioController: AudioController = null!;

  @property({ type: UIController })
  public uiController: UIController = null!;

  @property({ type: EndcardController })
  public endcardController: EndcardController = null!;

  @property({ type: Camera })
  public cameraComponent: Camera = null!;

  @property(Canvas)
  public uiCanvas: Canvas = null!;

  @property(Node)
  public tutHand: Node = null!;

  private _isTouched = false;
  private _isInteracted = false;
  private _ray: geometry.Ray = new geometry.Ray();
  private _currentItemNode: Node | null = null;
  private _offset: Vec3 = new Vec3(0, -0.3, 0);
  private _prevShelf: Shelf | null = null;
  private _prevItemIndex: number = -1;
  private _timeToTutorial: number = 0;
  private _playingTutorial: boolean = false;

  protected onLoad(): void {
    const androidUrl = "";
    const iosUrl = "";

    playableHelper.setStoreUrl(iosUrl, androidUrl);
  }

  start() {
    input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
    input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
    input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);

    this.shelfGroup.initShelfGroup(this.map);
    this.playTutorial();
  }

  update(deltaTime: number) {
    this._timeToTutorial += deltaTime;

    if (this._timeToTutorial >= 1 && !this._playingTutorial) {
      this.playTutorial();
    }
  }

  onTouchStart(event: EventTouch) {
    this.uiController.removeCTP();
    this._playingTutorial = false;

    this.cameraComponent.screenPointToRay(
      event.getLocationX(),
      event.getLocationY(),
      this._ray
    );

    if (PhysicsSystem.instance.raycast(this._ray)) {
      const raycastResults = PhysicsSystem.instance.raycastResults;

      if (raycastResults.length === 2) {
        const rayCastToItem = raycastResults.find(
          (result) => result.collider.node.name !== "Shelf"
        );

        if (rayCastToItem) {
          this.audioController.playPickSfx();
          const pickedItem = rayCastToItem.collider.node;

          this._currentItemNode = pickedItem;
          const resultToShelf = raycastResults.find(
            (result) => result.collider.node.name === "Shelf"
          );
          this._prevShelf = resultToShelf.collider.node.getComponent(Shelf);

          this._prevItemIndex = this._prevShelf.calcStartSlotIndex(
            new Vec2(resultToShelf.hitPoint.x, resultToShelf.hitPoint.y)
          );

          pickedItem.emit("picked");
          this._isTouched = true;
        }
      }
    }

    if (!this._isInteracted) {
      this._isInteracted = true;
    }
  }

  onTouchMove(event: EventTouch) {
    if (this._isTouched && this._currentItemNode) {
      // this._isDragging = true;
      const calculatedPos = this.getItemPosition(event);
      this._currentItemNode.emit("drag", calculatedPos);
    }
  }

  onTouchEnd(event: EventTouch) {
    let newItemIndex: number = -1;

    this.cameraComponent.screenPointToRay(
      event.getLocationX(),
      event.getLocationY(),
      this._ray
    );
    if (PhysicsSystem.instance.raycast(this._ray)) {
      const raycastResults = PhysicsSystem.instance.raycastResults;
      const resultToShelf = raycastResults.find(
        (result) => result.collider.node.name === "Shelf"
      );

      if (
        resultToShelf &&
        this._prevShelf &&
        resultToShelf.collider.node.uuid !== this._prevShelf.node.uuid
      ) {
        newItemIndex = this.processHitShelf(resultToShelf);
        if (this._prevItemIndex !== -1 && newItemIndex !== -1) {
          this.audioController.playPlaceSfx();
          this._prevShelf.removeItem(
            this._currentItemNode,
            this._prevItemIndex
          );
        }
      }
    }

    if (this._isTouched && this._currentItemNode && newItemIndex === -1) {
      this._currentItemNode?.emit("release");
    }

    this.resetTouchStates();
  }

  processHitShelf(result: physics.PhysicsRayResult): number {
    const hitPoint = new Vec3(result.hitPoint);
    const shelf = result.collider.node.getComponent(Shelf);

    const slotIndex = shelf.calcEndSlotIndex(new Vec2(hitPoint.x, hitPoint.y));

    if (slotIndex !== -1) {
      this.updateMoves();
      // this.uiController.updateMoves(this.moves);
      shelf.updateItemToShelf(slotIndex, this._currentItemNode);
      const isSoldOut = shelf.checkWinCondition();

      if (isSoldOut) {
        this.audioController.playSoldOutSfx();
        shelf.close();
        // this.uiController.showWinScreen();
      }
      // this.audioController.("drop");
      return slotIndex;
    }
    return -1;
  }

  resetTouchStates() {
    this._isTouched = false;
    this._prevShelf = null;
    this._currentItemNode = null;
  }

  getItemPosition(event: EventTouch): Vec3 {
    let ray = this.cameraComponent.screenPointToRay(
      event.getLocationX(),
      event.getLocationY()
    );

    const direction = new Vec3(ray.d);
    const plane = new Vec3(0, 0, 0.3);
    const originPoint = new Vec3(ray.o);

    const temp = (plane.z - originPoint.z) / direction.z;
    const x = originPoint.x + temp * direction.x;
    const y = originPoint.y + temp * direction.y;

    const position = new Vec3(x, y, plane.z);
    Vec3.add(position, position, this._offset);
    return position;
  }

  updateMoves() {
    this.moves--;

    if (this.moves <= 0) {
      this.audioController.playWinSfx();
      this.endcardController.showEndcard();
    }
  }

  playTutorial() {
    this._playingTutorial = true;
    this._timeToTutorial = 0;

    const { startingPoint, destinationPoint } = this.findGoodSort();
  }

  findGoodSort() {
    const startingPoint = new Vec3();
    const destinationPoint = new Vec3();
    let representItem: Node = null!;

    const shelves = this.shelfGroup.node.children.slice(1);
    const targetShelf = shelves.find((shelf, index) => {
      if (shelf.name === "Shelf") {
        const isGood = shelf.getComponent(Shelf).isGoodTarget();
        return isGood;
      }
      return false;
    });

    const shelfComponent = targetShelf?.getComponent(Shelf);

    representItem = shelfComponent.getRepresentItem();
    const worldBlankSpot = shelfComponent.getWorldBlankSpot();

    startingPoint.set(worldBlankSpot.x, worldBlankSpot.y, 0.35);

    for (let i = 0; i < shelves.length; i++) {
      const shelf = shelves[i];
      if (shelf.name === "Shelf") {
        const shelfComponent = shelf.getComponent(Shelf);
        const { hasItem, itemWorldPos } = shelf
          .getComponent(Shelf)
          .checkRepresentItem(representItem.name);

        if (hasItem) {
          destinationPoint.set(itemWorldPos.x, itemWorldPos.y, 0.35);
          break;
        }
      }
    }

    this.tutHand.setPosition(worldBlankSpot);

    return { startingPoint, destinationPoint };
  }

  getScreenPosFromWorldPos(worldPos: Vec3): Vec3 {
    const screenPos = new Vec3();
    this.cameraComponent.worldToScreen(worldPos, screenPos);
    const uiTransform = this.uiCanvas.getComponent(UITransform);

    const localVec3 = uiTransform.convertToNodeSpaceAR(worldPos);
    const uiPosition = new Vec3(localVec3.x, localVec3.y, 0);

    console.log("UI Position:", uiPosition);
    return uiPosition;
  }
}
