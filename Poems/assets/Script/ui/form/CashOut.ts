import BaseComponent from "../../component/BaseComponent";
import GameApp from "../../GameApp";
import { ActionNet } from "../../manager/httpTools/Action";
import CocosSDK from "../../sdk/CocosSDK";
import Globle from "../config/Global";
import CashOutManager from "../manager/CashOutManager";
import OpenUrlManager from "../manager/OpenUrlManager";
import CashOutItem from "../node/CashOutItem";
import GameLayer from "./GameLayer";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CashOut extends BaseComponent {
    @property(cc.ProgressBar)
    progress: cc.ProgressBar = null;
    @property(cc.Label)
    cashNumsComp: cc.Label = null;
    @property(cc.Sprite)
    iconSprite: cc.Sprite = null;
    @property(cc.Node)
    cashOutParent: cc.Node = null;
    @property(cc.Label)
    cashoutCondition: cc.Label = null;
    @property(cc.RichText)
    cashProgressRate: cc.RichText = null;
    @property(cc.Node)
    finguer: cc.Node = null;
    @property(cc.Label)
    goldNumsComp: cc.Label = null;

    public cashOutItemArray = [];//提现item存放的数组:
    public static currentSelectCashInfo = null;

    onLoad() {
        super.onLoad();
    }

    start() {
        super.start();
        CashOutManager.Instance.isCanclickNow = true;
        CashOutManager.Instance.slideStartPos = CocosSDK.getSliderStartPosition();
        this.initUserInfo();
    }

    initUserInfo() {
        //用户信息刷新：    
        GameApp.Instance.uiManager.registerUIRefreshFunctionWithName("Refresh_User_Info", this.cashNumsComp.node, () => {
            let cashInfo = GameApp.Instance.dataManager.cashInfo;
            if (cashInfo) {
                this.cashNumsComp.string = `${cashInfo}元`;
            } else if (cashInfo == 0) {
                this.cashNumsComp.string = `${0.00}元`;
            }
            let goldInfo = GameApp.Instance.dataManager.goldInfo;
            if (goldInfo) {
                this.goldNumsComp.string = `${goldInfo}`;
            } else if (goldInfo == 0) {
                this.goldNumsComp.string = `${0}`;
            }
        });
        GameApp.Instance.uiManager.callUIRefreshFunctionsWithName("Refresh_User_Info");

        //刷新头像信息：
        GameApp.Instance.uiManager.registerUIRefreshFunctionWithName("Refresh_User_Icon", this.cashNumsComp.node, () => {
            //用户头像展示：
            if (CocosSDK.isLogin()) {
                if (!CocosSDK.getWXInfo()) {
                    return;
                }
                let wechatInfo = JSON.parse(CocosSDK.getWXInfo());
                cc.loader.load({ url: wechatInfo.iconurl + '?file=a.png', type: 'png' }, (err, texture) => {
                    let sp1 = new cc.SpriteFrame(texture);
                    this.iconSprite.spriteFrame = sp1;
                });
            }
        });
        GameApp.Instance.uiManager.callUIRefreshFunctionsWithName("Refresh_User_Icon");
    }

    /**
     * 刷新提现内容：
     */
    initCashOutList() {
        let isSelect = false;
        let exchangeInfo = GameApp.Instance.dataManager.exchangeList;
        for (let i = 0; i < this.cashOutParent.children.length; i++) {
            if (i >= exchangeInfo.length) {
                break;
            }

            let node_ = cc.instantiate(GameApp.Instance.uiManager.getPrefabByName("CashOutItem"));
            this.cashOutParent.children[i].addChild(node_);
            let comp = <CashOutItem>node_.getComponent("CashOutItem");
            this.cashOutItemArray.push(comp);
            let info = exchangeInfo[i];
            if ((info.status == 0 || info.status == 1) && !isSelect) {
                isSelect = true;
                comp.initUI(info, true);
                CashOut.currentSelectCashInfo = info;
            } else {
                comp.initUI(info, false);
            }
        }
        this.refreshCashOutCondition();
    }

    refreshCashOutList() {
        let exchangeInfo = GameApp.Instance.dataManager.exchangeList;
        for (let i = 0; i < this.cashOutParent.children.length; i++) {
            if (i >= exchangeInfo.length) {
                break;
            }
            let info = exchangeInfo[i];
            this.cashOutItemArray[i].initUI(info, info.id == CashOut.currentSelectCashInfo.id);
            if (info.id == CashOut.currentSelectCashInfo.id) {
                CashOut.currentSelectCashInfo = info;
            }
        }
        this.refreshCashOutCondition();
    }

    refreshCashOutCondition() {
        //刷新提现条件：
        this.cashoutCondition.string = CashOut.currentSelectCashInfo.condition;
        let fulfillConditionBean = CashOut.currentSelectCashInfo.fulfillConditionBean;
        if (fulfillConditionBean) {
            let obj = fulfillConditionBean.obj;
            if (obj) {
                let current = obj.current;
                let max = obj.max;
                this.cashProgressRate.string = `<color=#F4606C>${current}</c><color=#333333>/${max}</color>`;
                this.progress.progress = Tools.toFloat(Tools.toFloat(current) / max);
                if (this.progress.progress >= 1) {
                    this.progress.progress = 1;
                }
            }
        } else {
            let cashNums = GameApp.Instance.dataManager.cashInfo;
            this.cashProgressRate.string = `<color=#F4606C>${cashNums}</c><color=#333333>/${100.00}</color>`;
            this.progress.progress = Tools.toFloat(cashNums / 100.00);
            if (this.progress.progress >= 1) {
                this.progress.progress = 1;
            }
        }
    }

    clickCompleteCallback() {
        let running = GameApp.Instance.uiManager.runningForm;
        if (running) {
            let comp = <GameLayer>running.getComponent("GameLayer");
            comp.poemsToggle.isChecked = true;
        }
    }


    clickCashOutCallback() {
        if (!CocosSDK.isLogin()) {
            GameApp.Instance.uiManager.popUpFormByName("WxLogin");
            return;
        }

        if (!CashOutManager.Instance.isCanclickNow) {
            return;
        }

        if (!CashOut.currentSelectCashInfo) {
            GameApp.Instance.uiManager.showToast("已完成所有提现，请明天再来提现");
            return;
        }

        GameApp.Instance.dataManager.isCashOutFinguerShow = 0;
        GameApp.Instance.dataManager.save();
        this.finguer.active = false;
        CocosSDK.showRewardVideoAD(22);
    }

    cashOutCallback() {
        console.log("CallJsType 12345");
        let info = CashOut.currentSelectCashInfo;
        if (info.withdraw) {
            if (info.check == 1) {
                //秒到账
                let deviceToken = CocosSDK.getDeviceToken();
                GameApp.Instance.uiManager.showLoading(Globle.LoadingAni);
                OpenUrlManager.Instance.cashOutExchange(new ActionNet((resFail) => {
                    GameApp.Instance.uiManager.hideLoading();
                    GameApp.Instance.uiManager.showToast("提现失败");
                }, (resSuccess) => {
                    if (resSuccess.code == 0) {
                        GameApp.Instance.uiManager.hideLoading();
                        GameApp.Instance.uiManager.showToast("提现成功");
                        Globle.gainExchangeList(() => {
                            this.refreshCashOutList();
                        });
                    } else {
                        GameApp.Instance.uiManager.hideLoading();
                        if (resSuccess.msg) {
                            GameApp.Instance.uiManager.showToast(resSuccess.msg);
                        } else {
                            GameApp.Instance.uiManager.showToast("网络异常");
                        }
                    }
                }), info.id, "", deviceToken);
            } else {
                console.log("CallJsType 123456");
                CashOutManager.Instance.startSlideVerificate(() => {
                    CashOutManager.Instance.showCaptchaAndCallback();
                });
            }
        } else {
            if (info.status == 0) {
                GameApp.Instance.uiManager.showToast("未满足提现条件");
            }
        }
    }

    clickSettingCallback() {
        GameApp.Instance.uiManager.popUpFormByName("Setting");
    }

    clickCashOutRecordCallback() {
        GameApp.Instance.uiManager.popUpFormByName("CashOutRecord");
    }

    clickExchangeCallback() {
        if (GameApp.Instance.dataManager.goldInfo) {
            GameApp.Instance.uiManager.popUpFormByName("ExchangeCash");
        } else {
            GameApp.Instance.uiManager.showToast("您还没有获得金币，快去完成任务获取金币吧");
        }
    }
}
