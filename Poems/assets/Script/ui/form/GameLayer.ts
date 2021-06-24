import BaseComponent from "../../component/BaseComponent";
import GameApp from "../../GameApp";
import CocosSDK from "../../sdk/CocosSDK";
import { CallJavaType, CallJsType } from "../config/SdkConfig";
import CashOut from "./CashOut";
import Poems from "./Poems";
import Task from "./Task";

const { ccclass, property } = cc._decorator;

export enum TabType {
    Poems = 0,
    CashOut = 1,
    Task = 2,
}

@ccclass
export default class GameLayer extends BaseComponent {

    @property(cc.Node)
    parentNode: cc.Node = null;
    @property(cc.Toggle)
    poemsToggle: cc.Toggle = null;
    @property(cc.Toggle)
    cashOutToggle: cc.Toggle = null;
    @property(cc.Toggle)
    taskToggle: cc.Toggle = null;
    @property(cc.Node)
    redPoint: cc.Node = null;
    @property(cc.Label)
    redPointNums: cc.Label = null;
    private currentTabIndex = TabType.Poems;
    public tabArray = [];

    onLoad() {
        super.onLoad();
        this.initUI();
        this.initRedPointTotalNums();
    }

    start() {
        super.start();
    }

    initUI() {
        //初始化的时候把Poems界面和CashOut和Task界面界面都创建出来加到统一的父节点上：
        //加CashOut界面：
        let cashOut = cc.instantiate(GameApp.Instance.uiManager.getPrefabByName("CashOut"));
        this.parentNode.addChild(cashOut);
        let cashoutComp = <CashOut>cashOut.getComponent("CashOut");
        this.tabArray.push(cashoutComp);
        //加Task界面：
        let task = cc.instantiate(GameApp.Instance.uiManager.getPrefabByName("Task"));
        this.parentNode.addChild(task);
        let taskComp = <Task>task.getComponent("Task");
        this.tabArray.push(taskComp);
        //加Poems界面：
        let poems = cc.instantiate(GameApp.Instance.uiManager.getPrefabByName("Poems"));
        this.parentNode.addChild(poems);
        let poemsComp = <Poems>poems.getComponent("Poems");
        this.tabArray.push(poemsComp);
    }

    initRedPointTotalNums() {
        GameApp.Instance.uiManager.registerUIRefreshFunctionWithName("Refresh_RedPoint", this.node, () => {
            let redAllInfo = GameApp.Instance.dataManager.redPointAllInfo;
            if (redAllInfo) {
                this.redPointNums.string = redAllInfo;
            }
            this.redPoint.active = Number(redAllInfo) > 0;

        });
        GameApp.Instance.uiManager.callUIRefreshFunctionsWithName("Refresh_RedPoint");
    }

    refreshTabActive() {
        this.parentNode.children[0].active = this.currentTabIndex == TabType.CashOut;
        this.parentNode.children[1].active = this.currentTabIndex == TabType.Task;
        this.parentNode.children[2].active = this.currentTabIndex == TabType.Poems;
    }

    clickToggleAnswerCallback() {
        this.currentTabIndex = TabType.Poems;
        this.refreshTabActive();
    }

    clickCashOutCallback() {
        this.currentTabIndex = TabType.CashOut;
        this.refreshTabActive();
    }

    clickTaskCallback() {
        this.currentTabIndex = TabType.Task;
        this.refreshTabActive();
        let interval = Number(cc.sys.isNative ? CocosSDK.getConfig("show_interstitial_interval") * 1000 : "40000");
        if (Date.now() - GameApp.Instance.dataManager.interstitialStamps >= interval) {
            CocosSDK.showInterstitalAd(CallJsType.InterstitalAd_Task_Type);
            GameApp.Instance.dataManager.interstitialStamps = Date.now();
        }
    }

    // update (dt) {}
}
