const { ccclass, property } = cc._decorator;

@ccclass
export default class CocosSDK {
    public static agreeAsignmentCallback: Function = null;
    public static wechatAuthorizeSuccessCallback: Function = null;
    public static logoutSuccessCallback: Function = null;
    public static loginSuccessCallback: Function = null;
    public static adCloseCallback: Function = null;
    public static adSkipCallback: Function = null;

    public static DoubleReceiveCallback: Function = null;
    public static infoAdPreloadResultCallback = null;
    public static infoShowResultCallback = null;
    public static adClickCallback = null;
    public static logoffSuccessCallback = null;
    public static cashOutSlideSuccessCallback = null;
    public static androidCompCallCocosCallback = null;
    public static registerAgreeAsignmentCallback(callback) {
        CocosSDK.agreeAsignmentCallback = callback;
    }

    public static registerWechatAuthorizeSuccessCallback(callback) {
        CocosSDK.wechatAuthorizeSuccessCallback = callback;
    }

    public static registerLoginSuccessCallback(callback) {
        CocosSDK.loginSuccessCallback = callback;
    }

    public static registerLogoutSuccessCallback(callback) {
        CocosSDK.logoutSuccessCallback = callback;
    }

    public static registerAdCloseCallback(callback) {
        CocosSDK.adCloseCallback = callback;
    }

    public static registerAdSkipCallback(callback) {
        CocosSDK.adSkipCallback = callback;
    }

    public static registerInfoAdPreloadResultCallback(callback) {
        CocosSDK.infoAdPreloadResultCallback = callback;
    }

    public static registerInfoShowResultCallback(callback) {
        CocosSDK.infoShowResultCallback = callback;
    }

    public static registerAdClickCallback(callback) {
        CocosSDK.adClickCallback = callback;
    }

    public static registerLogoffCallback(callback) {
        CocosSDK.logoffSuccessCallback = callback;
    }

    public static registerCashOutSlideSuccessCallback(callback) {
        CocosSDK.cashOutSlideSuccessCallback = callback;
    }

