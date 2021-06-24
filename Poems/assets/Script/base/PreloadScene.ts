import BaseComponent from "../component/BaseComponent";
import GameApp from "../GameApp";
import UIManager from "../manager/UIManager";
import Globle from "../ui/config/Global";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PreloadScene extends BaseComponent {

    @property(cc.ProgressBar)
    loadingProgressTrue: cc.ProgressBar = null;
    @property(cc.ProgressBar)
    loadingProgressFalse: cc.ProgressBar = null;
    private isTrueLoadingComplete = false;
    private porgressTime = 0;
    private loadingFrontProgressPer = 0;
    static isInBackGround = false;

    onLoad() {
        super.onLoad();
    }

    start() {
        super.start();
        if (GameApp.Instance.uiManager == null) {
            //如果uiManager为null,就是刚刚进入游戏，需要预加载资源
            GameApp.Instance.uiManager = new UIManager;
        }
        GameApp.Instance.uiManager.addPersistRootNode();
        GameApp.Instance.uiManager.setFunctionWhenEnterBackGround(this.setFunctionWhenEnterBackGround);
        GameApp.Instance.uiManager.setFunctionWhenEnterForeGround(this.setFunctionWhenEnterForeGround);
        GameApp.Instance.uiManager.loadingProgress = this.loadingProgressTrue;
        this.setLoadingTrueVisible(true);
        GameApp.Instance.uiManager.startLoading((completedCount, totalCount) => {
            let per = completedCount / totalCount;
            if (per && !isNaN(per)) {
                this.loadingProgressTrue.progress = per;
            }
        }, () => {
            this.setLoadingTrueVisible(false);
            this.isTrueLoadingComplete = true;
        });
        this.addKeyBoardListener();
        this.addFalseProgressLoading();
    }

    setLoadingTrueVisible(isShow) {
        if (isShow) {
            this.loadingProgressTrue.progress = 0;
            this.loadingProgressTrue.node.active = true;
        } else {
            this.loadingProgressTrue.progress = 0;
            this.loadingProgressTrue.node.active = false;
        }
    }

    showToastInPreload(str) {
        let node_ = this.node.getChildByName("Toast");
        node_.active = true;
        node_.runAction(cc.sequence(cc.delayTime(2.0), cc.fadeOut(0.5), null));
        let des = node_.getChildByName("des").getComponent(cc.Label);
        des.string = str;
    }

    addFalseProgressLoading() {
        let dt = 0.03;
        let func = () => {
            if (this.loadingFrontProgressPer < 0.3) {
                this.porgressTime += dt / 2;
                this.loadingFrontProgressPer = this.porgressTime;
                if (this.loadingFrontProgressPer > 0.3) {
                    this.loadingFrontProgressPer = 0.3;
                }
            } else if (this.loadingFrontProgressPer < 0.6 && this.loadingFrontProgressPer >= 0.3) {
                this.porgressTime += dt / 4;
                this.loadingFrontProgressPer = this.porgressTime;
                if (this.loadingFrontProgressPer > 0.6) {
                    this.loadingFrontProgressPer = 0.6;
                }
            } else if (this.loadingFrontProgressPer < 0.85 && this.loadingFrontProgressPer >= 0.6) {
                this.porgressTime += dt / 6;
                this.loadingFrontProgressPer = this.porgressTime;
                if (this.loadingFrontProgressPer > 0.85) {
                    this.loadingFrontProgressPer = 0.85;
                }
            } else if (this.loadingFrontProgressPer >= 0.85 && this.isTrueLoadingComplete) {
                this.porgressTime += dt / 3;
                this.loadingFrontProgressPer = this.porgressTime;
            }
            if (this.loadingFrontProgressPer < 1) {
                this.loadingProgressFalse.progress = this.loadingFrontProgressPer;
            } else {
                this.loadingProgressFalse.unschedule(func);
                this.loadingProgressFalse.progress = 1;

                //执行预加载成功之后的逻辑：
                Globle.afterPreloadCallback();
            }
        };
        this.loadingProgressFalse.schedule(func, 1.0 / 60, cc.macro.REPEAT_FOREVER, 1.0 / 60);
    }

    setFunctionWhenEnterBackGround() {
        Globle.enterBackGroundCallback();
    }

    setFunctionWhenEnterForeGround() {
        Globle.enterForeGroundCallback();
    }

    addKeyBoardListener() {
        if (cc.sys.isNative) {
            if (cc.sys.os === cc.sys.OS_ANDROID) {
                cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, function (event) {
                    switch (event.keyCode) {
                        //注意Creator版本为2.x的请把cc.KEY.back。修改成cc.macro.KEY.back
                        case cc.macro.KEY.back:
                            break;
                    }
                }, GameApp.Instance.uiManager.getPersistRootNode);
            }
        }
    }
}
