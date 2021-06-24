import BaseComponent from "../../component/BaseComponent";
import GameApp from "../../GameApp";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewPlayerTeach extends BaseComponent {

    @property(cc.Node)
    finguerAni: cc.Node = null;

    onLoad() {
        super.onLoad();
    }

    start() {
        super.start();

    }

    initUI(rect: cc.Rect) {
        GameApp.Instance.teachManager.showTeachRect(rect, this.node);
        this.finguerAni.zIndex = 10000;
        let pos_ = cc.v2(rect.x + rect.width / 2, rect.y + rect.height / 2);
        this.finguerAni.setPosition(cc.v2(pos_.x - cc.winSize.width / 2, pos_.y - cc.winSize.height / 2));
    }

    // update (dt) {}
}
