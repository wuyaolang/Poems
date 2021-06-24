import GameApp from "../../GameApp";
import Poems from "../form/Poems";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AnswerItem extends cc.Component {
    @property(cc.Label)
    character: cc.Label = null;
    @property(cc.Node)
    rightNode: cc.Node = null;
    @property(cc.Node)
    errorNode: cc.Node = null;
    @property(cc.Button)
    btnClick: cc.Button = null;

    public myStr = "";
    public myTurns = 0;

    onLoad() {

    }

    start() {

    }

    initUI(turns, str, isCanClick = true) {
        this.myTurns = turns;
        this.myStr = str;
        this.character.string = str;
        if (!isCanClick) {
            this.btnClick.interactable = false;
        }
    }

    clickCallback() {
        let running = GameApp.Instance.uiManager.runningForm;
        if (running) {
            let comp = <Poems>running.getComponent("Poems");
            comp.checkFillResult(this.myTurns, this.myStr);
            comp.refreshNextSelectCoordinate();
        }
    }
}
