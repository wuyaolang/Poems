import BaseComponent from "../../component/BaseComponent";
import GameApp from "../../GameApp";
import GameLayer from "./GameLayer";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CashOutSuccessTips extends BaseComponent {
    @property(cc.RichText)
    subTitle: cc.RichText = null;

    private cashInfo = null;

    onLoad() {
        super.onLoad();
    }

    start() {
        super.start();
    }

    initUI(cashInfo) {
        this.cashInfo = cashInfo;
        this.subTitle.string = `<color=#000000>成功提现</c><color=#FF5B5B>${this.cashInfo.money}</color><color=#000000>元</c>`;
    }

    clickCloseCallback() {
        this.nodeRunOutAction();
    }

    clickContinueCallback() {
        this.nodeRunOutAction();
        let running = GameApp.Instance.uiManager.runningForm;
        if (running) {
            let comp = <GameLayer>running.getComponent("GameLayer");
            comp.poemsToggle.isChecked = true;
        }
    }

    // update (dt) {}
}
