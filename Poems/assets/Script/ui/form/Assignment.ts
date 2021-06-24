import CocosSDK from "../../sdk/CocosSDK";
import { CallJavaType } from "../config/SdkConfig";

const { ccclass, property } = cc._decorator;

/**
 * 该界面是在Preload界面上加载的，这时候还未到GameScene界面，所以不需要继承BaseComponent来管理。
 */
@ccclass
export default class Assignment extends cc.Component {
    private isReShowToast = true;//判断是否现在可以重新加载toast
    @property(cc.RichText)
    desContent: cc.RichText = null;

    onLoad() {
        console.log("");
    }

    start() {
        //初始化文本显示：
        let gameName = CocosSDK.getAppName() == "" ? "爱上猜歌" : CocosSDK.getAppName();
        this.desContent.string = `<color=##000000>服务协议及隐私政策\n我们依据最新的法律，向您说明应用的隐私政策，特向您推送本提示。请您阅读并充分理解 相关条款。\n我们承诺：\n我们会按照《网络安全法》《信息网络传播保 护条例》等保护您的个人信息。\
        \n如果未经您的授权，我们不会使用您的个人信 息用于您未授权的途径或目的。\
        \n请充分阅读并理解</c><color=#FA6048><on click="handler">  《用户协议》</on></color><color=#000000>和</c><color=#FA6048><on click="handler2">《隐私政策》</on> `;
    }

    clickAgreeCallback() {
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            CocosSDK.jumpActivity(CallJavaType.SplashActivity);
        } else {
            window["CallJs"](String(CallJavaType.SplashActivity));
        }
    }

    clickDisagreeCallback() {
        this.showToast("您需要同意才能使用本APP");
    }

    handler() {
        CocosSDK.jumpActivity(CallJavaType.UserAssignment);
    }

    handler2() {
        CocosSDK.jumpActivity(CallJavaType.PrivatePolicy);
    }

    showToast(des) {
        let toast = this.node.getChildByName("Toast");
        let label_des = toast.getChildByName("des").getComponent(cc.Label);
        label_des.string = des;
        if (this.isReShowToast) {
            this.isReShowToast = false;
            toast.opacity = 0; toast.active = true;
            toast.runAction(cc.sequence(cc.fadeIn(0.5), cc.delayTime(1.0), cc.fadeOut(0.5), cc.callFunc(() => {
                toast.opacity = 255;
                toast.active = false;
                this.isReShowToast = true;
            }), null));
        }
    }
}
