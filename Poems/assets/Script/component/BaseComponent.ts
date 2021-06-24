/**
 * 1. BaseComponent类主要封装了UI界面的弹出以及关闭的相关逻辑，所以游戏中最好是UI界面（场景界面或者弹窗界面）
 * 继承该类。其他的Node节点在继承这个类的时候要慎用。防止出现bug。（Node节点继承cc.Component即可）。
 * 2.继承自BaseComponent的类在onLoad(),start(),onDestroy(),onDisable()里实现自己特定的逻辑时，一定要先调用
 * 父类中响应的方法，否者会出现界面不受管理类控制的现象,从而导致bug。
 */
import GameApp from "../GameApp";

const { ccclass, property } = cc._decorator;
interface UIAction {
    EnterActionFunc: Function;
    OutActionFunc: Function;
}

@ccclass
export default class BaseComponent extends cc.Component implements UIAction {

    public EnterActionFunc: Function = null;
    public OutActionFunc: Function = null;
    public onLoadFuncList = [];
    public onDestoryFuncList = [];

    nodeRunEnterAction(actionFunc: Function = null) {
        if (actionFunc) {
            actionFunc();
        } else if (this.EnterActionFunc) {
            this.EnterActionFunc();
        }
    }

    //出场动作播放完以后要删除这个节点。
    nodeRunOutAction(actionFunc: Function = null) {
        if (actionFunc) {
            this.node.runAction(cc.callFunc(actionFunc(() => {
                this.node.destroy();
            })));
        } else if (this.OutActionFunc) {
            this.node.runAction(cc.callFunc(this.OutActionFunc(() => {
                this.node.destroy();
            })));
        } else {
            this.node.destroy();
        }
    }

    //添加弹窗释放的回调：
    addOnDestoryFunc(func: Function) {
        this.onDestoryFuncList.push(func);
    }

    //添加弹窗加载的回调：
    addOnLoadFunc(func: Function) {
        this.onLoadFuncList.push(func);
    }

    //[注]：当组件挂载的节点active==true的时候才走onLoad()接口
    onLoad() {
        //响应界面加载的回调：
        for (let i = 0; i < this.onLoadFuncList.length; i++) {
            let func = this.onLoadFuncList[i];
            if (func) {
                func();
            }
        }
    }

    //[注]：当组件挂载的节点active==true的时候才走start()接口
    start() {

    }

    onDestroy() {
        //刷新弹窗管理数据：
        let uiManager = GameApp.Instance.uiManager;
        uiManager.removePopUpFormByNode(this.node);
        uiManager.refreshPopUpFormListAndTopPopUpForm();
        //响应界面销毁的回调：
        for (let i = 0; i < this.onDestoryFuncList.length; i++) {
            let func = this.onDestoryFuncList[i];
            if (func) {
                func();
            }
        }
    }

    onDisable() {
        //删除无效的刷新函数：
        GameApp.Instance.uiManager.removeInValidUIRefreshFunction();
    }
}
