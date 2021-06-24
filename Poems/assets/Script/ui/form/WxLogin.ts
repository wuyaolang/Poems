import Globle from "../config/Global";
import GameApp from "../../GameApp";
import BaseComponent from "../../component/BaseComponent";
import CashOut from "./CashOut";
import GameLayer from "./GameLayer";
import Poems from "./Poems";
import CocosSDK from "../../sdk/CocosSDK";
import { CallJsType } from "../config/SdkConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class WxLogin extends BaseComponent {

    @property(cc.Node)
    loginNode: cc.Node = null;

    onLoad() {
        super.onLoad();
    }

    start() {
        super.start();
    }

    wxLogin() {
        CocosSDK.registerLoginSuccessCallback(() => {
            setTimeout(() => {
                GameApp.Instance.dataManager.isLoginSuccess = 1;
                GameApp.Instance.dataManager.save();
                GameApp.Instance.uiManager.hideLoading();
                this.nodeRunOutAction();
                this.refreshInfo();
                console.log("==========>>>>" + CocosSDK.getParams());
            }, 100);
        });

        CocosSDK.registerWechatAuthorizeSuccessCallback(() => {
            let wxinfo = CocosSDK.getWXInfo();
            Globle.userLogin(wxinfo, (res) => {
                if (res.code == 0) {
                    GameApp.Instance.uiManager.showToast("登录成功");
                    CocosSDK.setUserToken(res.data.token);
                    //todo 刷新用户数据 最好延迟下
                } else {
                    if (res.msg) {
                        GameApp.Instance.uiManager.showToast(res.msg);
                    }
                }
            });
        });

        GameApp.Instance.uiManager.showLoading(Globle.LoadingAni);
        setTimeout(() => {
            GameApp.Instance.uiManager.hideLoading();
        }, 5000);
        if (cc.sys.isNative) {
            CocosSDK.wxLogin();
        } else {
            window["CallJs"](String(CallJsType.LoginSuccess));
        }
    }

    refreshInfo() {
        Globle.gainAnswerInfo(() => {
            GameApp.Instance.uiManager.callUIRefreshFunctionsWithName("Refresh_Poems_Info");
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
        GameApp.Instance.uiManager.callUIRefreshFunctionsWithName("Refresh_User_Icon");
    }

    // update (dt) {}
}
