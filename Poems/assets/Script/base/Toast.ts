import BaseComponent from "../component/BaseComponent";
import GameApp from "../GameApp";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Toast extends BaseComponent {

    onLoad() {
        super.onLoad();
    }

    start() {
        super.start();
    }

    initToast(toast_content) {
        let node_sp = this.node.getChildByName("Sprite_toast")
        let label_content = node_sp.getChildByName("Label_toastcontent").getComponent(cc.Label);
        if (label_content) {
            label_content.string = toast_content;
        }

        this.node.runAction(cc.sequence(cc.delayTime(1.0), cc.spawn(cc.moveBy(0.5, cc.v2(0, 200)), cc.fadeOut(0.5), null), cc.moveBy(0, cc.v2(0, -200)), cc.callFunc(() => {
            let toastNodePool = GameApp.Instance.uiManager.toastNodePool;
            if (toastNodePool) {
                toastNodePool.put(this.node);
            }
        }), null));
    }

    // update (dt) {}
}
