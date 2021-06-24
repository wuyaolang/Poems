import BaseComponent from "../../component/BaseComponent";
import GameApp from "../../GameApp";
import { ActionNet } from "../../manager/httpTools/Action";
import CocosSDK from "../../sdk/CocosSDK";
import Globle from "../config/Global";
import CashOutManager from "../manager/CashOutManager";
import OpenUrlManager from "../manager/OpenUrlManager";
import CashOut from "./CashOut";
import CashOutSuccessTips from "./CashOutSuccessTips";
import GameLayer from "./GameLayer";
import Poems from "./Poems";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HaveBindVerification extends BaseComponent {
    private verificationEditContent = "";
    private phoneNums = "";//必须是一个11位的手机号码：
    private chain = "";
    private countDownSeconds = 60;

    onLoad() {
        super.onLoad();
    }

    start() {
        super.start();
        this.refreshBtnSubmit();
    }

    initUI(chain, phoneNum) {
        this.chain = chain;
        this.phoneNums = phoneNum;
        if (this.phoneNums == "" || this.phoneNums.length != 11) {
            GameApp.Instance.uiManager.showToast("手机号码位空字符窜或者长度不为11");
            return;
        }
        let nums = "";
        for (let i = 0; i < this.phoneNums.length; i++) {
            if (i >= 3 && i <= 6) {
                nums += "*";
            } else {
                nums += this.phoneNums[i];
            }
        }
        let phoneNumTipsComp = this.node.getChildByName("BG").getChildByName("PhoneTips").getComponent(cc.Label);
        phoneNumTipsComp.string = `请输入手机号码${nums}收到的短信验证码`;
    }

    clickCloseCallback() {
        this.nodeRunOutAction();
    }

    clickPostVerificationCallback() {
        let btnPost = this.node.getChildByName("BG").getChildByName("Sp_Verification").getChildByName("BtnPost");
        let countdownBG = this.node.getChildByName("BG").getChildByName("Sp_Verification").getChildByName("CountDownBG");
        let countdownLabelComp = countdownBG.getChildByName("CountDown").getComponent(cc.Label);
        GameApp.Instance.uiManager.showLoading(Globle.LoadingAni);
        setTimeout(() => {
            GameApp.Instance.uiManager.hideLoading();
        }, 5000);
        OpenUrlManager.Instance.cashSendValidateCode(new ActionNet((resFail) => {
            GameApp.Instance.uiManager.hideLoading();
        }, (resSuccess) => {
            GameApp.Instance.uiManager.hideLoading();
            if (resSuccess.code == 0) {

                btnPost.active = false;
                countdownBG.active = true;
                this.scheduleCountDown(() => {
                    btnPost.active = true;
                    countdownBG.active = false;
                });

                let data = resSuccess.data;
                if (data != null && data != undefined) {
                    let chain_ = data.chain;
                    if (chain_ != undefined && chain_ != null) {
                        console.log("cashout========11 获取chain成功" + chain_);
                        CashOutManager.Instance.chain = chain_;
                    }
                }
            } else {
                if (resSuccess.msg) {
                    GameApp.Instance.uiManager.showToast(resSuccess.msg);
                } else {
                    GameApp.Instance.uiManager.showToast("网络异常");
                }
            }
        }), this.chain);
    }

    scheduleCountDown(callback = null) {
        let countSeconds = this.countDownSeconds;
        let countdownLabelComp = this.node.getChildByName("BG").getChildByName("Sp_Verification").getChildByName("CountDownBG").getChildByName("CountDown").getComponent(cc.Label);
        let func = () => {
            countSeconds--;
            countdownLabelComp.string = String(countSeconds);
            if (countSeconds <= 0) {
                countdownLabelComp.unschedule(func);
                if (callback) {
                    callback();
                }
            }
        };
        countdownLabelComp.schedule(func, 1, cc.macro.REPEAT_FOREVER, 0);
    }

    clickSubmitCallback() {
        GameApp.Instance.uiManager.showLoading(Globle.LoadingAni);
        setTimeout(() => {
            GameApp.Instance.uiManager.hideLoading();
        }, 5000);
        OpenUrlManager.Instance.validateSmsCode(new ActionNet((resFail) => {
            GameApp.Instance.uiManager.hideLoading();
            GameApp.Instance.uiManager.showToast("提现失败");
            console.log("cashout========12 -----------1");
        }, (resSuccess) => {
            if (resSuccess.code == 0) {
                console.log("cashout========12 -----------2");
                let data = resSuccess.data;
                console.log("cashout========12 -----------3 " + JSON.stringify(data));
                if (data != null && data != undefined) {
                    console.log("cashout========12 -----------4");
                    let chain_ = data.chain;
                    if (chain_ != undefined && chain_ != null) {
                        console.log("cashout========12 -----------5");
                        console.log("cashout========12 获取chain成功" + chain_);
                        CashOutManager.Instance.chain = chain_;
                        this.cashOutImediately();
                    }
                }
            } else {
                GameApp.Instance.uiManager.hideLoading();
                if (resSuccess.msg) {
                    GameApp.Instance.uiManager.showToast(resSuccess.msg);
                } else {
                    GameApp.Instance.uiManager.showToast("网络异常");
                }
            }
        }), CashOutManager.Instance.chain, this.verificationEditContent);
    }

    cashOutImediately() {
        let deviceToken = CocosSDK.getDeviceToken();
        console.log("cashout 0 " + deviceToken);
        console.log("cashout 4 " + CashOutManager.Instance.chain);
        console.log("cashout 5 " + JSON.stringify(CashOut.currentSelectCashInfo));
        OpenUrlManager.Instance.cashOutExchange(new ActionNet((resFail) => {
            GameApp.Instance.uiManager.hideLoading();
            GameApp.Instance.uiManager.showToast("提现失败");
        }, (resSuccess) => {
            if (resSuccess.code == 0) {
                Globle.gainUserInfo(() => {
                    GameApp.Instance.uiManager.callUIRefreshFunctionsWithName("Refresh_User_Info");
                    this.nodeRunOutAction();
                });
                //刷新提现列表：
                Globle.gainExchangeList(() => {
                    let running = GameApp.Instance.uiManager.runningForm;
                    if (running) {
                        let runningComp = <GameLayer>running.getComponent("GameLayer");
                        let cashOutComp = <CashOut>runningComp.tabArray[0];
                        cashOutComp.refreshCashOutList();

                    }
                });
                //弹出提现成功提示界面：
                let comp = <CashOutSuccessTips>GameApp.Instance.uiManager.popUpFormByNameTo("CashOutSuccessTips");
                comp.initUI(CashOut.currentSelectCashInfo);
            } else {
                GameApp.Instance.uiManager.hideLoading();
                if (resSuccess.msg) {
                    GameApp.Instance.uiManager.showToast(resSuccess.msg);
                } else {
                    GameApp.Instance.uiManager.showToast("网络异常");
                }
            }

        }), CashOut.currentSelectCashInfo.id, CashOutManager.Instance.chain, deviceToken);
    }

    verificationEditBoxChangeCallback() {
        let editboxComp = this.node.getChildByName("BG").getChildByName("Sp_Verification").getChildByName("EditBox").getComponent(cc.EditBox);
        this.verificationEditContent = editboxComp.string;
        this.refreshBtnSubmit();
    }

    verificationEditBeginCallback() {
        console.log("");
    }

    verificationEditEndCallback() {
        console.log("");
    }

    refreshBtnSubmit() {
        let btnSubmit = this.node.getChildByName("BG").getChildByName("BtnSubmit").getComponent(cc.Button);
        if (btnSubmit) {
            btnSubmit.interactable = this.verificationEditContent.length == 6;
        }
    }

    // update (dt) {}
}
