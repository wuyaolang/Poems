import BaseComponent from "../../component/BaseComponent";
import GameApp from "../../GameApp";
import CocosSDK from "../../sdk/CocosSDK";
import Globle from "../config/Global";
import { CallJsType } from "../config/SdkConfig";
import ExchangeSuccess from "./ExchangeSuccess";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ExchangeCash extends BaseComponent {
    @property(cc.RichText)
    subTitle: cc.RichText = null;
    @property(cc.RichText)
    consumeGold: cc.RichText = null;

    private exchangeNums = "";

    onLoad() {
        super.onLoad();
    }

    start() {
        super.start();
        this.initUI();
    }

    initUI() {
        let goldInfo = GameApp.Instance.dataManager.goldInfo;
        this.subTitle.string = `<color=#042D27>可兑换现金</c><color=#F36269>${Tools.toFloat(Tools.toFloat(goldInfo) / 10000, 2)}</color><color=#042D27>元</c>`;
        this.exchangeNums = Tools.toFloat(Tools.toFloat(goldInfo) / 10000, 2);
        this.consumeGold.string = `<color=#042D27>消耗</c><color=#F36269>${goldInfo}</color><color=#042D27>金币</c>`;
    }

    clickCloseCallback() {
        this.nodeRunOutAction();
    }

    clickSureCallback() {
        CocosSDK.showRewardVideoAD(CallJsType.RewardAd_Exchange_Gold_Close);
    }

    /**
     * 看完视频的回调:
     */
    afterVideoCallback() {
        Globle.exchangeGold(() => {
            if (this.exchangeNums) {
                let comp = <ExchangeSuccess>GameApp.Instance.uiManager.popUpFormByNameTo("ExchangeSuccess");
                comp.initUI(this.exchangeNums);
                this.nodeRunOutAction();
            }

        });
    }
}
