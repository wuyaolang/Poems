import GameApp from "../../GameApp";

const { ccclass, property, inspector } = cc._decorator;

@ccclass
@inspector("packages://custom-component/button/inspector.js")
export default class UIButton extends cc.Button {
    @property(cc.Boolean)
    isPlaySoundWhenClick = true;//是否在点击按钮的时候触发点击音效

    onLoad() {

    }

    start() {
        //注册按钮点击音效：
        this.node.on("click", () => {
            if (this.isPlaySoundWhenClick) {
                GameApp.Instance.audioManager.playEffect("click", GameApp.Instance.dataManager.effectVolume);
            }
        }, this);
    }
}
