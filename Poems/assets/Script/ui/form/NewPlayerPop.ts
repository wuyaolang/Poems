import BaseComponent from "../../component/BaseComponent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewPlayerPop extends BaseComponent {
    @property(cc.Label)
    desLabel: cc.Label = null;

    onLoad() {
        super.onLoad();
    }

    start() {
        super.start();
    }

    initUI(des) {
        this.desLabel.string = des;
    }

    clickCollectMoneyCallback() {
        this.nodeRunOutAction();
    }

    // update (dt) {}
}
