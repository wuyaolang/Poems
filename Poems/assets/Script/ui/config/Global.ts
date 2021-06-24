import GameApp from "../../GameApp";
import { ActionNet } from "../../manager/httpTools/Action";
import CocosSDK from "../../sdk/CocosSDK";
import CashOut from "../form/CashOut";
import ExchangeCash from "../form/ExchangeCash";
import Fail from "../form/Fail";
import GameLayer from "../form/GameLayer";
import Passlevel from "../form/Passlevel";
import TaskReward from "../form/TaskReward";
import OpenUrlManager from "../manager/OpenUrlManager";
import FlyCurrency from "../node/FlyCurrency";
import TaskItem from "../node/TaskItem";
import { AdType, CallJavaType, CallJsType } from "./SdkConfig";

export default class Globle {
    constructor() {

    }

    static LoadingAni: Function = (node) => {
        let node_loading = new cc.Node();
        node_loading.scale = 1.2;
        node.addChild(node_loading);
        if (node_loading && node) {
            node_loading.runAction(cc.repeatForever(cc.rotateBy(5, 360)));
            let comp = node_loading.addComponent(cc.Sprite);
            let sp = GameApp.Instance.uiManager.getSpriteByName("loading");
            if (comp && sp) {
                comp.spriteFrame = sp;
            }
        }
    };

    /**
     * 预加载成功的回调都在这里做。保证Preload界面没有附加逻辑：
     */
    static afterPreloadCallback() {
        Globle.registerEvent();
        if (GameApp.Instance.dataManager.isShowAgereement) {
            let node = cc.instantiate(GameApp.Instance.uiManager.getPrefabByName("Assignment"));
            cc.director.getScene().addChild(node);
            CocosSDK.registerAgreeAsignmentCallback(() => {//安卓启动页结束回调
                setTimeout(() => {
                    GameApp.Instance.dataManager.isShowAgereement = false;
                    GameApp.Instance.dataManager.save();
                    let assign = cc.director.getScene().getChildByName("Assignment");
                    if (assign) {
                        assign.destroy();
                    }
                    GameApp.Instance.dataManager.isAuditStatus = false;/*CocosSDK.isShowView("show_ad_audit");*/
                    if (GameApp.Instance.dataManager.isAuditStatus) {
                        GameApp.Instance.uiManager.replaceSceneWithRunningForm("GameLayer");
                    } else {
                        GameApp.Instance.uiManager.replaceSceneWithRunningForm("Poems");
                    }
                }, 100);
            });
        } else {
            CocosSDK.registerAgreeAsignmentCallback(() => {//安卓启动页结束回调
                GameApp.Instance.dataManager.isAuditStatus = false/*CocosSDK.isShowView("show_ad_audit");*/
                if (GameApp.Instance.dataManager.isAuditStatus) {
                    GameApp.Instance.uiManager.replaceSceneWithRunningForm("GameLayer");
                } else {
                    GameApp.Instance.uiManager.replaceSceneWithRunningForm("Poems");
                }
            });

            if (cc.sys.OS_ANDROID == cc.sys.os) {
                CocosSDK.jumpActivity(CallJavaType.SplashActivity);
            } else {
                window["CallJs"](String(CallJavaType.SplashActivity));
            }
        }
    }

