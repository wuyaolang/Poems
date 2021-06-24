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
export default class UnBindVerification extends BaseComponent {
    private phoneEditContent = "";
    private verificationEditContent = "";
    private chain = "";
    private countDownSeconds = 60;

    onLoad() {
        super.onLoad();
    }

    start() {
        super.start();
        this.refreshBtnSubmit();
    }

    initData(chain) {
        this.chain = chain;
    }

    clickPostVerificationCallback() {
        if (this.phoneEditContent.length < 11) {
            GameApp.Instance.uiManager.showToast("请输入正确的手机号");
            return;
        }
        this.gainVerificateByPhoneNum();
    }

    clickCloseCallback() {
        this.nodeRunOutAction();
    }

    clickSubmitCallback() {
        GameApp.Instance.uiManager.showLoading(Globle.LoadingAni);
        setTimeout(() => {
            GameApp.Instance.uiManager.hideLoading();
        }, 5000);
        OpenUrlManager.Instance.validateSmsCode(new ActionNet((resFail) => {
            GameApp.Instance.uiManager.hideLoading();
            GameApp.Instance.uiManager.showToast("提现失败");
        }, (resSuccess) => {
            if (resSuccess.code == 0) {
                let data = resSuccess.data;
                if (data != null && data != undefined) {
                    let chain_ = data.chain;
                    if (chain_ != undefined && chain_ != null) {
                        console.log("cashout========10 获取chain成功" + chain_);
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
        }), CashOutManager.Instance.chain, this.verificationEditContent, this.phoneEditContent);
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
            console.log("cashout 1 " + JSON.stringify(resSuccess));
            if (resSuccess.code == 0) {
                console.log("cashout 2 ");
                Globle.gainUserInfo(() => {
                    console.log("cashout 3 ");
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

    phoneEditBoxChangeCallback() {
        let editboxComp = this.node.getChildByName("BG").getChildByName("Sp_Phone").getChildByName("EditBox").getComponent(cc.EditBox);
        this.phoneEditContent = editboxComp.string;
        this.refreshBtnSubmit();
    }

    verificationEditBoxChangeCallback() {
        let editboxComp = this.node.getChildByName("BG").getChildByName("Sp_Verification").getChildByName("EditBox").getComponent(cc.EditBox);
        this.verificationEditContent = editboxComp.string;
        this.refreshBtnSubmit();
    }

    refreshBtnSubmit() {
        let btnSubmit = this.node.getChildByName("BG").getChildByName("BtnSubmit").getComponent(cc.Button);
        if (btnSubmit) {
            btnSubmit.interactable = this.phoneEditContent.length == 11 && this.verificationEditContent.length == 6;
        }
    }

    /**
     * 根据手机号获取验证码：
     */
    gainVerificateByPhoneNum() {
        let btnPost = this.node.getChildByName("BG").getChildByName("Sp_Phone").getChildByName("BtnPost");
        let countdownBG = this.node.getChildByName("BG").getChildByName("Sp_Phone").getChildByName("CountDownBG");
        GameApp.Instance.uiManager.showLoading(Globle.LoadingAni);
        setTimeout(() => {
            GameApp.Instance.uiManager.hideLoading();
        }, 5000);
        OpenUrlManager.Instance.bindSendValidateCode(new ActionNet((resFail) => {
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
                        console.log("cashout========9 获取chain成功" + chain_);
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
        }), this.chain, this.phoneEditContent);
    }

    scheduleCountDown(callback = null) {
        let countSeconds = this.countDownSeconds;
        let countdownLabelComp = this.node.getChildByName("BG").getChildByName("Sp_Phone").getChildByName("CountDownBG").getChildByName("CountDown").getComponent(cc.Label);
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

    // update (dt) {}
}
