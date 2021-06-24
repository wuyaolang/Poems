import BaseComponent from "../../component/BaseComponent";
import GameApp from "../../GameApp";
import { ActionNet } from "../../manager/httpTools/Action";
import OpenUrlManager from "../manager/OpenUrlManager";
import GetMoneyItemRecord from "../node/GetMoneyItemRecord";

const { ccclass, property } = cc._decorator;

export enum ExchangeType {
    Exchange_Ing = 0,//兑换中
    Exchange_Already = 1,//已兑换
}

@ccclass
export default class CashOutRecord extends BaseComponent {

    @property(cc.ScrollView)
    scrollview: cc.ScrollView = null;
    @property(cc.Node)
    noItem: cc.Node = null;
    @property(cc.Node)
    leftPage: cc.Node = null;
    @property(cc.Node)
    rightPage: cc.Node = null;

    private exchangeIngInfo = null;
    private exchangeAlreadyInfo = null;
    private currentIndex = ExchangeType.Exchange_Ing;

    onLoad() {
        super.onLoad();
    }

    start() {
        super.start();

        OpenUrlManager.Instance.exchangeRecord(new ActionNet((resFail) => {
        }, (resSuccess) => {
            if (resSuccess.code == 0) {
                this.exchangeIngInfo = resSuccess.data;
                this.refreshUI();
            }
        }), "0");

        OpenUrlManager.Instance.exchangeRecord(new ActionNet((resFail) => {
        }, (resSuccess) => {
            if (resSuccess.code == 0) {
                this.exchangeAlreadyInfo = resSuccess.data;
            }
        }), "1");
    }

    refreshUI() {
        this.leftPage.active = this.currentIndex == ExchangeType.Exchange_Ing;
        this.rightPage.active = this.currentIndex == ExchangeType.Exchange_Already;
        for (let i = 0; i < this.scrollview.content.children.length; i++) {
            this.scrollview.content.children[i].destroy();
        }
        this.scrollview.content.setContentSize(this.scrollview.content.getContentSize().width, 0);
        if (this.currentIndex == ExchangeType.Exchange_Ing) {
            if (this.exchangeIngInfo) {
                this.noItem.active = this.exchangeIngInfo.length == 0;
                if (this.exchangeIngInfo.length > 0) {
                    for (let i = 0; i < this.exchangeIngInfo.length; i++) {
                        let item_ = cc.instantiate(GameApp.Instance.uiManager.getPrefabByName("GetMoneyItemRecord"));
                        this.scrollview.content.addChild(item_);
                        item_.setPosition(cc.v2(0, -item_.height / 2 - i * -item_.height));
                        let comp = <GetMoneyItemRecord>item_.getComponent("GetMoneyItemRecord");
                        comp.setInforMation(this.exchangeIngInfo[i]);
                        let totalHeight = this.exchangeIngInfo.length * item_.height;
                        this.scrollview.content.setContentSize(this.scrollview.content.getContentSize().width, totalHeight);
                    }
                }
            }
        } else if (this.currentIndex = ExchangeType.Exchange_Already) {
            if (this.exchangeAlreadyInfo) {
                this.noItem.active = this.exchangeAlreadyInfo.length == 0;
                if (this.exchangeAlreadyInfo.length > 0) {
                    for (let i = 0; i < this.exchangeAlreadyInfo.length; i++) {
                        let item_ = cc.instantiate(GameApp.Instance.uiManager.getPrefabByName("GetMoneyItemRecord"));
                        this.scrollview.content.addChild(item_);
                        item_.setPosition(cc.v2(0, -item_.height / 2 - i * item_.height));
                        let comp = <GetMoneyItemRecord>item_.getComponent("GetMoneyItemRecord");
                        comp.setInforMation(this.exchangeAlreadyInfo[i]);
                        let totalHeight = this.exchangeAlreadyInfo.length * item_.height;
                        this.scrollview.content.setContentSize(this.scrollview.content.getContentSize().width, totalHeight);
                    }
                }
            }
        }
    }

    clickIngLeftCallback() {
        if (this.currentIndex == ExchangeType.Exchange_Ing) {
            return;
        }
        this.refreshUI();
    }

    clickIngRightCallback() {
        this.currentIndex = ExchangeType.Exchange_Already;
        this.refreshUI();
    }

    clickAlreadyLeftCallbacck() {
        this.currentIndex = ExchangeType.Exchange_Ing;
        this.refreshUI();
    }

    clickAlreadyRightCallback() {
        if (this.currentIndex == ExchangeType.Exchange_Already) {
            return;
        }
        this.refreshUI();
    }

    clickCloseCallback() {
        this.nodeRunOutAction();
    }

    // update (dt) {}
}
