import Globle from "../config/Global";
import GameApp from "../../GameApp";
import BaseComponent from "../../component/BaseComponent";
import CocosSDK from "../../sdk/CocosSDK";
import { CallJavaType } from "../config/SdkConfig";

const { ccclass, property } = cc._decorator;

/**
 * 该界面是在Preload界面上加载的，这时候还未到GameScene界面，所以不需要继承BaseComponent来管理。
 */
@ccclass
export default class Setting extends BaseComponent {
    @property(cc.Node)
    logoffUI: cc.Node = null;
    @property(cc.Node)
    logoutUI: cc.Node = null;
    @property(cc.Node)
    musicOnNode: cc.Node = null;
    @property(cc.Node)
    musicOffNode: cc.Node = null;
    @property(cc.Label)
    musicDes: cc.Label = null;
    @property(cc.Node)
    effectOnNode: cc.Node = null;
    @property(cc.Node)
    effectOffNode: cc.Node = null;
    @property(cc.Label)
    effectDes: cc.Label = null;

    private isCanClick = true;

    onLoad() {
        super.onLoad();
    }

    start() {
        super.start();
        this.initContact();
        this.refreshMusicAndEffect();

        this.logoffUI.active = CocosSDK.isLogin() && GameApp.Instance.dataManager.isAuditStatus;
        this.logoutUI.active = CocosSDK.isLogin() && GameApp.Instance.dataManager.isAuditStatus;
    }

    /**
     * 退出登录
     */
    logout() {
        if (!this.isCanClick) {
            return;
        }
        this.isCanClick = false;
        CocosSDK.registerLogoutSuccessCallback(() => {
            GameApp.Instance.uiManager.removeAllPopUpForm();//删掉所有的弹窗。
            GameApp.Instance.uiManager.popUpFormByName("WxLogin");
        });
        Globle.logout(true, (res) => {
            if (res.code == 0) {
                if (!res.data) {
                    return;
                }
                if (!res.data.defaultToken) {
                    return;
                }
                CocosSDK.outLogin(res.data.defaultToken);
                //todo 调用是否能完接口
                GameApp.Instance.uiManager.showToast("退出成功");
            } else {
                this.isCanClick = true;
                if (res.msg) {
                    GameApp.Instance.uiManager.showToast(res.msg);
                }
            }
        });
    }

    /**
     * 设置按钮的点击事件
     * @param event
     */
    btnClick(event) {
        GameApp.Instance.audioManager.playEffect("click", GameApp.Instance.dataManager.effectVolume);
        let btnName = event.target.name;
        cc.log("点击按钮名称===》" + btnName)
        switch (btnName) {
            case "yhxi":
                CocosSDK.jumpActivity(CallJavaType.UserAssignment);
                break;
            case "yszc":
                CocosSDK.jumpActivity(CallJavaType.PrivatePolicy);
                break;
            case "yhfk":
                CocosSDK.jumpActivity(CallJavaType.UserFeedBack);
                break;
            case "tcdl":
                this.logout();
                break;
            case "logoff":
                GameApp.Instance.uiManager.popUpFormByName("Logoff");
                this.nodeRunOutAction();
                break;
            case "BtnClose":
                this.nodeRunOutAction();
                break;
            default:
                break
        }
    }

    initContact() {
        let qqNumComp = this.node.getChildByName("BG").getChildByName("Contact").getChildByName("QQ").getComponent(cc.Label);
        qqNumComp.string = String(cc.sys.isNative ? CocosSDK.getConfig("contact_us") : "2724882892");
    }

    refreshMusicAndEffect() {
        this.musicOnNode.active = GameApp.Instance.dataManager.musicVolume != 0;
        this.musicOffNode.active = GameApp.Instance.dataManager.musicVolume == 0;
        this.musicDes.string = GameApp.Instance.dataManager.musicVolume == 0 ? `音乐：关` : `音乐：开`;

        this.effectOnNode.active = GameApp.Instance.dataManager.effectVolume != 0;
        this.effectOffNode.active = GameApp.Instance.dataManager.effectVolume == 0;
        this.effectDes.string = GameApp.Instance.dataManager.effectVolume == 0 ? `音效：关` : `音效：开`;

        GameApp.Instance.audioManager.setMusicVolume(Number(GameApp.Instance.dataManager.musicVolume));
        GameApp.Instance.audioManager.setEffectVolume(Number(GameApp.Instance.dataManager.effectVolume));
    }

    clickMusicCallback() {
        GameApp.Instance.audioManager.playEffect("click", GameApp.Instance.dataManager.effectVolume);
        if (GameApp.Instance.dataManager.musicVolume == 0) {
            GameApp.Instance.dataManager.musicVolume = 1;
            GameApp.Instance.dataManager.save();
            GameApp.Instance.audioManager.setMusicVolume(1);
        } else {
            GameApp.Instance.dataManager.musicVolume = 0;
            GameApp.Instance.dataManager.save();
            GameApp.Instance.audioManager.setMusicVolume(0);
        }
        this.refreshMusicAndEffect();
    }

    clickEffectCallback() {
        GameApp.Instance.audioManager.playEffect("click", GameApp.Instance.dataManager.effectVolume);
        if (GameApp.Instance.dataManager.effectVolume == 0) {
            GameApp.Instance.dataManager.effectVolume = 0.6;
            GameApp.Instance.dataManager.save();
        } else {
            GameApp.Instance.dataManager.effectVolume = 0;
            GameApp.Instance.dataManager.save();
        }
        this.refreshMusicAndEffect();
    }
}