    public static registerAndroidCompCallCocosCallback(callback) {
        CocosSDK.androidCompCallCocosCallback = callback;
    }
    /**
     页面跳转
     UserFeedBack = 0,
     PrivatePolicy = 1,
     UserAssignment = 2,
     SplashActivity = 3,
     Turntable = 4,//转盘
     * @param type
     */
    public static jumpActivity(type) {
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "jumpActivity", "(Ljava/lang/String;)V", String(type));
        }
    }
    /**
      * @param type
      */
    public static createVideoAd(type) {
        console.log("开始预加载视频广告  type为" + type);
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "createVideoAd", "(Ljava/lang/String;)V", String(type));
        }
    }
    /**
     * 微信登录接口：
     */
    public static wxLogin() {
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "wxLogin", "()V",);
        }
    }

    /**
     *
     * @param token 退出用户接口获取的token 用于刷新
     */
    public static outLogin(token) {
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "outLogin", "(Ljava/lang/String;)V", String(token));
        }
    }

    /**
   *
   * @param token 退出用户接口获取的token 用于刷新
   */
    public static getUserToken() {
        let result = "";
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            result = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getUserToken", "()Ljava/lang/String;");
        } else {
            result = "11f3058d-f896-41d4-b302-2b39326ba6ca";
        }
        return result;
    }

    /**
     * 获取共参
     */
    public static getWXInfo() {
        cc.log("开始获取微信登录需要的数据======")
        let result = "";
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            result = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getWXInfo", "()Ljava/lang/String;");
            return result;
        }
        return "{\"city\":\"北京\",\"country\":\"安道尔\",\"gender\":1,\"iconurl\":\"https://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83epWbgWp8cV3BIX3JvXFibIgofRBC8icM9y1ktGjTzGWWS0FlsL7tYiadcEoosicl5Z82NqicXqTXKB9QIQ/132\",\"name\":\"浪迹天涯\",\"openId\":\"omAoB6QBJNP2SyPerJonBBfbui7A\",\"platformType\":1,\"province\":\"北京\",\"thirdType\":\"1\",\"uid\":\"oM1KD5tIFo66M5m1GTJ6St4ezM1g\",\"uniqueid\":\"oM1KD5tIFo66M5m1GTJ6St4ezM1g\"}";
    }

    /**
     * 登录成功后刷新用户token
     * @param token
     */
    public static setUserToken(token) {
        cc.log("开始update 用户token===" + token);
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "setUserToken", "(Ljava/lang/String;)V", String(token));
        }
    }

    /**
     * 获取共参
     */
    public static getParams() {
        let result = "";
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            result = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getParams", "()Ljava/lang/String;");
        }
        console.log("共参===》", result);
        return result;
    }

    /**
     * 获取最终加密参数(这个参数要在CallJs(3)回调成功之后调取，否者会读取不到配置,所以所有的网络请求都在CallJs(3)回调成功后进行)
     */
    public static getEncryptParams(str) {
        str = str + "&" + CocosSDK.getParams();
        console.log("客户端处理" + str);
        let result = "";
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            result = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getEncryptParams", "(Ljava/lang/String;)Ljava/lang/String;", str);
        }
        console.log("客户端处理结果" + result);
        return result;
    }

    /**
     * 通过传入的字段 获取公共平台配置的开关是否打开,show_ad_audit
     * @param {} str
     */
    public static isShowView(str) {
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            let result = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "isShowView", "(Ljava/lang/String;)Z", str);
            return result;
        }
        return true;
    }

    public static isLogin() {
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            let result = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "isLogin", "()Z");
            return result;
        }
        return true;
    }

    public static showRewardVideoAD(type) {
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showRewardVideoAD", "(Ljava/lang/String;)Z", String(type));
        } else {
            window["CallJs"](String(type));
        }
    }

    public static createAdInfo(type, bottomDis) {
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "createAdInfo", "(Ljava/lang/String;Ljava/lang/String;)V", String(type), String(bottomDis));
        }
    }

    public static showAdInfo(type, bottomDis) {
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            let result = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showAdInfo", "(Ljava/lang/String;Ljava/lang/String;)Z", String(type), String(bottomDis));
            return result;
        }
        return true;
    }

    public static closeAdInfo(type) {
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "closeAdInfo", "(Ljava/lang/String;)V", String(type));
        }
    }

    public static showBanner(type) {
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            let result = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showBanner", "(Ljava/lang/String;)Z", String(type));
            return result;
        }
        return true;
    }

    public static closeBanner(type) {
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "closeBanner", "(Ljava/lang/String;)V", String(type));
        }
    }

    /**
     * 友盟统计
     * @param key 
     * @param value 
     */
    public static onEvent(key: string, value: string) {
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "sendCommonEvent", "(Ljava/lang/String;Ljava/lang/String;)V", key, value);
        }
    }

    /**
     * 获取广告信息的相关配置
     * @param key 
     */
    public static getConfig(key) {
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            let str = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getAdInfoValue", "(Ljava/lang/String;)Ljava/lang/String;", key);
            return str;
        }
        return "";
    }

    public static loginOff() {
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "loginOff", "()V");
        }
    }

    public static getAppName() {
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getAppName", "()Ljava/lang/String;");
        }
        return "";
    }

    /**
     * 获取滑块position
     */
    public static getSliderStartPosition() {
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getSliderStartPosition", "()Ljava/lang/String;");
        }
        return "";
    }

    /**
     * 阿里云风险sdk
     * SDK返回的deviceToken
     */
    public static getDeviceToken() {
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getDeviceToken", "()Ljava/lang/String;");
        }
        return "TkVXSUQjNDg1OWFlMTE4ODY2ZDVmOWJkMWZlZTdmMWVlYzU2YzktaC0xNjE0NTg1OTUzMjgzLWFhY2I5NTk5MDkwZDQ0OTc5Njk3NTIwODg5Y2EzOTU3I1FrNVpXUlo1RVV2QzRINXlTYlJZdlB1bEtNU0xObXVNb2dpMXhqSGphK1ltc3U4dnZBeitUenNUcG5nVnJPaDJYdE16cHNTK0p0QVcyS1p2QXpGMHlBUklBRDFrcnhGK2lhdG42WXNtMzlEUXMybjhhRmhLTVhJb3BpQlFUa2pkWGFvazZ2NEc3U1RKbmNDaFpzYmMxT21TTGI1MHIrWFdWQXpmNWticFBMK2daYXRqU29YUjlZY1hJUFVLNG0xN1BDSVR4Z0RWOGFUaVoxMkJaYXM9";
    }

    /**
     * 滑块结束
     */
    public static showCaptcha() {
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showCaptcha", "()Z");
        }
        return false;
    }

    public static isApplyState(type: boolean) {
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "isApplyState", "(Z)V", type);
        }
    }

    public static getToken() {
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getToken", "()V");
        }
    }

    /**
     * cocos 按钮点击透传到对应的信息流
     */
    public static isInRandomInfoClick() {
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "isInRandomInfoClick", "()V");
        }
    }

    /**
     * 展示插屏广告
     * @param type 
     */
    public static showInterstitalAd(type) {
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showInterstitalAd", "(Ljava/lang/String;)V", type);
        }
    }
}
