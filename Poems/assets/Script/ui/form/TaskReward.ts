import BaseComponent from "../../component/BaseComponent";
import GameApp from "../../GameApp";
import { ActionNet } from "../../manager/httpTools/Action";
import CocosSDK from "../../sdk/CocosSDK";
import Globle from "../config/Global";
import { CallJsType } from "../config/SdkConfig";
import OpenUrlManager from "../manager/OpenUrlManager";
import { FlyCurrencyType } from "../node/FlyCurrency";
import Task from "./Task";

const { ccclass, property } = cc._decorator;

export enum RewardType {
    DailySignTaskReward = 0,//每日打卡任务奖励
    TaskReward = 1,//普通任务奖励：
}

@ccclass
export default class TaskReward extends BaseComponent {
    @property(cc.Label)
    gainNums: cc.Label = null;
    @property(cc.Node)
    btnClose: cc.Node = null;
    @property(cc.Label)
    countDown: cc.Label = null;

    private myInfo = null;
    private rewardType = RewardType.DailySignTaskReward;


    onLoad() {
        super.onLoad();
    }

    start() {
        super.start();
        CocosSDK.showAdInfo(CallJsType.InfoAd_Task_Reward_Type, 700 * Tools.getScreenHeightRate());

        this.addOnDestoryFunc(() => {
            CocosSDK.closeAdInfo(CallJsType.InfoAd_Task_Reward_Type);
        });
    }

    initUI(info, type) {
        this.rewardType = type;
        this.myInfo = info;
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

        //初始化：
        let des = "";
        if (this.rewardType == RewardType.TaskReward) {
            if (this.myInfo.type == 1) {
                des = `+${this.myInfo.reward * 10000}金币`;
            } else if (this.myInfo.type == 2) {
                des = `+${Tools.toFloat(this.myInfo.reward / 10000, 2)}元`;
            }
        } else if (this.rewardType == RewardType.DailySignTaskReward) {
            des = `+${this.myInfo.reward * 10000}金币`;
        }

        this.gainNums.string = des;
    }

    clickCloseCallback() {
        this.gainReward();
    }

    clickDobleRecieveCallback() {
        CocosSDK.showRewardVideoAD(CallJsType.RewardAd_Task_Reward_Close);
    }

    /**
     * 领取奖励：
     * @param isDouble 
     */
    gainReward(isDouble = false) {
        if (this.rewardType == RewardType.TaskReward) {
            OpenUrlManager.Instance.recieveTaskReward(new ActionNet((resFail) => {
            }, (resSuccess) => {
                if (resSuccess.code == 0) {
                    let data = resSuccess.data;
                    if (!data) {
                        return;
                    }

                    GameApp.Instance.dataManager.cashInfo = Tools.toFloat(Tools.toFloat(data.userAllGolds) / data.exRate, 2);
                    GameApp.Instance.dataManager.goldInfo = Math.floor(data.userAllMoney * data.exRate);
                    GameApp.Instance.uiManager.callUIRefreshFunctionsWithName("Refresh_User_Info");
                    Globle.getDailySignTaskList(() => {
                        Globle.getTaskList(() => {
                            GameApp.Instance.uiManager.callUIRefreshFunctionsWithName("Refresh_Task_ScrollView");
                            GameApp.Instance.uiManager.callUIRefreshFunctionsWithName("Refresh_RedPoint");
                        });
                    });
                    if (this.myInfo.type == 1) {
                        Globle.flyCurrency(Task.goldLogoPos, FlyCurrencyType.Gold);
                    } else if (this.myInfo.type == 2) {
                        Globle.flyCurrency(Task.redPackLogoPos, FlyCurrencyType.RedPack);
                    }
                    this.nodeRunOutAction();
                } else {
                    this.nodeRunOutAction();
                    GameApp.Instance.uiManager.showToast(resSuccess.msg);
                }
            }), this.myInfo.taskId, isDouble ? "1" : "0");
        } else if (this.rewardType == RewardType.DailySignTaskReward) {
            OpenUrlManager.Instance.recieveDailySignReward(new ActionNet((resFail) => {
            }, (resSuccess) => {
                if (resSuccess.code == 0) {
                    let data = resSuccess.data;
                    if (!data) {
                        return;
                    }
                    GameApp.Instance.dataManager.cashInfo = Tools.toFloat(Tools.toFloat(data.userAllGolds) / data.exRate, 2);
                    GameApp.Instance.dataManager.goldInfo = Math.floor(data.userAllMoney * data.exRate);
                    GameApp.Instance.uiManager.callUIRefreshFunctionsWithName("Refresh_User_Info");
                    Globle.getDailySignTaskList(() => {
                        Globle.getTaskList(() => {
                            GameApp.Instance.uiManager.callUIRefreshFunctionsWithName("Refresh_Task_ScrollView");
                            GameApp.Instance.uiManager.callUIRefreshFunctionsWithName("Refresh_RedPoint");
                        });
                    });
                    if (this.myInfo.type == 1) {
                        Globle.flyCurrency(Task.goldLogoPos, FlyCurrencyType.Gold);
                    } else if (this.myInfo.type == 2) {
                        Globle.flyCurrency(Task.redPackLogoPos, FlyCurrencyType.RedPack);
                    }
                    this.nodeRunOutAction();
                } else {
                    this.nodeRunOutAction();
                    GameApp.Instance.uiManager.showToast(resSuccess.msg);
                }
            }), this.myInfo.id, isDouble ? "1" : "0");
        }
    }

    // update (dt) {}
}
