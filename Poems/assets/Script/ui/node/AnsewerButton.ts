import GameApp from "../../GameApp";
import { ActionNet } from "../../manager/httpTools/Action";
import Globle from "../config/Global";
import Fail from "../form/Fail";
import NewPlayerTeach from "../form/NewPlayerTeach";
import OpenUrlManager from "../manager/OpenUrlManager";

const { ccclass, property } = cc._decorator;

export enum ButtonState {
    Default = 0,
    Right = 1,
    Error = 2,
}

@ccclass
export default class AnsewerButton extends cc.Component {
    private songNameLabelArray = [];//存放名称Label组件。
    private buttonBgArray = [];//存放按钮背景精灵。
    private answerName = "";//选项名称：
    private answerIndex = "";//选项index
    private questionID = "";//问题ID：
    public static isButtonAvailable = true;
    public isCrossOut = false;//判断当前按钮是否已经被划掉：

    onLoad() {

    }

    start() {

    }

    initUI(answerName, answerIndex, questionID) {
        this.answerName = answerName;
        this.answerIndex = answerIndex;
        this.questionID = questionID;
        if (this.buttonBgArray.length != 0) {
            for (let i = 0; i < this.buttonBgArray.length; i++) {
                let bg = this.buttonBgArray[i];
                if (i > 0) {
                    bg.active = false;
                }
                let label = bg.getChildByName("Name").getComponent(cc.Label);
                label.string = answerName;
            }
        } else {
            for (let i = 0; i < this.node.children.length; i++) {
                let bg = this.node.children[i];
                this.buttonBgArray.push(bg);
                if (i > 0) {
                    bg.active = false;
                }
                let label = bg.getChildByName("Name").getComponent(cc.Label);
                this.songNameLabelArray.push(label);
                label.string = answerName;
            }
        }
    }

    setButtonState(buttonState) {
        for (let i = 1; i < this.buttonBgArray.length; i++) {
            this.buttonBgArray[i].active = i == <Number>buttonState;
        }
    }

    setButtonIsCrossOut(isCrossOut) {
        this.isCrossOut = isCrossOut;
        let btn = this.node.getChildByName("Default").getComponent(cc.Button);
        let progressComp = btn.node.getChildByName("ProgressBar_Delete_Line").getComponent(cc.ProgressBar);
        let songName = btn.node.getChildByName("Name");
        songName.opacity = this.isCrossOut ? 130 : 255;
        btn.interactable = !this.isCrossOut;
        if (this.isCrossOut) {
            this.progressToAction(progressComp, 20);
        } else {
            progressComp.progress = 0;
        }
    }

    /**
     * 
     * @param progressBar 
     * @param disEveryTime 每执行一次定时器内容，进度条前进的像素数：
     */
    progressToAction(progressBar: cc.ProgressBar, disEveryTime) {
        let totalWidth = progressBar.node.width;
        progressBar.progress = 0;
        let currentWidth = 0;
        let func = () => {
            currentWidth += disEveryTime;
            progressBar.progress = currentWidth / totalWidth;
            if (currentWidth / totalWidth >= 1) {
                progressBar.unschedule(func);
                progressBar.progress = 1;
            }
        };
        progressBar.schedule(func, 1.0 / 60, cc.macro.REPEAT_FOREVER, 0);
    }

    clickButtonCallback() {
        if (!AnsewerButton.isButtonAvailable) {
            return;
        }

        let newTeach = GameApp.Instance.uiManager.getPopUpFormByName("NewPlayerTeach");
        if (newTeach) {
            let comp = <NewPlayerTeach>newTeach.getComponent("NewPlayerTeach");
            comp.nodeRunOutAction();
        }

        AnsewerButton.isButtonAvailable = false;
        OpenUrlManager.Instance.checkAnswerResult(new ActionNet((resFail) => { }, (resSuccess) => {
            AnsewerButton.isButtonAvailable = true;
            if (resSuccess.code == 0) {
                let data = resSuccess.data;
                if (!data) {
                    return;
                }
                let isRight = data.flag;
                if (isRight) {
                    if (GameApp.Instance.dataManager.isAuditStatus) {
                        GameApp.Instance.uiManager.popUpFormByName("Passlevel");
                    } else {
                        Globle.gainAnswerInfo(() => {
                            GameApp.Instance.uiManager.callUIRefreshFunctionsWithName("Refresh_User_Info");
                            GameApp.Instance.uiManager.callUIRefreshFunctionsWithName("Refresh_Poems_Info");
                        });
                    }
                } else {
                    if (GameApp.Instance.dataManager.isAuditStatus) {
                        let comp = <Fail>GameApp.Instance.uiManager.popUpFormByNameTo("Fail");
                        comp.initUI(data.nextAnswerGolds);
                    } else {
                        Globle.gainAnswerInfo(() => {
                            GameApp.Instance.uiManager.callUIRefreshFunctionsWithName("Refresh_User_Info");
                            GameApp.Instance.uiManager.callUIRefreshFunctionsWithName("Refresh_Poems_Info");
                        });
                    }
                }
            }
        }), this.questionID, this.answerIndex);
    }

    // update (dt) {}
}
