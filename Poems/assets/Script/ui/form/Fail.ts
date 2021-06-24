import BaseComponent from "../../component/BaseComponent";
import GameApp from "../../GameApp";
import { ActionNet } from "../../manager/httpTools/Action";
import CocosSDK from "../../sdk/CocosSDK";
import Globle from "../config/Global";
import { CallJsType } from "../config/SdkConfig";
import OpenUrlManager from "../manager/OpenUrlManager";
import AnswerItem from "../node/AnswerItem";
import QuestionOne from "../node/QuestionOne";
import CashOut from "./CashOut";
import GameLayer from "./GameLayer";
import Poems from "./Poems";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Fail extends BaseComponent {
    @property(cc.Node)
    btnClose: cc.Node = null;
    @property(cc.Label)
    countDown: cc.Label = null;
    @property(cc.Label)
    author: cc.Label = null;
    @property(cc.Node)
    titleNode: cc.Node = null;
    @property(cc.Layout)
    poemLayout: cc.Layout = null;

    private isButtonCanClick = true;

    onLoad() {
        super.onLoad();
        CocosSDK.showAdInfo(CallJsType.InfoAd_Passlevel_Fail_Type, 920 * Tools.getScreenHeightRate());

        this.addOnDestoryFunc(() => {
            return;
        });


        //刷新提现列表：
        if (GameApp.Instance.dataManager.isAuditStatus) {
            Globle.gainExchangeList(() => {
                let running = GameApp.Instance.uiManager.runningForm;
                if (running) {
                    let runningComp = <GameLayer>running.getComponent("GameLayer");
                    let cashOutComp = <CashOut>runningComp.tabArray[0];
                    cashOutComp.refreshCashOutList();
                }
            });
        }
    }

    start() {
        super.start();
    }

    init(data) {
        let poet = data.poet;
        this.author.string = `-${poet}`;
        let name = data.source;
        for (let i = 0; i < name.length; i++) {
            let node_ = <cc.Node>cc.instantiate(GameApp.Instance.uiManager.getPrefabByName("AnswerItem"));
            this.titleNode.addChild(node_);
            let comp = <AnswerItem>node_.getComponent("AnswerItem");
            comp.initUI(0, name[i], false);
        }

        let questionData = data.question;
        for (let i = 0; i < questionData.length; i++) {
            let questionNode: cc.Node = null;
            questionNode = this.poemLayout.node.children[i];
            let node_: cc.Node = null;
            if (!questionNode) {
                node_ = cc.instantiate(GameApp.Instance.uiManager.getPrefabByName("QuestionOne"));
                this.poemLayout.node.addChild(node_);
            } else {
                node_ = questionNode;
                node_.active = true;
            }
            let comp = <QuestionOne>node_.getComponent("QuestionOne");
            comp.initUI(i, questionData[i], false);
        }
    }

    clickContinueCallback() {
        GameApp.Instance.audioManager.playEffect("click", GameApp.Instance.dataManager.effectVolume);
        this.nodeRunOutAction();
        GameApp.Instance.dataManager.currentLevel++;
        GameApp.Instance.dataManager.save();
        GameApp.Instance.uiManager.callUIRefreshFunctionsWithName("Refresh_Poems_Info");
    }

    initUI(cashDountNums) {
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

    clickReviveCallback() {
        if (!this.isButtonCanClick) {
            return;
        }
        this.isButtonCanClick = false;
        CocosSDK.showRewardVideoAD(CallJsType.RewardAd_Fail_Revive_Close);
    }

    revive() {
        OpenUrlManager.Instance.nonStopCombo(new ActionNet((resFail) => {
            this.isButtonCanClick = true;
        }, (resSuccess) => {
            if (resSuccess.code == 0) {
                let data = resSuccess.data;
                if (!data) {
                    return;
                }
                Globle.gainAnswerInfo(() => {
                    GameApp.Instance.uiManager.callUIRefreshFunctionsWithName("Refresh_Poems_Info");
                    this.nodeRunOutAction();
                });
            }
        }));
    }

    clickCloseCallback() {
        if (!this.isButtonCanClick) {
            return;
        }
        this.isButtonCanClick = false;

        let answerProgressInfo = GameApp.Instance.dataManager.userGameInfo;
        let levelNums = answerProgressInfo.levelNum + 1;
        if (levelNums % 5 == 0) {
            CocosSDK.showRewardVideoAD(CallJsType.RewardAd_Passlevel_Skip_Close);
        } else {
            this.closeFuncWithVideo();
        }
    }

    closeFuncWithVideo() {
        Globle.gainAnswerInfo(() => {
            GameApp.Instance.uiManager.callUIRefreshFunctionsWithName("Refresh_Poems_Info");
            this.nodeRunOutAction();
        });
    }

    // update (dt) {}
}
