import EventManager from "./manager/EventManager";
import SocketManager from "./manager/SocketManager";
import AudioManager from "./manager/AudioManager";
import DataManager from "./manager/DataManager";
import HttpManager from "./manager/HttpManager";
import UIManager from "./manager/UIManager";
import TeachManager from "./manager/TeachManager";

export default class GameApp {
  public eventManager: EventManager;
  public dataManager: DataManager;
  public audioManager: AudioManager;
  public httpManager: HttpManager;
  public socketManager: SocketManager;
  public teachManager: TeachManager;
  public uiManager: UIManager;
  public closeNum: number = 0;
  public guankaNum: number = 0;
  public alshow: boolean = false;
  public value;
  Initialize() {
    if (this.eventManager != null) return; //防止重复构造
    this.eventManager = new EventManager();
    this.dataManager = new DataManager();
    this.audioManager = new AudioManager();
    this.httpManager = new HttpManager();
    this.socketManager = new SocketManager();
    this.teachManager = new TeachManager();

    this.uiManager = null;//uiManager不构造，Canvas节点挂载
    cc.log("构造了GameApp");
  }


  //单例
  private static _ins: GameApp;
  public static get Instance(): GameApp {
    if (!this._ins) {
      this._ins = new GameApp();
    }
    return this._ins;
  }
  public init() {
    this.Initialize();
    this.socketManager.Initialize();
  }
}
if (!CC_EDITOR) {
  GameApp.Instance.init();
}
