import {
  _decorator,
  Camera,
  CCFloat,
  CCInteger,
  CCString,
  Component,
  EventTouch,
  geometry,
  Input,
  input,
  Node,
  PhysicsSystem,
} from "cc";
import { ShelfGroup } from "./ShelfGroup";
import { UIController } from "./UIController";
import { EndcardController } from "./EndcardController";
import playableHelper from "./helper/playable";
import { AudioController } from "./AudioController";
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

  private _isTouched = false;
  private _isDragging = false;
  private _isInteracted = false;
  private _ray: geometry.Ray = new geometry.Ray();

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
  }

  update(deltaTime: number) {}

  onTouchStart(event: EventTouch) {
    this.cameraComponent.screenPointToRay(
      event.getLocationX(),
      event.getLocationY(),
      this._ray
    );

    console.log(this._ray);
    if (PhysicsSystem.instance.raycast(this._ray)) {
      this._isTouched = true;
      const raycastResults = PhysicsSystem.instance.raycastResults;
      console.log("raycast result", raycastResults);
      // this.cubeGroup.handleTap(PhysicsSystem.instance.raycastResults);
    }

    if (!this._isInteracted) {
      // this.audioController.playBgMusic();
      // this.stopTutAnim();
      this._isInteracted = true;
    }
  }

  onTouchMove(event: EventTouch) {
    // switch (this._touchGesture) {
    //   case TouchGesture.DRAG: {
    //     if (this._isDragging) {
    //       this.cubeGroup.rotateGroup(
    //         event.getDelta(),
    //         this._cameraPosition,
    //         this._cameraRotation
    //       );
    //     } else if (this._isTouched && this.isRealMove(event.getDelta())) {
    //       this._isDragging = true;
    //     }
    //     break;
    //   }
    //   case TouchGesture.ZOOM:
    //     this.handleZoom(event);
    //     break;
    //   default:
    // }
  }

  onTouchEnd(event: EventTouch) {
    this.cameraComponent.screenPointToRay(
      event.getLocationX(),
      event.getLocationY(),
      this._ray
    );
    if (PhysicsSystem.instance.raycast(this._ray)) {
      const raycastResults = PhysicsSystem.instance.raycastResults;
      console.log("touch end result", raycastResults);
      // this.cubeGroup.handleTap(PhysicsSystem.instance.raycastResults);
    }

    this.resetTouchStates();
  }

  resetTouchStates() {
    this._isTouched = false;
    this._isDragging = false;
  }
}