    static registerEvent() {
        CocosSDK.registerAdCloseCallback((adtype, tag) => {
            if (adtype == AdType.RewardAd) {
                if (tag == CallJsType.RewardAd_Exit_App_Close) {
                    setTimeout(() => {
                        GameApp.Instance.uiManager.popUpFormByName("ExitGame");
                    }, 100);
                } else if (tag == CallJsType.RewardAd_To_Foreground_Close) {

                } else if (tag == CallJsType.RewardAd_Prop_Tips_Close) {
                    setTimeout(() => {
                    }, 100);
                } else if (tag == CallJsType.RewardAd_Fail_Revive_Close) {
                    setTimeout(() => {
                        let form = GameApp.Instance.uiManager.getPopUpFormByName("Fail");
                        if (form) {
                            let comp = <Fail>form.getComponent("Fail");
                            comp.revive();
                        }
                    }, 100);
                } else if (tag == CallJsType.RewardAd_Fail_PopRed_Close) {
                    setTimeout(() => {
                    }, 100);
                } else if (tag == CallJsType.RewardAd_Passlevel_Close) {
                    setTimeout(() => {
                        let form = GameApp.Instance.uiManager.getPopUpFormByName("Passlevel");
                        if (form) {
                            let comp = <Passlevel>form.getComponent("Passlevel");
                            comp.doubleRecieve();
                        }
                    });
                } else if (tag == CallJsType.RewardAd_Passlevel_Skip_Close) {
                    setTimeout(() => {
                        let form = GameApp.Instance.uiManager.getPopUpFormByName("Passlevel");
                        let form_ = GameApp.Instance.uiManager.getPopUpFormByName("Fail");
                        if (form) {
                            let comp = <Passlevel>form.getComponent("Passlevel");
                            comp.closeFuncWithVideo();
                        }
                        if (form_) {
                            let comp = <Fail>form_.getComponent("Fail");
                            comp.closeFuncWithVideo();
                        }
                    }, 100);
                } else if (tag == CallJsType.RewardAd_CashOut_Close) {
                    setTimeout(() => {
                        console.log("CallJsType 123");
                        let running = GameApp.Instance.uiManager.runningForm;
                        if (running) {
                            console.log("CallJsType 1234");
                            let runningComp = <GameLayer>running.getComponent("GameLayer");
                            let cashOutComp = <CashOut>runningComp.tabArray[0];
                            cashOutComp.cashOutCallback();
                        }
                    }, 100);
                } else if (tag == CallJsType.RewardAd_Exchange_Gold_Close) {
                    setTimeout(() => {
                        let exchangeCash = GameApp.Instance.uiManager.getPopUpFormByName("ExchangeCash");
                        if (exchangeCash) {
                            let comp = <ExchangeCash>exchangeCash.getComponent("ExchangeCash");
                            comp.afterVideoCallback();
                        }
                    });
                } else if (tag == CallJsType.RewardAd_Task_Reward_Close) {
                    setTimeout(() => {
                        let taskReward = GameApp.Instance.uiManager.getPopUpFormByName("TaskReward");
                        if (taskReward) {
                            let comp = <TaskReward>taskReward.getComponent("TaskReward");
                            comp.gainReward(true);
                        }
                    }, 100);
                } else if (tag == CallJsType.RewardAd_Task_Close) {
                    setTimeout(() => {
                        Globle.addVideo(() => {
                            let comp = <TaskItem>GameApp.Instance.dataManager.videoTaskItem;
                            comp.afterVideo();
                        });
                    });
                }
            }
        });

        CocosSDK.registerAdSkipCallback((adtype, tag) => {
            if (adtype == AdType.RewardAd) {
                if (tag == CallJsType.RewardAd_Exit_App_Skip) {
                    setTimeout(() => {
                        GameApp.Instance.uiManager.popUpFormByName("ExitGame");
                    }, 100);
                } else if (tag == CallJsType.RewardAd_To_Foreground_Skip) {

                } else if (tag == CallJsType.RewardAd_Prop_Tips_Skip) {
                    setTimeout(() => {
                        let running = GameApp.Instance.uiManager.runningForm;
                        if (running) {
                        }
                    }, 100);
                } else if (tag == CallJsType.RewardAd_Fail_Revive_Skip) {
                    setTimeout(() => {
                        let form = GameApp.Instance.uiManager.getPopUpFormByName("Fail");
                        if (form) {
                            let comp = <Fail>form.getComponent("Fail");
                            comp.revive();
                        }
                    }, 100);
                } else if (tag == CallJsType.RewardAd_Fail_PopRed_Skip) {
                    setTimeout(() => {
                        let running = GameApp.Instance.uiManager.runningForm;
                        if (running) {
                        }
                    }, 100);
                } else if (tag == CallJsType.RewardAd_Passlevel_Skip) {
                    setTimeout(() => {
                        let form = GameApp.Instance.uiManager.getPopUpFormByName("Passlevel");
                        if (form) {
                            let comp = <Passlevel>form.getComponent("Passlevel");
                            comp.doubleRecieve();
                        }
                    });
                } else if (tag == CallJsType.RewardAd_Passlevel_Skip_Skip) {
                    setTimeout(() => {
                        let form = GameApp.Instance.uiManager.getPopUpFormByName("Passlevel");
                        let form_ = GameApp.Instance.uiManager.getPopUpFormByName("Fail");
                        if (form) {
                            let comp = <Passlevel>form.getComponent("Passlevel");
                            comp.closeFuncWithVideo();
                        }
                        if (form_) {
                            let comp = <Fail>form_.getComponent("Fail");
                            comp.closeFuncWithVideo();
                        }
                    }, 100);
                } else if (tag == CallJsType.RewardAd_CashOut_Skip) {
                    setTimeout(() => {
                        console.log("CallJsType 123");
                        let running = GameApp.Instance.uiManager.runningForm;
                        if (running) {
                            console.log("CallJsType 1234");
                            let runningComp = <GameLayer>running.getComponent("GameLayer");
                            let cashOutComp = <CashOut>runningComp.tabArray[0];
                            cashOutComp.cashOutCallback();
                        }
                    }, 100);
                } else if (tag == CallJsType.RewardAd_Exchange_Gold_Skip) {
                    setTimeout(() => {
                        let exchangeCash = GameApp.Instance.uiManager.getPopUpFormByName("ExchangeCash");
                        if (exchangeCash) {
                            let comp = <ExchangeCash>exchangeCash.getComponent("ExchangeCash");
                            comp.afterVideoCallback();
                        }
                    });
                } else if (tag == CallJsType.RewardAd_Task_Reward_Skip) {
                    setTimeout(() => {
                        let taskReward = GameApp.Instance.uiManager.getPopUpFormByName("TaskReward");
                        if (taskReward) {
                            let comp = <TaskReward>taskReward.getComponent("TaskReward");
                            comp.gainReward(true);
                        }
                    }, 100);
                } else if (tag == CallJsType.RewardAd_Task_Skip) {
                    setTimeout(() => {
                        Globle.addVideo(() => {
                            let comp = <TaskItem>GameApp.Instance.dataManager.videoTaskItem;
                            comp.afterVideo();
                        });
                    });
                }
            }
        });

        CocosSDK.registerInfoAdPreloadResultCallback((type) => {
            switch (type) {
                default:
                    break;
            }
        });

        CocosSDK.registerAdClickCallback((adtype, type) => {
            if (adtype == AdType.InfoAd) {
                switch (type) {
                    default:
                        break;
                }
            }
        });

        CocosSDK.registerInfoShowResultCallback((isExsit, type) => {
            if (type == CallJsType.InfoAd_Passlevel_Fail_Show_Success) {
                setTimeout(() => {

                }, 100);
            } else if (type == CallJsType.InfoAd_Task_Reward_Show_Success) {
                setTimeout(() => {

                }, 100);
            }

        });

        CocosSDK.registerAndroidCompCallCocosCallback(() => {

        });
    }

