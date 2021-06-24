import BaseComponent from "../../component/BaseComponent";
import GameApp from "../../GameApp";
import GameLayer from "./GameLayer";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewPlayerCashOut extends BaseComponent {

    onLoad() {
        super.onLoad();
    }

    start() {
        super.start();
    }

    clickCashOutCallback() {
        this.nodeRunOutAction();
        let running = GameApp.Instance.uiManager.runningForm;
        if (running) {
            let comp = <GameLayer>running.getComponent("GameLayer");
            comp.cashOutToggle.isChecked = true;
        }
    }

    clickCloseCallback() {
        this.nodeRunOutAction();
    }

    // update (dt) {}
}
