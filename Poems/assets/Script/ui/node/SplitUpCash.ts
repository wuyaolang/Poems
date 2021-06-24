import GameApp from "../../GameApp";
import GameLayer from "../form/GameLayer";
import TaskReward, { RewardType } from "../form/TaskReward";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SplitUpCash extends cc.Component {

    @property(cc.Node)
    redpackNode: cc.Node = null;
    @property(cc.Node)
    goldNode: cc.Node = null;
    @property(cc.ProgressBar)
    progress: cc.ProgressBar = null;
    @property(cc.Node)
    btnRecieve: cc.Node = null;
    @property(cc.Node)
    btnRecieved: cc.Node = null;
    @property(cc.Node)
    btnUnComplete: cc.Node = null;
    @property(cc.RichText)
    rate: cc.RichText = null;
    @property(cc.Label)
    nums: cc.Label = null;

    private myInfo = null;

    onLoad() {

    }

    start() {

    }

    initUI(info) {
        this.myInfo = info;
        this.redpackNode.active = this.myInfo.type == 2;
        this.goldNode.active = this.myInfo.type == 1;
        this.btnRecieve.active = this.myInfo.status == 3;
        this.btnRecieved.active = this.myInfo.status == 1;
        this.btnUnComplete.active = this.myInfo.status == 2;
        if (this.myInfo.type == 1) {
            this.nums.string = `x${this.myInfo.reward * 10000}`;
        } else if (this.myInfo.type == 2) {
            this.nums.string = `至少可瓜分${Tools.toFloat(this.myInfo.reward / 10000, 2)}元`;
        }

        this.rate.string = `<color=#F4606C>${this.myInfo.currentAsk}</c><color=#042D27>/${this.myInfo.maxAsk}</color>`;
        this.progress.progress = Tools.toFloat(this.myInfo.currentAsk, 2) / Tools.toFloat(this.myInfo.maxAsk, 2);
        if (this.progress.progress >= 1) {
            this.progress.progress = 1;
        }

    }

    clickUnCompleteCallback() {
        if (this.myInfo.species == 7) {
            //瓜分100万：
            let running = GameApp.Instance.uiManager.runningForm;
            if (running) {
                let comp = <GameLayer>running.getComponent("GameLayer");
                comp.poemsToggle.isChecked = true;
            }
        } else if (this.myInfo.species == 3) {
            //累计答题：
            let running = GameApp.Instance.uiManager.runningForm;
            if (running) {
                let comp = <GameLayer>running.getComponent("GameLayer");
                comp.poemsToggle.isChecked = true;
            }
        }
    }

    clickRecieveCallback() {
        let comp = <TaskReward>GameApp.Instance.uiManager.popUpFormByNameTo("TaskReward");
        comp.initUI(this.myInfo, RewardType.TaskReward);
    }
}
