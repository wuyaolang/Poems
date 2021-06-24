const { ccclass, property } = cc._decorator;
import GameApp from "../GameApp";
import UIManager from "../manager/UIManager";
import BaseComponent from "../component/BaseComponent";
@ccclass
export default class GameScene extends BaseComponent {

    @property(cc.Node)
    runningRoot: cc.Node = null;
    @property(cc.Node)
    popupRoot: cc.Node = null;
    @property(cc.Node)
    toastRoot: cc.Node = null;
    @property(cc.Node)
    loadingMask: cc.Node = null;
    @property(cc.Node)
    screenMask: cc.Node = null;
    onLoad() { }

    start() {
        // GameApp.Instance.dataManager.removeAllData();//需要清理本地数据的时候打开。
        if (GameApp.Instance.uiManager == null) {
            //如果uiManager为null,就是刚刚进入游戏，需要预加载资源
            GameApp.Instance.uiManager = new UIManager;
        }
        let uimanager = GameApp.Instance.uiManager;
        uimanager.runningRoot = this.runningRoot;
        uimanager.popupRoot = this.popupRoot;
        uimanager.toastRoot = this.toastRoot;
        uimanager.loadingMask = this.loadingMask;
        uimanager.screenMask = this.screenMask;
        uimanager.runWithFormByName(uimanager.runningFormName);
    }

    // update (dt) {}
}
