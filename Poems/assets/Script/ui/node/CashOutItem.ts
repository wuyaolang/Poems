import GameApp from "../../GameApp";
import CashOut from "../form/CashOut";
import GameLayer from "../form/GameLayer";

const { ccclass, property } = cc._decorator;

//提现分类枚举：
export enum CashOutClass {
    NewPlayerCashOut = 1,
    DailyCashOut = 4,
    LargeAmountCashOut = 3,
}

@ccclass
export default class CashOutItem extends cc.Component {
    @property(cc.Node)
    defaultBG: cc.Node = null;
    @property(cc.Node)
    selectBG: cc.Node = null;
    @property(cc.Node)
    grayBG: cc.Node = null;
    @property(cc.Label)
    cashNums: cc.Label = null;
    @property(cc.Node)
    cashOutType: cc.Node = null;
    @property(cc.Label)
    cashOutTypeLabel: cc.Label = null;
    @property(cc.Node)
    cashOutTypeGray: cc.Node = null;
    @property(cc.Button)
    btnClick: cc.Button = null;

    private cashOutData = null;
    private cashOutClass = CashOutClass.NewPlayerCashOut;//提现分类：
    private isSelect = false;//该item是否选中：
    onLoad() {

    }

    start() {

    }

    initUI(data, isSelect) {
        this.cashOutData = data;
        this.cashOutClass = data.type;
        this.isSelect = isSelect;
        this.cashNums.string = `${data.money}元`;
        let status = data.status;
        this.defaultBG.active = status == 0 || status == 1;
        this.selectBG.active = isSelect;
        this.grayBG.active = status == 2 || status == 3 || status == 4 || status == 5;
        this.cashOutType.active = status == 0 || status == 1;
        this.cashOutTypeGray.active = status == 2 || status == 3 || status == 4 || status == 5;
        this.btnClick.interactable = status == 0 || status == 1;
        if (this.cashOutClass == CashOutClass.NewPlayerCashOut) {
            this.cashOutTypeLabel.string = "新人专享";
        } else if (this.cashOutClass == CashOutClass.DailyCashOut) {
            this.cashOutTypeLabel.string = "每日提现";
        } else if (this.cashOutClass == CashOutClass.LargeAmountCashOut) {
            this.cashOutType.active = false;
            this.cashOutTypeGray.active = false;
        }
    }

    clickCallback() {
        let running = GameApp.Instance.uiManager.runningForm;
        if (running) {
            let runningComp = <GameLayer>running.getComponent("GameLayer");
            let cashout = runningComp.tabArray[0];
            let cashoutComp = <CashOut>cashout.getComponent("CashOut");
            CashOut.currentSelectCashInfo = this.cashOutData;
            cashoutComp.refreshCashOutList();
        }
    }

    // update (dt) {}
}
