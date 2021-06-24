import BaseComponent from "../../component/BaseComponent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CongratulateGain extends BaseComponent {

    @property(cc.Label)
    cashNums: cc.Label = null;

    onLoad() {
        super.onLoad();
    }

    start() {
        super.start();
    }

    initUI(cashNums) {
        this.cashNums.string = String(cashNums);
    }

    clickRecieveCallback() {
        this.nodeRunOutAction();
    }

    // update (dt) {}
}
