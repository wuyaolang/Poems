import BaseComponent from "../../component/BaseComponent";
import GameApp from "../../GameApp";
import { ActionNet } from "../../manager/httpTools/Action";
import CocosSDK from "../../sdk/CocosSDK";
import Globle from "../config/Global";
import OpenUrlManager from "../manager/OpenUrlManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Logoff extends BaseComponent {

    onLoad() {
        super.onLoad();
    }

    start() {
        super.start();
    }

    clickCancleCallback() {
        this.nodeRunOutAction();
    }

    clickSureCallback() {
        GameApp.Instance.uiManager.showLoading(Globle.LoadingAni);
        setTimeout(() => {
            GameApp.Instance.uiManager.hideLoading();
        }, 5000);
        OpenUrlManager.Instance.userLogoff(new ActionNet((resFail) => {
            GameApp.Instance.uiManager.hideLoading();
            GameApp.Instance.uiManager.showToast("注销账户失败");
            this.nodeRunOutAction();
        }, (resSuccess) => {
            GameApp.Instance.uiManager.hideLoading();
            if (resSuccess.code == 0) {
                GameApp.Instance.uiManager.showToast("注销账户成功");
                CocosSDK.registerLogoffCallback(() => {
                    GameApp.Instance.uiManager.removeAllPopUpForm();//删掉所有的弹窗。
                });
                CocosSDK.loginOff();
            } else {
                GameApp.Instance.uiManager.showToast("注销账户失败");
            }
        }));
    }

    // update (dt) {}
}
