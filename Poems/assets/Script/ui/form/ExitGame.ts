import BaseComponent from "../../component/BaseComponent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ExitGame extends BaseComponent {

    onLoad() {
        super.onLoad();
    }

    start() {
        super.start();
    }

    clickExitCallback() {
        cc.game.end();
    }

    clickContinueCallback() {
        this.nodeRunOutAction();
    }

    // update (dt) {}
}
