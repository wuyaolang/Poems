import GameApp from "../../GameApp";
import TaskReward, { RewardType } from "../form/TaskReward";

const { ccclass, property } = cc._decorator;

export enum DailySignItemType {
    TimeOut = 0,//已过期
    Recieved = 1,//已领取
    ToRecieve = 2,//可领取
    WaitRecieve = 3,//等待领取
    FullDuty = 4,//全勤奖励
}

@ccclass
export default class DailySignItem extends cc.Component {
    @property(cc.Node)
    timeOutNode: cc.Node = null;
    @property(cc.Node)
    recievedNode: cc.Node = null;
    @property(cc.Node)
    toRecieveNode: cc.Node = null;
    @property(cc.Node)
    waiteRecieveNode: cc.Node = null;
    @property(cc.Node)
    fullDutyNode: cc.Node = null;
    @property(cc.Label)
    waitRecieveLabel: cc.Label = null;
    @property(cc.Label)
    fullDutyLabel: cc.Label = null;

    @property(cc.Label)
    timeOutGold: cc.Label = null;
    @property(cc.Label)
    recievedGold: cc.Label = null;
    @property(cc.Label)
    toRecieveGold: cc.Label = null;
    @property(cc.Label)
    waitRecieveGold: cc.Label = null;

    private itemType = DailySignItemType.TimeOut;
    private itemInfo = null;

    onLoad() {

    }

    start() {

    }

    initUI(type, info) {
        this.itemType = type;
        this.itemInfo = info;
        this.timeOutNode.active = this.itemType == DailySignItemType.TimeOut;
        this.recievedNode.active = this.itemType == DailySignItemType.Recieved;
        this.toRecieveNode.active = this.itemType == DailySignItemType.ToRecieve;
        this.waiteRecieveNode.active = this.itemType == DailySignItemType.WaitRecieve;
        this.fullDutyNode.active = this.itemType == DailySignItemType.FullDuty;

        this.timeOutGold.string = `+${info.reward * 10000}`;
        this.recievedGold.string = `+${info.reward * 10000}`;
        this.toRecieveGold.string = `+${info.reward * 10000}`;
        this.waitRecieveGold.string = `+${info.reward * 10000}`;

        this.waitRecieveLabel.string = `${info.onHour}:00`;
        this.fullDutyLabel.string = `${info.onHour}:00`;
    }

    clickCallback() {
        switch (this.itemType) {
            case DailySignItemType.TimeOut:
                GameApp.Instance.uiManager.showToast("该奖励已过期");
                break;
            case DailySignItemType.Recieved:
                GameApp.Instance.uiManager.showToast("该奖励已领取");
                break;
            case DailySignItemType.ToRecieve:
                let comp = <TaskReward>GameApp.Instance.uiManager.popUpFormByNameTo("TaskReward");
                comp.initUI(this.itemInfo, RewardType.DailySignTaskReward);
                break;
            case DailySignItemType.WaitRecieve:
                GameApp.Instance.uiManager.showToast(`请到${this.itemInfo.onHour}:00再来领取`);
                break;
            case DailySignItemType.FullDuty:
                if (this.itemInfo.status == 1) {
                    GameApp.Instance.uiManager.showToast("该奖励已过期");
                } else if (this.itemInfo.status == 1) {
                    GameApp.Instance.uiManager.showToast("该奖励已领取");
                } else if (this.itemInfo.status == 3) {
                    let comp = <TaskReward>GameApp.Instance.uiManager.popUpFormByNameTo("TaskReward");
                    comp.initUI(this.itemInfo, RewardType.DailySignTaskReward);
                } else if (this.itemInfo.status == 4) {
                    GameApp.Instance.uiManager.showToast(`请到${this.itemInfo.onHour}:00再来领取`);
                }
                break;
            default:
                GameApp.Instance.uiManager.showToast("该奖励已过期");
                break;
        }
    }
}
