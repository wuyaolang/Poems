import GameApp from "../../GameApp";
import Globle from "../config/Global";
import TaskReward, { RewardType } from "../form/TaskReward";
import DailySignItem, { DailySignItemType } from "./DailySignItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DailySign extends cc.Component {
    @property(cc.Node)
    lineNode: cc.Node = null;

    private dailySignInfo = null;
    private canRecieveInfo = null;

    onLoad() {

    }

    start() {
        this.initUI();
    }

    onDisable() {
        GameApp.Instance.uiManager.removeUIRefreshFunctionByName("Refresh_Daily_Sign_Task");
    }


    initUI() {
        GameApp.Instance.uiManager.registerUIRefreshFunctionWithName("Refresh_Daily_Sign_Task", this.node, () => {
            this.dailySignInfo = GameApp.Instance.dataManager.dailySignTaskInfo;
            for (let i = 0; i < this.dailySignInfo.length; i++) {
                let parent_ = this.lineNode.getChildByName(`Child${i + 1}`);
                let item_ = null;
                if (parent_.children.length > 0) {
                    item_ = parent_.children[0];
                } else {
                    item_ = <cc.Node>cc.instantiate(GameApp.Instance.uiManager.getPrefabByName("DailySignItem"));
                    parent_.addChild(item_);
                }

                let info = this.dailySignInfo[i];
                let type = DailySignItemType.TimeOut;
                if (info.type == 1) {
                    if (info.status == 1) {
                        type = DailySignItemType.TimeOut;
                    } else if (info.status == 2) {
                        type = DailySignItemType.Recieved;
                    } else if (info.status == 3) {
                        type = DailySignItemType.ToRecieve;
                        this.canRecieveInfo = info;
                    } else if (info.status == 4) {
                        type = DailySignItemType.WaitRecieve;
                    }
                } else if (info.type == 2) {
                    type = DailySignItemType.FullDuty;
                }
                let comp = <DailySignItem>item_.getComponent("DailySignItem");
                comp.initUI(type, info);
            }
        });

        GameApp.Instance.uiManager.callUIRefreshFunctionsWithName("Refresh_Daily_Sign_Task");

        this.schedule(() => {
            Globle.getDailySignTaskList(() => {
                GameApp.Instance.uiManager.callUIRefreshFunctionsWithName("Refresh_Daily_Sign_Task");
            });
        }, 60, cc.macro.REPEAT_FOREVER, 0);
    }

    clickRecieveCallback() {
        if (!this.canRecieveInfo) {
            GameApp.Instance.uiManager.showToast("现在不在可领取奖励的时间范围");
            return;
        }
        let comp = <TaskReward>GameApp.Instance.uiManager.popUpFormByNameTo("TaskReward");
        comp.initUI(this.canRecieveInfo, RewardType.DailySignTaskReward);
    }
}
