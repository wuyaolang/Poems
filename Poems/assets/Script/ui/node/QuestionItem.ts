import GameApp from "../../GameApp";
import Poems from "../form/Poems";
import AnswerItem from "./AnswerItem";
import QuestionOne from "./QuestionOne";

const { ccclass, property } = cc._decorator;

export enum QuestionResult {
    Default = 0,//默认状态
    Right = 1,//答对状态
    Error = 2,//答错状态
    Select = 3,//选中状态
    CanSelect = 4,//当前可以被再选中（已经选中的不可被再选中）
}

@ccclass
export default class QuestionItem extends cc.Component {
    @property(cc.Label)
    character: cc.Label = null;
    @property(cc.Node)
    rightNode: cc.Node = null;
    @property(cc.Node)
    errorNode: cc.Node = null;
    @property(cc.Node)
    selectNode: cc.Node = null;

    private myState = null;//当前的状态：
    public poemNum = null;//当前字是第几句诗句里的
    public characterNum = null;//当前字是该句诗的第几个字
    public myStr = "";

    onLoad() {

    }

    start() {

    }

    initUI(str, state, poemNum, characterNum) {
        this.myStr = str;
        this.myState = state;
        this.poemNum = poemNum;
        this.characterNum = characterNum;
        this.character.string = str;

        this.rightNode.active = state == QuestionResult.Right;
        this.errorNode.active = state == QuestionResult.Error;
        this.selectNode.active = state == QuestionResult.Select;
        this.character.node.color = cc.color().fromHEX((this.rightNode.active || this.errorNode.active ? "#FFFFFF" : "#15161C"));
    }

    clickCallback() {
        if (this.myState == QuestionResult.CanSelect) {
            GameApp.Instance.audioManager.playEffect("click", GameApp.Instance.dataManager.effectVolume);
            this.initUI("", QuestionResult.Select, this.poemNum, this.characterNum);
            if (QuestionOne.currentSelectQuestionItem) {
                QuestionOne.currentSelectQuestionItem.initUI("", QuestionResult.CanSelect, QuestionOne.currentSelectQuestionItem.poemNum, QuestionOne.currentSelectQuestionItem.characterNum);
            }
            QuestionOne.currentSelectQuestionItem = this;
            Poems.currentSelectCoordinate.x = this.poemNum;
            Poems.currentSelectCoordinate.y = this.characterNum;
        } else if (this.myState == QuestionResult.Error) {
            GameApp.Instance.audioManager.playEffect("click", GameApp.Instance.dataManager.effectVolume);
            let running = GameApp.Instance.uiManager.runningForm;
            if (running) {
                let comp = <Poems>running.getComponent("Poems");
                for (let i = 0; i < comp.answerLayout.node.children.length; i++) {
                    let comp_ = <AnswerItem>comp.answerLayout.node.children[i].getComponent("AnswerItem");
                    if (!comp_.node.active && comp_.myStr == this.myStr) {
                        comp_.node.active = true;
                        break;
                    }
                }
            }
            if (QuestionOne.currentSelectQuestionItem) {
                QuestionOne.currentSelectQuestionItem.initUI("", QuestionResult.CanSelect, QuestionOne.currentSelectQuestionItem.poemNum, QuestionOne.currentSelectQuestionItem.characterNum);
            }
            QuestionOne.currentSelectQuestionItem = this;
            Poems.currentSelectCoordinate.x = this.poemNum;
            Poems.currentSelectCoordinate.y = this.characterNum;
            this.initUI("", QuestionResult.Select, this.poemNum, this.characterNum);
        }
    }
}
