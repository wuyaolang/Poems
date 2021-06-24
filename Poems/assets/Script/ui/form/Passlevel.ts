import BaseComponent from "../../component/BaseComponent";
import GameApp from "../../GameApp";
import { ActionNet } from "../../manager/httpTools/Action";
import CocosSDK from "../../sdk/CocosSDK";
import Globle from "../config/Global";
import { CallJsType } from "../config/SdkConfig";
import OpenUrlManager from "../manager/OpenUrlManager";
import CashOut from "./CashOut";
import GameLayer from "./GameLayer";
import Poems from "./Poems";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Passlevel extends BaseComponent {
    @property(cc.Label)
    comboNums: cc.Label = null;
    @property(cc.Label)
    gainCashNums: cc.Label = null;
    @property(cc.Label)
    comboDes: cc.Label = null;
    @property(cc.Node)
    btnClose: cc.Node = null;
    @property(cc.Label)
    countDown: cc.Label = null;
    @property(cc.Node)
    videoLogo: cc.Node = null;
    @property(cc.Label)
    videoButtonDes: cc.Label = null;
    @property(cc.Label)
    des: cc.Label = null;

    private redPackID = "";
    private isGainNextQuestionInfoSuccess = false;
    private isButtonCanClick = true;

    onLoad() {
        super.onLoad();

        //信息流显示逻辑：
        CocosSDK.showAdInfo(CallJsType.InfoAd_Passlevel_Fail_Type, 920 * Tools.getScreenHeightRate());
        this.addOnDestoryFunc(() => {
            CocosSDK.closeAdInfo(CallJsType.InfoAd_Passlevel_Fail_Type);

        });

        //刷新提现列表：
        Globle.gainExchangeList(() => {
            let running = GameApp.Instance.uiManager.runningForm;
            if (running) {
                let runningComp = <GameLayer>running.getComponent("GameLayer");
                let cashOutComp = <CashOut>runningComp.tabArray[0];
                cashOutComp.refreshCashOutList();
            }

            let list = GameApp.Instance.dataManager.exchangeList;
            for (let i = 1; i <= 2; i++) {
                let info = list[i];
                let status = info.status;
                if (status == 0) {
                    let fulfillConditionBean = info.fulfillConditionBean;
                    if (fulfillConditionBean) {
                        let obj = fulfillConditionBean.obj;
                        if (obj) {
                            let current = obj.current;
                            let max = obj.max;
                            if (max - current > 0) {
                                this.comboDes.string = `继续答对${max - current}题，即可进行提现`;
                            } else {
                                this.comboDes.string = `您今天已经答对${max}题，可以去提现啦！`;
                            }
                        }
                    }
                    break;
                }
            }
        });
    }

    start() {
        super.start();
        this.initUI();
    }

    initUI() {
        //获取红包金额：
        OpenUrlManager.Instance.gainRedPack(new ActionNet((resFail) => { }, (resSuccess) => {
            if (resSuccess.code == 0) {
                let data = resSuccess.data;
                if (!data) {
                    return;
                }
                this.gainCashNums.string = `+ ${Tools.toFloat(Tools.toFloat(data.golds) / data.exRate, 2)}`;
                this.redPackID = data.id;
            }
        }), "20");

        //获取本地答对之后的下一题信息：
        Globle.gainAnswerInfo(() => {
            this.isGainNextQuestionInfoSuccess = true;
            let userGameInfo = GameApp.Instance.dataManager.userGameInfo;
            this.comboNums.string = userGameInfo.pairedTotal;
            this.des.string = `闯关奖励额外增加${userGameInfo.pairedTotal >= 50 ? 50 : userGameInfo.pairedTotal}%`;

            let answerProgressInfo = GameApp.Instance.dataManager.userGameInfo;
            let levelNums = answerProgressInfo.levelNum;
            if (levelNums == 1) {
                this.videoLogo.active = false;
                this.videoButtonDes.string = "立即领取";
            }
        });

        Globle.getDailySignTaskList(() => {
            Globle.getTaskList(() => {
                GameApp.Instance.uiManager.callUIRefreshFunctionsWithName("Refresh_Task_ScrollView");
                GameApp.Instance.uiManager.callUIRefreshFunctionsWithName("Refresh_RedPoint");
            });
        });

        //关闭按钮延迟三秒钟显示逻辑：
        let countDownSeconds = 3;
        this.countDown.string = `${countDownSeconds}s`;
        let countDownFunc = () => {
            countDownSeconds--;
            this.countDown.string = `${countDownSeconds}s`;
            if (countDownSeconds <= 0) {
                this.countDown.unschedule(countDownFunc);
                this.countDown.node.active = false;
                this.btnClose.active = true;
            }
        };
        this.countDown.schedule(countDownFunc, 1.0, cc.macro.REPEAT_FOREVER, 1.0);
    }

    clickCloseCallback() {
        if (!this.isGainNextQuestionInfoSuccess) {
            return;
        }

        let answerProgressInfo = GameApp.Instance.dataManager.userGameInfo;
        let levelNums = answerProgressInfo.levelNum;
        if (levelNums % 5 == 0) {
            CocosSDK.showRewardVideoAD(CallJsType.RewardAd_Passlevel_Skip_Close);
        } else {
            this.closeFuncWithVideo();
        }
    }

    closeFuncWithVideo() {
        OpenUrlManager.Instance.recieveRedPack(new ActionNet((resFail) => {
            this.isButtonCanClick = true;
        }, (resSuccess) => {
            if (resSuccess.code == 0) {
                let data = resSuccess.data;
                if (!data) {
                    return;
                }
                GameApp.Instance.dataManager.cashInfo = Tools.toFloat(Tools.toFloat(data.userAllGolds) / data.exRate, 2);
                GameApp.Instance.uiManager.callUIRefreshFunctionsWithName("Refresh_User_Info");
                GameApp.Instance.uiManager.callUIRefreshFunctionsWithName("Refresh_Poems_Info");
                this.nodeRunOutAction();
            } else {
                this.isButtonCanClick = true;
            }
        }), "20", this.redPackID, "0");
    }

    clickDoubleRecieveCallback() {
        if (!this.redPackID || !this.isGainNextQuestionInfoSuccess) {
            return;
        }
        if (!this.isButtonCanClick) {
            return;
        }
        this.isButtonCanClick = false;
        let answerProgressInfo = GameApp.Instance.dataManager.userGameInfo;
        let levelNums = answerProgressInfo.levelNum;
        if (levelNums == 1) {
            this.closeFuncWithVideo();
        } else {
            CocosSDK.showRewardVideoAD(CallJsType.RewardAd_Passlevel_Close);
        }
    }

    doubleRecieve() {
        OpenUrlManager.Instance.recieveRedPack(new ActionNet((resFail) => {
            this.isButtonCanClick = true;
        }, (resSuccess) => {
            if (resSuccess.code == 0) {
                let data = resSuccess.data;
                if (!data) {
                    return;
                }
                GameApp.Instance.dataManager.cashInfo = Tools.toFloat(Tools.toFloat(data.userAllGolds) / data.exRate, 2);
                GameApp.Instance.dataManager.goldInfo = Math.floor(data.userAllMoney * data.exRate);
                GameApp.Instance.uiManager.callUIRefreshFunctionsWithName("Refresh_User_Info");
                GameApp.Instance.uiManager.callUIRefreshFunctionsWithName("Refresh_Poems_Info");
                this.nodeRunOutAction();
            } else {
                this.isButtonCanClick = true;
            }
        }), "20", this.redPackID, "1");
    }

    // update (dt) {}
}
