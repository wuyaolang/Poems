import BaseComponent from "../../component/BaseComponent";
import GameApp from "../../GameApp";
import GameLayer from "./GameLayer";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ExchangeSuccess extends BaseComponent {

    @property(cc.RichText)
    subTitle: cc.RichText = null;

    onLoad() {
        super.onLoad();
    }

    start() {
        super.start();
    }

    initUI(exchangeNums) {
        this.subTitle.string = `<color=#042D27>成功兑换</c><color=#F36269>${exchangeNums}</color><color=#042D27>元</c>`;
    }

    clickContinueCallback() {
        this.nodeRunOutAction();
        let running = GameApp.Instance.uiManager.runningForm;
        if (running) {
            let comp = <GameLayer>running.getComponent("GameLayer");
            comp.poemsToggle.isChecked = true;
        }
    }
}