    //创建信息流广告,加载成功或失败会走registerInfoAdPreloadResultCallback回调
    static preloadAllInfoAd() {
        for (let i = CallJsType.InfoAd_Passlevel_Fail_Type; i <= CallJsType.InfoAd_Task_Reward_Type; i++) {
            console.log("预加载 type为" + i + "的信息流广告");
            if (i == CallJsType.InfoAd_Passlevel_Fail_Type) {
                CocosSDK.createAdInfo(i, 920 * Tools.getScreenHeightRate());
            } else if (i == CallJsType.InfoAd_Task_Reward_Type) {
                CocosSDK.createAdInfo(i, 700 * Tools.getScreenHeightRate());
            }
        }
    }

    static preloadAllVideo() {
        for (let i = CallJsType.RewardAd_To_Foreground_Close; i <= CallJsType.RewardAd_Task_Close; i++) {
            CocosSDK.createVideoAd(i);
        }
    }


    static enterBackGroundCallback() {
        GameApp.Instance.dataManager.enterBackGroundStamps = Date.now();
    }

    static enterForeGroundCallback() {
        let nowStamps = Date.now();
        let usedTime = Number(cc.sys.isNative ? CocosSDK.getConfig("stay_background_seconds") : "180") * 1000;
        let disSeconds = nowStamps - GameApp.Instance.dataManager.enterBackGroundStamps;
        console.log("ddmh======== " + String(disSeconds));
        if (disSeconds >= usedTime) {
            CocosSDK.showRewardVideoAD(CallJsType.RewardAd_To_Foreground_Close);
        }
        GameApp.Instance.dataManager.enterBackGroundStamps = Date.now();
    }

