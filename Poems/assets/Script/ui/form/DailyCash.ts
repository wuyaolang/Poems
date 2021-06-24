import BaseComponent from "../../component/BaseComponent";
import GameApp from "../../GameApp";
import GameLayer from "./GameLayer";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DailyCash extends BaseComponent {
    @property(cc.RichText)
    dailyCashRate1: cc.RichText = null;
    @property(cc.Label)
    dailyCashDes1: cc.Label = null;
    @property(cc.Node)
    btnDailyCash1: cc.Node = null;
    @property(cc.Node)
    btnDailyCashGray1: cc.Node = null;

    @property(cc.RichText)
    dailyCashRate2: cc.RichText = null;
    @property(cc.Label)
    dailyCashDes2: cc.Label = null;
    @property(cc.Node)
    btnDailyCash2: cc.Node = null;
    @property(cc.Node)
    btnDailyCashGray2: cc.Node = null;

    onLoad() {
        super.onLoad();
    }

    start() {
        super.start();
        this.initUI();
    }

    initUI() {
        let list = GameApp.Instance.dataManager.exchangeList;
        let dailyInfo1 = list[1];
        let dailyInfo2 = list[2];
        let fulfillConditionBean = dailyInfo1.fulfillConditionBean;
        if (fulfillConditionBean) {
            let obj = fulfillConditionBean.obj;
            if (obj) {
                let current = obj.current;
                let max = obj.max;
                this.dailyCashRate1.string = `<color=#F5606C>${current}</c><color=#042D27>/${max}</color>`;
                this.btnDailyCash1.active = current >= max;
                this.btnDailyCashGray1.active = current < max;
                this.dailyCashDes1.string = current >= max ? "已完成" : "未完成";
            }
        }
        let fulfillConditionBean1 = dailyInfo2.fulfillConditionBean;
        if (fulfillConditionBean1) {
            let obj = fulfillConditionBean1.obj;
            if (obj) {
                let current = obj.current;
                let max = obj.max;
                this.dailyCashRate2.string = `<color=#F5606C>${current}</c><color=#042D27>/${max}</color>`;
                this.btnDailyCash2.active = current >= max;
                this.btnDailyCashGray2.active = current < max;
                this.dailyCashDes2.string = current >= max ? "已完成" : "未完成";
            }
        }
    }

    clickCashOut1Callback() {
        this.nodeRunOutAction();
        let running = GameApp.Instance.uiManager.runningForm;
        if (running) {
            let comp = <GameLayer>running.getComponent("GameLayer");
            comp.cashOutToggle.isChecked = true;
        }
    }

    clickCashOut2Callback() {
        this.nodeRunOutAction();
        let running = GameApp.Instance.uiManager.runningForm;
        if (running) {
            let comp = <GameLayer>running.getComponent("GameLayer");
            comp.cashOutToggle.isChecked = true;
        }
    }

    clickContinueCallback() {
        this.nodeRunOutAction();
    }

    // update (dt) {}
}
