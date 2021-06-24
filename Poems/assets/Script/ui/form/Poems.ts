import BaseComponent from "../../component/BaseComponent";
import GameApp from "../../GameApp";
import AnswerItem from "../node/AnswerItem";
import Poet from "../node/Poet";
import QuestionItem, { QuestionResult } from "../node/QuestionItem";
import QuestionOne from "../node/QuestionOne";
import Fail from "./Fail";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Poems extends BaseComponent {
    @property(cc.Label)
    levelNums: cc.Label = null;
    @property(cc.RichText)
    accumulateRightNums: cc.RichText = null;
    @property(cc.Layout)
    answerLayout: cc.Layout = null;
    @property(cc.Node)
    countDownBG: cc.Node = null;
    @property(cc.Label)
    countDown: cc.Label = null;
    @property(cc.Node)
    roleSelf: cc.Node = null;
    @property(cc.Node)
    rolePoet: cc.Node = null;
    @property(cc.Label)
    myName: cc.Label = null;
    @property(cc.Label)
    poetName: cc.Label = null;
    @property(cc.Node)
    dialogBG: cc.Node = null;
    @property(cc.Label)
    dialogDes: cc.Label = null;
    @property(cc.Layout)
    questionLayout: cc.Layout = null;

    public songButtonArray = [];
    private currentLevelData = null;
    private static countDownTipsSeconds = 20;
    private currentRestSeconds = 10;
    private countDownFunc: Function = null;
    private myselfDragonBone: Poet = null;
    private poetDragonBone: Poet = null;
    private poetSiblingIndex = 0;
    private poetStartPos = null;
    public static currentSelectCoordinate = { x: 0, y: 0 };//当前选中的字的坐标（第几局诗的第几个字）
    private questionItemArr = [];


    onLoad() {
        super.onLoad();
        GameApp.Instance.audioManager.playLocalMusic("bgm", GameApp.Instance.dataManager.musicVolume);

        //做审核与非审核状态的区分：
        this.poetSiblingIndex = this.rolePoet.getSiblingIndex();
        this.poetStartPos = this.rolePoet.getPosition();
    }

    start() {
        super.start();
        this.initData();
    }

    initData() {
        this.refreshPoemsInfo();
    }

    initDragoneBone(levelData) {
        //添加自己的龙骨动画：
        if (!this.myselfDragonBone) {
            let myNode = <cc.Node>cc.instantiate(GameApp.Instance.uiManager.getPrefabByName("Poet"));
            this.myselfDragonBone = <Poet>myNode.getComponent('Poet');
            this.roleSelf.addChild(myNode);
        }
        if (this.myselfDragonBone && this.myselfDragonBone.node) {
            this.myselfDragonBone.initUI('role_me', 'armatureName', 'newAnimation', 'expression', 0, 0);
        }
        //显示自己姓名：
        this.myName.string = Tools.strLineFeed("游客");

        //添加诗人的龙骨动画：
        if (!this.poetDragonBone) {
            let poetNode = <cc.Node>cc.instantiate(GameApp.Instance.uiManager.getPrefabByName("Poet"));
            this.poetDragonBone = <Poet>poetNode.getComponent('Poet');
            this.rolePoet.addChild(poetNode);
        }
        if (this.poetDragonBone && this.poetDragonBone.node) {
            this.poetDragonBone.initUI(`role_${Math.ceil(Math.random() * 5)}`, 'armatureName', 'newAnimation', 'expression', 0, 0);
        }
        //显示诗人姓名：
        this.poetName.string = Tools.strLineFeed(levelData.poet);
    }

    /**
     * 获取当前选中字的坐标（第几句诗的第几个字）
     * @param levelQuestionData 
     */
    initCurrentSelectCoordinate(levelQuestionData) {
        for (let i = 0; i < levelQuestionData.length; i++) {
            let lacks = levelQuestionData[i].lacks;
            if (lacks) {
                Poems.currentSelectCoordinate.x = i;
                Poems.currentSelectCoordinate.y = lacks[0];
                break;
            }
        }
    }

    /**
     * 刷新下一个选中字的坐标（第几句诗的第几个字）
     */
    refreshNextSelectCoordinate() {
        let empteyNums = 0;
        for (let i = 0; i < this.questionItemArr.length; i++) {
            let node_ = this.questionItemArr[i];
            for (let j = 0; j < node_.children.length; j++) {
                let comp = <QuestionItem>node_.children[j].getComponent("QuestionItem");
                if (comp.myStr == "") {
                    empteyNums++;
                    Poems.currentSelectCoordinate.x = i;
                    Poems.currentSelectCoordinate.y = j;
                    QuestionOne.currentSelectQuestionItem = comp;
                    comp.initUI("", QuestionResult.Select, i, j);
                    return;
                }
            }
        }
        if (empteyNums == 0) {
            QuestionOne.currentSelectQuestionItem = null;
        }
    }

    /**
     * 检测填充空缺字以后关卡结果：
     * @param answerTurns 
     * @param str 
     */
    checkFillResult(answerTurns, str) {
        let questionData = this.currentLevelData.question;
        let compareStr = questionData[Poems.currentSelectCoordinate.x].poem[Poems.currentSelectCoordinate.y];
        let questionItem = this.questionItemArr[Poems.currentSelectCoordinate.x].children[Poems.currentSelectCoordinate.y];
        let comp = <QuestionItem>questionItem.getComponent("QuestionItem");
        if (str != compareStr) {
            comp.initUI(str, QuestionResult.Error, comp.poemNum, comp.characterNum);
            this.answerLayout.node.children[answerTurns].active = false;
        } else {
            comp.initUI(str, QuestionResult.Right, comp.poemNum, comp.characterNum);
            this.answerLayout.node.children[answerTurns].active = false;
            let questionItem = this.questionItemArr[comp.poemNum];
            let questionItemComp = <QuestionOne>questionItem.getComponent("QuestionOne");
            questionItemComp.restFillNums--;
            if (questionItemComp.restFillNums <= 0) {
                //本句诗句填充完毕：
                this.playRowAnimation(comp.poemNum, () => {
                });
                if (this.checkLevelIsFinish()) {
                    //过关
                    this.unscheduleCountDown();
                    this.passlevel();
                }
            }
        }
    }

    /**
     * 过关：
     */
    passlevel() {
        GameApp.Instance.audioManager.playEffect("answer_correct", GameApp.Instance.dataManager.effectVolume);
        this.dialogDes.string = `恭喜`;
        this.dialogBG.runAction(cc.sequence(cc.fadeIn(0.1), cc.delayTime(0.5), cc.fadeOut(0.1), cc.callFunc(() => {
            setTimeout(() => {
                this.rolePoet.setSiblingIndex(1);
            }, 100);
            this.rolePoet.runAction(cc.sequence(cc.jumpBy(0.5, cc.v2(100, -250), 100, 1), cc.delayTime(1.0), cc.callFunc(() => {
                this.rolePoet.setSiblingIndex(this.poetSiblingIndex);
            }), cc.jumpBy(0.5, cc.v2(-100, 250), 100, 1), cc.callFunc(() => {
                GameApp.Instance.uiManager.setTouchEnable(true);
                //答对了
                GameApp.Instance.dataManager.currentLevel++;
                GameApp.Instance.dataManager.accumulateRightNums++;
                GameApp.Instance.dataManager.save();
                GameApp.Instance.uiManager.callUIRefreshFunctionsWithName("Refresh_Poems_Info");
            }), null));
        }), null));
    }

    /**
     * 执行诗句填充完整动画：
     * @param poemIndex 
     */
    playRowAnimation(poemIndex, callback = null) {
        let poem = this.questionItemArr[poemIndex].children;
        for (let i = 0; i < poem.length; i++) {
            let comp = <QuestionItem>poem[i].getComponent("QuestionItem");
            poem[i].runAction(cc.sequence(cc.delayTime(i * 0.05 + 0.5), cc.callFunc(() => {
                comp.initUI(comp.myStr, QuestionResult.Right, comp.poemNum, comp.characterNum);
            }), cc.scaleTo(0.1, 1.1), cc.scaleTo(0.1, 1.0), cc.callFunc(() => {
                if (i == poem.length - 1) {
                    if (callback) {
                        callback();
                    }
                }
            }), null));
        }
    }

    /**
     * 检测本关是否完成
     */
    checkLevelIsFinish() {
        for (let i = 0; i < this.questionItemArr.length; i++) {
            let questionItem = this.questionItemArr[i];
            let questionItemComp = <QuestionOne>questionItem.getComponent("QuestionOne");
            if (questionItemComp.restFillNums > 0) {
                return false;
            }
        }
        return true;
    }

    refreshPoemsInfo() {
        GameApp.Instance.uiManager.registerUIRefreshFunctionWithName("Refresh_Poems_Info", this.node, () => {
            this.questionItemArr = [];
            let currentLevel = GameApp.Instance.dataManager.currentLevel;
            let accumulateRightNums = GameApp.Instance.dataManager.accumulateRightNums;
            this.accumulateRightNums.string = `<color=#2C2221>累计答对：</c><color=#9F3037>${accumulateRightNums}</color>`;
            this.levelNums.string = `第${currentLevel}题`;

            let levelsData = GameApp.Instance.dataManager.getJsonDataByFileName("levels1");
            let count = Object.keys(levelsData).length;
            let usedLevelIndex = currentLevel % count != 0 ? currentLevel % count : count;
            this.currentLevelData = levelsData[`${usedLevelIndex}`];
            this.initDragoneBone(this.currentLevelData);

            let questionData = this.currentLevelData.question;
            this.initCurrentSelectCoordinate(questionData);

            //隐藏所有的QuestionOne：
            for (let i = 0; i < this.questionLayout.node.children.length; i++) {
                this.questionLayout.node.children[i].active = false;
            }
            for (let i = 0; i < questionData.length; i++) {
                let questionNode: cc.Node = null;
                questionNode = this.questionLayout.node.children[i];
                let node_: cc.Node = null;
                if (!questionNode) {
                    node_ = cc.instantiate(GameApp.Instance.uiManager.getPrefabByName("QuestionOne"));
                    this.questionLayout.node.addChild(node_);
                } else {
                    node_ = questionNode;
                    node_.active = true;
                }
                let comp = <QuestionOne>node_.getComponent("QuestionOne");
                comp.initUI(i, questionData[i]);
                this.questionItemArr.push(node_);
            }

            //隐藏所有的答案：
            for (let i = 0; i < this.answerLayout.node.children.length; i++) {
                this.answerLayout.node.children[i].active = false;
            }
            let answerData = this.currentLevelData.answer;
            for (let i = 0; i < answerData.length; i++) {
                let answerNode: cc.Node = null;
                answerNode = this.answerLayout.node.children[i];
                let node_: cc.Node = null;
                if (!answerNode) {
                    node_ = cc.instantiate(GameApp.Instance.uiManager.getPrefabByName("AnswerItem"));
                    this.answerLayout.node.addChild(node_);
                } else {
                    node_ = answerNode;
                    node_.active = true;
                }
                let comp = <AnswerItem>node_.getComponent("AnswerItem");
                comp.initUI(i, answerData[i]);
            }
            this.loadCountDown();
        });
        GameApp.Instance.uiManager.callUIRefreshFunctionsWithName("Refresh_Poems_Info");
    }

    loadCountDown() {
        this.unscheduleCountDown();
        this.countDown.string = String(Poems.countDownTipsSeconds);
        this.currentRestSeconds = Poems.countDownTipsSeconds;
        this.countDownBG.active = false;
        this.countDownFunc = () => {
            if (GameApp.Instance.uiManager.getPopUpFormCount() > 0) {
                return;
            }
            this.currentRestSeconds--;
            this.countDown.string = String(this.currentRestSeconds);
            if (this.currentRestSeconds <= 0) {
                this.unscheduleCountDown();
                let comp = <Fail>GameApp.Instance.uiManager.popUpFormByNameTo("Fail");
                comp.init(this.currentLevelData);
            } else if (this.currentRestSeconds <= 5) {
                this.countDownBG.active = true;
                this.countDown.node.runAction(cc.sequence(cc.scaleTo(0.2, 1.2), cc.scaleTo(0.2, 1.0), null));
                GameApp.Instance.audioManager.playEffect("countdown", GameApp.Instance.dataManager.effectVolume);
            }
        };
        this.countDown.schedule(this.countDownFunc, 1.0, cc.macro.REPEAT_FOREVER, 1.0);
    }

    unscheduleCountDown() {
        if (this.countDownFunc) {
            this.countDown.unschedule(this.countDownFunc);
            //超时失败：
            this.countDownBG.active = false;
            this.currentRestSeconds = Poems.countDownTipsSeconds;
            this.countDown.string = String(this.currentRestSeconds);
        }
    }

    clickSettingCallback() {
        GameApp.Instance.audioManager.playEffect("click", GameApp.Instance.dataManager.effectVolume);
        GameApp.Instance.uiManager.popUpFormByName("Setting");
    }
}
