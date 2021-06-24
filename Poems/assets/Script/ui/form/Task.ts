import BaseComponent from "../../component/BaseComponent";
import GameApp from "../../GameApp";
import Globle from "../config/Global";
import SplitUpCash from "../node/SplitUpCash";
import TaskItem from "../node/TaskItem";

const { ccclass, property } = cc._decorator;

export enum TaskType {
    AnswerTask = 0,
    DailyTask = 1,
}

@ccclass
export default class Task extends BaseComponent {
    @property(cc.ScrollView)
    scrollview: cc.ScrollView = null;
    @property(cc.Label)
    cashNums: cc.Label = null;
    @property(cc.Label)
    goldNums: cc.Label = null;
    @property(cc.Node)
    dailyTaskRedPoint: cc.Node = null;
    @property(cc.Label)
    dailyTaskRedPointNum: cc.Label = null;
    @property(cc.Node)
    answerTaskRedPoint: cc.Node = null;
    @property(cc.Label)
    answerTaskRedPointNum: cc.Label = null;
    @property(cc.Node)
    redPackLogo: cc.Node = null;
    @property(cc.Node)
    goldLogo: cc.Node = null;

    private currentFocusType = TaskType.DailyTask;
    private scrollViewHeight = 0;
    private itemDis = 20;//每两个Item之间的距离：
    public static redPackLogoPos = null;
    public static goldLogoPos = null;

    onLoad() {
        super.onLoad();
    }

    start() {
        super.start();
        this.initUserInfo();
        Globle.getDailySignTaskList(() => {
            Globle.getTaskList(() => {
                this.refreshTaskScrollView();
                GameApp.Instance.uiManager.callUIRefreshFunctionsWithName("Refresh_RedPoint");
            });
        });
        this.initRedPoint();

        setTimeout(() => {
            if (!this.node) {
                return;
            }
            Task.redPackLogoPos = this.redPackLogo.convertToWorldSpaceAR(cc.v2(0, 0));
            Task.goldLogoPos = this.goldLogo.convertToWorldSpaceAR(cc.v2(0, 0));
        }, 1000);
    }

    initRedPoint() {
        GameApp.Instance.uiManager.registerUIRefreshFunctionWithName("Refresh_RedPoint", this.node, () => {
            let redAllInfo = GameApp.Instance.dataManager.redPointSubTaskInfo;
            if (!redAllInfo) {
                return;
            }
            if (JSON.stringify(redAllInfo) == "{}") {
                this.dailyTaskRedPoint.active = false;
                this.dailyTaskRedPointNum.string = String(0);
                this.answerTaskRedPoint.active = false;
                this.answerTaskRedPointNum.string = String(0);
                return;
            }
            let dailyNum = redAllInfo["1"];
            if (dailyNum) {
                this.dailyTaskRedPoint.active = Number(dailyNum) >= 1;
                this.dailyTaskRedPointNum.string = String(dailyNum);
            }
            let answerNum = redAllInfo["2"];
            if (answerNum) {
                this.answerTaskRedPoint.active = Number(answerNum) >= 1;
                this.answerTaskRedPointNum.string = String(answerNum);
            }
            console.log("");

        });
        GameApp.Instance.uiManager.callUIRefreshFunctionsWithName("Refresh_RedPoint");
    }

