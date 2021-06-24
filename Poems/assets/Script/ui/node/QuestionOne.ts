import GameApp from "../../GameApp";
import Poems from "../form/Poems";
import QuestionItem, { QuestionResult } from "./QuestionItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class QuestionOne extends cc.Component {
    @property(cc.Layout)
    questionOneNode: cc.Layout = null;

    private myData = null;
    private myPoemNum = null;//当前是第几局诗：
    public static currentSelectQuestionItem: QuestionItem = null;
    public restFillNums = null;

    onLoad() {

    }

    start() {

    }

    initUI(poemNum, data, isCheckLack = true) {
        this.myPoemNum = poemNum;
        this.myData = data;
        let poem = data.poem;
        let lacks = data.lacks;
        this.restFillNums = lacks.length;

        //隐藏所有已经创建出来的节点：
        for (let i = 0; i < this.questionOneNode.node.children.length; i++) {
            this.questionOneNode.node.children[i].active = false;
        }
        for (let i = 0; i < poem.length; i++) {
            let questionNode: cc.Node = this.questionOneNode.node.children[i];
            let state: QuestionResult = QuestionResult.Default;
            let str = poem[i];
            if (isCheckLack) {
                for (let j = 0; j < lacks.length; j++) {
                    if (i == lacks[j]) {
                        str = "";
                        break;
                    }
                }
            }

            let node_: cc.Node = null;
            if (!questionNode) {
                node_ = cc.instantiate(GameApp.Instance.uiManager.getPrefabByName("QuestionItem"));
                this.questionOneNode.node.addChild(node_);
            } else {
                node_ = questionNode;
                node_.active = true;
            }

            let comp = <QuestionItem>node_.getComponent("QuestionItem");
            if (isCheckLack) {
                if (this.myPoemNum == Poems.currentSelectCoordinate.x && i == Poems.currentSelectCoordinate.y) {
                    state = QuestionResult.Select;
                    QuestionOne.currentSelectQuestionItem = comp;
                } else if (str == "") {
                    state = QuestionResult.CanSelect;
                }
            }
            comp.initUI(str, state, this.myPoemNum, i);

        }
    }
}