    /**
     * 微信登录
     * @param wxInfo
     * @param callback
     */
    static userLogin(wxInfo, callback = null) {
        let info = JSON.parse(wxInfo);
        OpenUrlManager.Instance.userLogin(new ActionNet((resFail) => {
            if (callback) {
                callback();
            }
        }, (resSuccess) => {
            if (callback) {
                callback(resSuccess);
            }
        }), info.name, info.openId, info.uniqueid, info.iconurl);
    }

    /**
     * 微信退出
     * @param callback
     */
    static logout(isLoading, callback = null) {
        if (isLoading) {
            GameApp.Instance.uiManager.showLoading(Globle.LoadingAni);
            setTimeout(() => {
                GameApp.Instance.uiManager.hideLoading();
            }, 5000);
        }
        OpenUrlManager.Instance.logout(new ActionNet((resFail) => {
            GameApp.Instance.uiManager.hideLoading();
            GameApp.Instance.uiManager.showToast("退出失败");
        }, (resSuccess) => {
            if (isLoading) {
                GameApp.Instance.uiManager.hideLoading();
            }
            if (callback) {
                callback(resSuccess);
            }
        }));
    }


    /**
     * 获取当前题目信息以及用户信息：
     * @param callback 
     */
    static gainUserInfo(callback = null) {
        OpenUrlManager.Instance.getUserInfo(new ActionNet((resFail1) => {
        }, (resSuccess1) => {
            if (resSuccess1.code == 0) {
                let data1 = resSuccess1.data;
                if (data1) {
                    GameApp.Instance.dataManager.cashInfo = Tools.toFloat(Tools.toFloat(data1.userAllGolds) / data1.exRate, 2);
                    GameApp.Instance.dataManager.goldInfo = Math.floor(data1.userAllmoney * data1.exRate);
                    if (callback) {
                        callback();
                    }
                }
            }
        }));
    }

    /**
     * 获取当前答案信息以及答案进度信息：
     * @param callback 
     */
    static gainAnswerInfo(callback = null) {
        OpenUrlManager.Instance.loadAnswerInfo(new ActionNet((resFail) => {
        }, (resSuccess) => {
            if (resSuccess.code == 0) {
                let data = resSuccess.data;
                if (data) {
                    let answerProgressInfo = data.answerInfo;
                    if (answerProgressInfo) {
                        GameApp.Instance.dataManager.userGameInfo = answerProgressInfo;
                    }
                    let answerInfo = data.answer;
                    if (answerInfo) {
                        GameApp.Instance.dataManager.answerInfo = answerInfo;
                    }
                    if (callback) {
                        callback();
                    }
                }
            }
        }));
    }

    /**
     * 获取提现列表：
     * @param callback 
     */
    static gainExchangeList(callback?: Function) {
        OpenUrlManager.Instance.exchangeList(new ActionNet((resFail) => {
        }, (resSuccess) => {
            if (resSuccess.code == 0) {
                let data = resSuccess.data;
                if (!data) {
                    return;
                }
                GameApp.Instance.dataManager.cashInfo = Tools.toFloat(Tools.toFloat(data.userAllGolds) / data.exRate, 2);
                GameApp.Instance.dataManager.goldInfo = Math.floor(data.userAllMoney * data.exRate);
                GameApp.Instance.uiManager.callUIRefreshFunctionsWithName("Refresh_User_Info");
                let list = data.list;
                if (!list) {
                    return;
                }
                GameApp.Instance.dataManager.exchangeList = list;
                let info0 = list[0];
                if (info0.status == 1 && GameApp.Instance.dataManager.isCashOutFinguerShow) {
                    let running = GameApp.Instance.uiManager.runningForm;
                    if (running) {
                        let runningComp = <GameLayer>running.getComponent("GameLayer");
                        let cashOutComp = <CashOut>runningComp.tabArray[0];
                        cashOutComp.finguer.active = true;
                    }
                }
                if (callback) {
                    callback();
                }
            }
        }));
    }

