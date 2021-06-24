import CocosSDK from "../../sdk/CocosSDK";
import { CallJavaType } from "../config/SdkConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RichTextCommon extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    start() {

    }

    //用户协议
    handler() {
        CocosSDK.jumpActivity(CallJavaType.UserAssignment);
    }
    //隐私政策
    handler2() {
        CocosSDK.jumpActivity(CallJavaType.PrivatePolicy);
    }

    // update (dt) {}
}