    refreshTaskScrollView() {
        GameApp.Instance.uiManager.registerUIRefreshFunctionWithName("Refresh_Task_ScrollView", this.scrollview, () => {
            for (let i = 0; i < this.scrollview.content.children.length; i++) {
                this.scrollview.content.children[i].destroy();
            }
            this.scrollViewHeight = 0;
            this.scrollview.content.setContentSize(this.scrollview.node.width, this.scrollViewHeight);
            if (this.currentFocusType == TaskType.DailyTask) {
                let dailySignNode = <cc.Node>cc.instantiate(GameApp.Instance.uiManager.getPrefabByName("DailySign"));
                this.scrollview.content.addChild(dailySignNode);
                dailySignNode.setPosition(cc.v2(0, -this.scrollViewHeight - dailySignNode.height / 2 - this.itemDis));
                this.scrollViewHeight += dailySignNode.height + this.itemDis;

                let dailyTaskInfo = GameApp.Instance.dataManager.dailyTaskInfo;
                for (let i = 0; i < dailyTaskInfo.length; i++) {
                    let node_ = cc.instantiate(GameApp.Instance.uiManager.getPrefabByName("TaskItem"));
                    this.scrollview.content.addChild(node_);
                    node_.setPosition(cc.v2(0, -this.scrollViewHeight - node_.height / 2 - this.itemDis));
                    this.scrollViewHeight += node_.height + this.itemDis;
                    let comp = <TaskItem>node_.getComponent("TaskItem");
                    comp.initUI(dailyTaskInfo[i]);
                }
            } else if (this.currentFocusType == TaskType.AnswerTask) {
                let answerTaskInfo = GameApp.Instance.dataManager.answerTaskInfo;
                for (let i = 0; i < answerTaskInfo.length; i++) {
                    if (answerTaskInfo[i].species == 7) {
                        let splitTaskNode = <cc.Node>cc.instantiate(GameApp.Instance.uiManager.getPrefabByName("SplitUpCash"));
                        this.scrollview.content.addChild(splitTaskNode);
                        let dailySignComp = <SplitUpCash>splitTaskNode.getComponent("SplitUpCash");
                        dailySignComp.initUI(answerTaskInfo[i]);
                        splitTaskNode.setPosition(cc.v2(0, -this.scrollViewHeight - splitTaskNode.height / 2 - this.itemDis));
                        this.scrollViewHeight += splitTaskNode.height + this.itemDis;
                        continue;
                    }
                    let node_ = cc.instantiate(GameApp.Instance.uiManager.getPrefabByName("TaskItem"));
                    this.scrollview.content.addChild(node_);
                    node_.setPosition(cc.v2(0, -this.scrollViewHeight - node_.height / 2 - this.itemDis));
                    this.scrollViewHeight += node_.height + this.itemDis;
                    let comp = <TaskItem>node_.getComponent("TaskItem");
                    comp.initUI(answerTaskInfo[i]);
                }
            }
            this.scrollview.content.setContentSize(this.scrollview.node.width, this.scrollViewHeight);
        });

        GameApp.Instance.uiManager.callUIRefreshFunctionsWithName("Refresh_Task_ScrollView");
    }

    initUserInfo() {
        GameApp.Instance.uiManager.registerUIRefreshFunctionWithName("Refresh_User_Info", this.cashNums.node, () => {
            let cashInfo = GameApp.Instance.dataManager.cashInfo;
            if (cashInfo) {
                this.cashNums.string = `${cashInfo}元`;
            } else if (cashInfo == 0) {
                this.cashNums.string = `${0.00}元`;
            }
            let goldInfo = GameApp.Instance.dataManager.goldInfo;
            if (goldInfo) {
                this.goldNums.string = `${goldInfo}`;
            } else if (goldInfo == 0) {
                this.goldNums.string = `${0}`;
            }
        });
        GameApp.Instance.uiManager.callUIRefreshFunctionsWithName("Refresh_User_Info");
    }

    clickAnswerTaskCallback() {
        if (this.currentFocusType == TaskType.AnswerTask) {
            return;
        }
        this.currentFocusType = TaskType.AnswerTask;
        GameApp.Instance.uiManager.callUIRefreshFunctionsWithName("Refresh_Task_ScrollView");
    }

    clickDailyTaskCallback() {
        if (this.currentFocusType == TaskType.DailyTask) {
            return;
        }
        this.currentFocusType = TaskType.DailyTask;
        GameApp.Instance.uiManager.callUIRefreshFunctionsWithName("Refresh_Task_ScrollView");
    }

    clickSettingCallback() {
        GameApp.Instance.uiManager.popUpFormByName("Setting");
    }
}