    /**
     * 飞货币到终止位置：
     * @param endPos 
     * @param flyType
     */
    static flyCurrency(endPos, flyType) {
        for (let i = 0; i < 10; i++) {
            let node_ = <cc.Node>cc.instantiate(GameApp.Instance.uiManager.getPrefabByName("FlyCurrency"));
            cc.director.getScene().addChild(node_);
            node_.scale = 1.5;
            node_.setPosition(cc.v2(cc.director.getWinSize().width / 2, cc.director.getWinSize().height / 2));
            let comp = <FlyCurrency>node_.getComponent("FlyCurrency");
            comp.initUI(flyType);
            node_.runAction(cc.sequence(cc.delayTime(i * 0.1), cc.spawn(cc.moveTo(0.2, endPos), cc.scaleTo(0.2, 1.0), null), cc.callFunc(() => {
                node_.destroy();
            }), null));
        }
    }

    /**
     * 获取任务列表：
     * @param callback 
     */
    static getTaskList(callback = null) {
        OpenUrlManager.Instance.getTaskList(new ActionNet((resFail) => {
        }, (resSuccess) => {
            if (resSuccess.code == 0) {
                let data = resSuccess.data;
                if (!data) {
                    return;
                }
                let subscriptAll = data.subscriptAll;
                if (subscriptAll || subscriptAll == 0) {
                    GameApp.Instance.dataManager.redPointAllInfo = subscriptAll;
                }
                let subscriptMap = data.subscriptMap;
                if (subscriptMap) {
                    GameApp.Instance.dataManager.redPointSubTaskInfo = subscriptMap;
                }
                let taskLoadBeans = data.taskLoadBeans;
                if (!taskLoadBeans) {
                    return;
                }
                GameApp.Instance.dataManager.dailyTaskInfo = [];
                GameApp.Instance.dataManager.answerTaskInfo = [];
                for (let i = 0; i < taskLoadBeans.length; i++) {
                    let info = taskLoadBeans[i];
                    if (info.type == 1) {
                        GameApp.Instance.dataManager.dailyTaskInfo.push(info);
                    } else if (info.type == 2) {
                        GameApp.Instance.dataManager.answerTaskInfo.push(info);
                    }
                }
                if (callback) {
                    callback();
                }
            }
        }));
    }

    /**
     * 获取每日打卡列表：
     * @param callback 
     */
    static getDailySignTaskList(callback = null) {
        OpenUrlManager.Instance.getDailySignList(new ActionNet((resFail) => {
        }, (resSuccess) => {
            if (resSuccess.code == 0) {
                let data = resSuccess.data;
                if (!data) {
                    return;
                }
                let clockInDayBeans = data.clockInDayBeans;
                if (!clockInDayBeans) {
                    return;
                }
                GameApp.Instance.dataManager.dailySignTaskInfo = clockInDayBeans;
                if (callback) {
                    callback();
                }
            }
        }));
    }

    /**
     * 看视频记录：
     */
    static addVideo(callback = null) {
        OpenUrlManager.Instance.addVideo(new ActionNet((resFail) => {
        }, (resSuccess) => {
            if (resSuccess.code == 0) {
                if (resSuccess.data) {
                    if (callback) {
                        callback();
                    }
                }
            }
        }), "10");
    }

    /**
     * 兑换金币：
     */
    static exchangeGold(callback = null) {
        OpenUrlManager.Instance.exchangeGold(new ActionNet((resFail) => { }, (resSuccess) => {
            if (resSuccess.code == 0) {
                let data = resSuccess.data;
                if (!data) {
                    return;
                }
                GameApp.Instance.dataManager.cashInfo = Tools.toFloat(Tools.toFloat(data.userAllGolds) / data.exRate, 2);
                GameApp.Instance.dataManager.goldInfo = Math.floor(data.userAllMoney * data.exRate);
                GameApp.Instance.uiManager.callUIRefreshFunctionsWithName("Refresh_User_Info");
                if (callback) {
                    callback();
                }
            }
        }));
    }
}
