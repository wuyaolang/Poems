import GameApp from "../../GameApp";
import { ActionNet } from "../../manager/httpTools/Action";
import CocosSDK from "../../sdk/CocosSDK";
import HaveBindVerification from "../form/HaveBindVerification";
import UnBindVerification from "../form/UnBindVerification";
import OpenUrlManager from "./OpenUrlManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CashOutManager {
    private static _ins: CashOutManager;

    public static get Instance(): CashOutManager {
        if (!this._ins) {
            this._ins = new CashOutManager();
        }
        return this._ins;
    }

    public chain = "";
    public slideStartPos = "";
    public isCanclickNow = true;//防止提现按钮重复点击：

    /**
     * 判断是否绑定：
     */
    haveBind() {
        OpenUrlManager.Instance.haveBind(new ActionNet((resFail) => {
        }, (resSuccess) => {
            if (resSuccess.code == 0) {
                let data = resSuccess.data;
                if (data == null || data == undefined) {
                    return;
                }
                if (data.chain != null && data.chain != undefined && data.chain != "") {
                    console.log("cashout========1 获取chain成功" + data.chain);
                    this.chain = data.chain;
                }
            }
        }));
    }

    /**
     * 滑块验证开始：
     */
    startSlideVerificate(callback = null) {
        if (this.chain == "") {
            this.isCanclickNow = true;
            GameApp.Instance.uiManager.showToast("chain为空字符窜_startSlide");
            return;
        }
        if (this.slideStartPos == "") {
            this.isCanclickNow = true;
            GameApp.Instance.uiManager.showToast("slideStartPos空字符窜_startSlide");
            return;
        }
        OpenUrlManager.Instance.startSlide(new ActionNet((resFail) => {
            this.isCanclickNow = true;
        }, (resSuccess) => {
            if (resSuccess.code == 0) {
                let data = resSuccess.data;
                if (data != null && data != undefined) {
                    let chain_ = data.chain;
                    if (chain_ != undefined && chain_ != null) {
                        console.log("cashout========4 获取chain成功" + chain_);
                        this.chain = chain_;
                        if (callback) {
                            callback();
                        }
                        this.isCanclickNow = true;
                    }
                }
            } else {
                this.isCanclickNow = true;
                if (resSuccess.msg) {
                    GameApp.Instance.uiManager.showToast(resSuccess.msg);
                } else {
                    GameApp.Instance.uiManager.showToast("网络异常");
                }
            }
        }), this.chain, this.slideStartPos);
    }

    /**
     * 显示滑块拼图界面以及回调：
     */
    showCaptchaAndCallback() {
        CocosSDK.registerCashOutSlideSuccessCallback(() => {
            console.log("cashout========5 拼图滑块结束");
            setTimeout(() => {
                this.endSliderVerificate();
            }, 100);
        });
        CocosSDK.showCaptcha();
        console.log("cashout========4.5 显示滑块拼图");
    }

    /**
     * 滑块验证结束：
     */
    endSliderVerificate() {
        if (this.chain == "") {
            GameApp.Instance.uiManager.showToast("chain为空字符窜_endSlide");
            return;
        }
        if (this.slideStartPos == "") {
            GameApp.Instance.uiManager.showToast("slideStartPos空字符窜_endSlide");
            return;
        }
        OpenUrlManager.Instance.endSlide(new ActionNet((resFail) => {
        }, (resSuccess) => {
            if (resSuccess.code == 0) {
                let data = resSuccess.data;
                if (data != null && data != undefined) {
                    let chain_ = data.chain;
                    if (chain_ != undefined && chain_ != null) {
                        console.log("cashout========6 获取chain成功" + chain_);
                        this.chain = chain_;
                        this.beforeCashOutVerificate();
                    }
                }
            } else {
                if (resSuccess.msg) {
                    GameApp.Instance.uiManager.showToast(resSuccess.msg);
                } else {
                    GameApp.Instance.uiManager.showToast("网络异常");
                }
            }
        }), this.chain, this.slideStartPos);
    }

    /**
     * 提现前校验（获取chain，是否绑定手机号，绑定的手机号码）
     */
    beforeCashOutVerificate() {
        OpenUrlManager.Instance.cashValidate(new ActionNet((resFail) => {
        }, (resSuccess) => {
            if (resSuccess.code == 0) {
                let data = resSuccess.data;
                if (data != undefined && data != null) {
                    let chain_ = data.chain;
                    if (chain_ != undefined && chain_ != null) {
                        console.log("cashout========7 获取chain成功" + chain_);
                        this.chain = chain_;
                        let haveBindPhone = data.haveBindPhone;
                        if (haveBindPhone != undefined && haveBindPhone != null) {
                            if (!Boolean(haveBindPhone)) {
                                console.log("cashout========8 未绑定手机号");
                                let comp = <UnBindVerification>GameApp.Instance.uiManager.popUpFormByNameTo("UnBindVerification");
                                comp.initData(this.chain);
                            } else {
                                console.log("cashout========8 已绑定手机号");
                                let comp = <HaveBindVerification>GameApp.Instance.uiManager.popUpFormByNameTo("HaveBindVerification");
                                comp.initUI(this.chain, data.phoneNum);
                            }
                        }
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

}
