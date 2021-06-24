/**
 * 提现 兑换红包页面
 */
import BaseComponent from "../../component/BaseComponent";
import GameApp from "../../GameApp";
import { ActionNet } from "../../manager/httpTools/Action";
import OpenUrlManager from "../../ui/manager/OpenUrlManager";

const { ccclass, property } = cc._decorator;
@ccclass
export default class GetMoneyRecord extends BaseComponent {
    private type: string = "0";

    onLoad() {
        super.onLoad();
        let dhzRich = this.node.getChildByName("New Node").getChildByName("btn_dhz").getComponent(cc.RichText);
        let ydhRich = this.node.getChildByName("New Node").getChildByName("btn_ydh").getComponent(cc.RichText);
        dhzRich.string = "<color=#FF4821><size =30><b>未兑换</size></b></c>";
        ydhRich.string = "<color=#333333><size =30>已兑换</size></c>";
        this.setInformation();
    }

    start() {
        super.start();
    }

    onbtnCall(event) {
        let dhzRich = this.node.getChildByName("New Node").getChildByName("btn_dhz").getComponent(cc.RichText);
        let ydhRich = this.node.getChildByName("New Node").getChildByName("btn_ydh").getComponent(cc.RichText);
        dhzRich.string = "<color=#333333><size =30>未兑换</size></c>";
        ydhRich.string = "<color=#333333><size =30>已兑换</size></c>";
        var name = event.target.name;
        if (name == "btn_ydh") {
            this.type = "1";
            ydhRich.string = "<color=#FF4821><size =30><b>已兑换</size></b></c>";
        } else if (name == "btn_dhz") {
            this.type = "0";
            dhzRich.string = "<color=#FF4821><size =30><b>未兑换</size></b></c>";
        }
        this.setInformation();
    }

    setInformation() {
        let action = new ActionNet(this, function (res) {
            if (res.code == 0) {
                let nodata = this.node.getChildByName("nodata");
                nodata.active = false;
                this.initData(res.data);
            } else {
                if (res.msg) {
                    // ShowTips(res.msg)
                }
            }
        }.bind(this), function () {

        });
        OpenUrlManager.Instance.exchangeRecord(action, this.type);
    }

    onBtnCallBack(event) {
        let name = event.target.name;
        cc.log("onBtnCallBack===" + name);
        if (name == "back") {
            this.node.active = false;
            this.node.destroy();
        }
    }

    initData(data) {
        let scrollview = this.node.getChildByName("ScrollView").getComponent(cc.ScrollView);
        scrollview.content.destroyAllChildren();
        data.forEach((v, index) => {
            v["index"] = index;
            let saninode = cc.instantiate(GameApp.Instance.uiManager.getPrefabByName("GetMoneyItemRecord"));
            let script = saninode.getComponent('GetMoneyItemRecord');
            saninode.parent = scrollview.content;
            script.setInforMation(v);
        })
    }
}
