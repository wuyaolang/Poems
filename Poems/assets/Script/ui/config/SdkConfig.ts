import CocosSDK from "../../sdk/CocosSDK";

/**
 * 广告类型枚举
 */
export enum AdType {
    FullAd = 0,//全屏广告：
    InterstitialAd = 1,//插屏广告
    RewardAd = 2,//视频广告：
    InfoAd = 3,//信息流广告：
};

export enum EventAdType {
    SplashAd = 1,//开屏广告
    InterstitialAd = 2,//插屏广告：
    InfoAd = 3,//信息流广告：
    BannerAd = 4,//Banner广告：
    RewardAd = 5,//激励视频广告：
    FullAd = 6,//全屏视频广告：
}

export enum CallJavaType {
    UserFeedBack = 0,
    PrivatePolicy = 1,
    UserAssignment = 2,
    SplashActivity = 3,
    OneHundredRedPack = 6,//百元红包：
    Scratch = 7,//刮刮乐组件：
    IdomPlayLevel = 8,//成语闯关组件：
    TurnTableIphone12 = 9,//iphone12转盘：
};

export enum CallJsType {
    CashOutSlideSuccess = 1,//真提现图片验证界面滑动成功：
    LogOffSuccess = 2,//注销账户成功
    SplashActivity = 3,//开屏展示结束
    wechatAuthorizeSuccess = 4,//微信授权成功
    LoginSuccess = 5,//微信登录成功
    LogOutSuccess = 6,//退出登录
    GetTokenSuccess = 7,//获取token成功
    CompCallCocos = 10,//组件返回刷新金币数量Type值：

    RewardAd_To_Foreground_Close = 15,//游戏切到前台看视频，看视频成功
    RewardAd_To_Foreground_Skip = 1015,//游戏切到前台看视频，看视频失败
    RewardAd_Exit_App_Close = 16,//退出App看视频，观看视频成功
    RewardAd_Exit_App_Skip = 1016,//退出App看视频，观看视频失败
    RewardAd_Prop_Tips_Close = 17,//使用提示道具看视频，观看激励视频成功
    RewardAd_Prop_Tips_Skip = 1017,//使用提示道具看视频，观看激励视频失败
    RewardAd_Fail_Revive_Close = 18,//答题答错复活视频
    RewardAd_Fail_Revive_Skip = 1018,//复活看视频，观看激励视频失败
    RewardAd_Fail_PopRed_Close = 19,//气泡红包视频，观看视频成功
    RewardAd_Fail_PopRed_Skip = 1019,//气泡红包视频，观看视频失败
    RewardAd_Passlevel_Close = 20,//过关翻倍红包视频，观看视频成功
    RewardAd_Passlevel_Skip = 1020,//过关翻倍红包视频，观看视频失败
    RewardAd_Passlevel_Skip_Close = 21,//每五关跳过全屏视频，观看视频成功
    RewardAd_Passlevel_Skip_Skip = 1021,//每五关跳过全屏视频，观看视频失败
    RewardAd_CashOut_Close = 22,//提现视频，观看视频成功
    RewardAd_CashOut_Skip = 1022,//提现视频，观看视频失败
    RewardAd_Exchange_Gold_Close = 30,//金币兑换-全屏视频成功
    RewardAd_Exchange_Gold_Skip = 1030,//金币兑换-全屏视频失败
    RewardAd_Task_Reward_Close = 31,//过任务奖励翻倍视频成功
    RewardAd_Task_Reward_Skip = 1031,//任务奖励翻倍视频失败
    RewardAd_Task_Close = 32,// 任务观看视频视频成功
    RewardAd_Task_Skip = 1032,// 任务观看视频视频失败

    InfoAd_Passlevel_Fail_Type = 52,//复活界面信息流
    InfoAd_Passlevel_Fail_PreloadFail = 1052,//复活界面信息流预加载失败
    InfoAd_Passlevel_Fail_Show_Success = 2052,//复活界面信息流展示成功
    InfoAd_Passlevel_Fail_Close = 3052,//复活界面信息流关闭
    InfoAd_Task_Reward_Type = 53,//任务奖励弹窗信息流
    InfoAd_Task_Reward_PreloadFail = 1053,//任务奖励弹窗信息流预加载失败
    InfoAd_Task_Reward_Show_Success = 2053,//任务奖励弹窗信息流展示成功
    InfoAd_Task_Reward_Close = 3053,//任务奖励弹窗信息流关闭

    InterstitalAd_Task_Type = 101,//任务插屏：
};


window["AdShow"] = (type) => {
    switch (type) {
        case EventAdType.SplashAd:
            break;
        case EventAdType.InterstitialAd:
            break;
        case EventAdType.InfoAd:
            break;
        case EventAdType.BannerAd:
            break;
        case EventAdType.RewardAd:
            break;
        case EventAdType.FullAd:
            break;
        default:
            break;
    }
};

window["CallJs"] = (type) => {
    console.log("CallJsType " + type);
    switch (Number(type)) {
        case CallJsType.CashOutSlideSuccess:
            if (CocosSDK.cashOutSlideSuccessCallback) CocosSDK.cashOutSlideSuccessCallback();
            break;
        case CallJsType.LogOffSuccess:
            if (CocosSDK.logoffSuccessCallback) CocosSDK.logoffSuccessCallback();
            break;
        case CallJsType.SplashActivity:
            if (CocosSDK.agreeAsignmentCallback) CocosSDK.agreeAsignmentCallback();
            break;
        case CallJsType.wechatAuthorizeSuccess:
            if (CocosSDK.wechatAuthorizeSuccessCallback) CocosSDK.wechatAuthorizeSuccessCallback();
            break;
        case CallJsType.LoginSuccess:
            if (CocosSDK.loginSuccessCallback) CocosSDK.loginSuccessCallback();
            break;
        case CallJsType.LogOutSuccess:
            if (CocosSDK.logoutSuccessCallback) CocosSDK.logoutSuccessCallback();
            break;
        case CallJsType.CompCallCocos:
            if (CocosSDK.androidCompCallCocosCallback) CocosSDK.androidCompCallCocosCallback();
            break;

        case CallJsType.RewardAd_Exit_App_Close:
            console.log("type=" + String(type) + "的视频观看成功");
            if (CocosSDK.adCloseCallback) CocosSDK.adCloseCallback(AdType.RewardAd, Number(type));
            break;
        case CallJsType.RewardAd_To_Foreground_Close:
            console.log("type=" + String(type) + "的视频观看成功");
            if (CocosSDK.adCloseCallback) CocosSDK.adCloseCallback(AdType.RewardAd, Number(type));
            break;
        case CallJsType.RewardAd_Prop_Tips_Close:
            console.log("type=" + String(type) + "的视频观看成功");
            if (CocosSDK.adCloseCallback) CocosSDK.adCloseCallback(AdType.RewardAd, Number(type));
            break;
        case CallJsType.RewardAd_Fail_Revive_Close:
            console.log("type=" + String(type) + "的视频观看成功");
            if (CocosSDK.adCloseCallback) CocosSDK.adCloseCallback(AdType.RewardAd, Number(type));
            break;
        case CallJsType.RewardAd_Fail_PopRed_Close:
            console.log("type=" + String(type) + "的视频观看成功");
            if (CocosSDK.adCloseCallback) CocosSDK.adCloseCallback(AdType.RewardAd, Number(type));
            break;
        case CallJsType.RewardAd_Passlevel_Close:
            console.log("type=" + String(type) + "的视频观看成功");
            if (CocosSDK.adCloseCallback) CocosSDK.adCloseCallback(AdType.RewardAd, Number(type));
            break;
        case CallJsType.RewardAd_Passlevel_Skip_Close:
            console.log("type=" + String(type) + "的视频观看成功");
            if (CocosSDK.adCloseCallback) CocosSDK.adCloseCallback(AdType.RewardAd, Number(type));
            break;
        case CallJsType.RewardAd_CashOut_Close:
            console.log("type=" + String(type) + "的视频观看成功");
            if (CocosSDK.adCloseCallback) CocosSDK.adCloseCallback(AdType.RewardAd, Number(type));
            break;
        case CallJsType.RewardAd_Exchange_Gold_Close:
            console.log("type=" + String(type) + "的视频观看成功");
            if (CocosSDK.adCloseCallback) CocosSDK.adCloseCallback(AdType.RewardAd, Number(type));
            break;
        case CallJsType.RewardAd_Task_Reward_Close:
            console.log("type=" + String(type) + "的视频观看成功");
            if (CocosSDK.adCloseCallback) CocosSDK.adCloseCallback(AdType.RewardAd, Number(type));
            break;
        case CallJsType.RewardAd_Task_Close:
            console.log("type=" + String(type) + "的视频观看成功");
            if (CocosSDK.adCloseCallback) CocosSDK.adCloseCallback(AdType.RewardAd, Number(type));
            break;


        case CallJsType.RewardAd_Exit_App_Skip:
            console.log("type=" + String(type) + "的视频观看失败");
            if (CocosSDK.adSkipCallback) CocosSDK.adSkipCallback(AdType.RewardAd, Number(type));
            break;
        case CallJsType.RewardAd_To_Foreground_Skip:
            console.log("type=" + String(type) + "的视频观看失败");
            if (CocosSDK.adSkipCallback) CocosSDK.adSkipCallback(AdType.RewardAd, Number(type));
            break;
        case CallJsType.RewardAd_Prop_Tips_Skip:
            console.log("type=" + String(type) + "的视频观看失败");
            if (CocosSDK.adSkipCallback) CocosSDK.adSkipCallback(AdType.RewardAd, Number(type));
            break;
        case CallJsType.RewardAd_Fail_Revive_Skip:
            console.log("type=" + String(type) + "的视频观看失败");
            if (CocosSDK.adSkipCallback) CocosSDK.adSkipCallback(AdType.RewardAd, Number(type));
            break;
        case CallJsType.RewardAd_Fail_PopRed_Skip:
            console.log("type=" + String(type) + "的视频观看失败");
            if (CocosSDK.adSkipCallback) CocosSDK.adSkipCallback(AdType.RewardAd, Number(type));
            break;
        case CallJsType.RewardAd_Passlevel_Skip:
            console.log("type=" + String(type) + "的视频观看失败");
            if (CocosSDK.adSkipCallback) CocosSDK.adSkipCallback(AdType.RewardAd, Number(type));
            break;
        case CallJsType.RewardAd_Passlevel_Skip_Skip:
            console.log("type=" + String(type) + "的视频观看失败");
            if (CocosSDK.adSkipCallback) CocosSDK.adSkipCallback(AdType.RewardAd, Number(type));
            break;
        case CallJsType.RewardAd_CashOut_Skip:
            console.log("type=" + String(type) + "的视频观看失败");
            if (CocosSDK.adSkipCallback) CocosSDK.adSkipCallback(AdType.RewardAd, Number(type));
            break;
        case CallJsType.RewardAd_Exchange_Gold_Skip:
            console.log("type=" + String(type) + "的视频观看失败");
            if (CocosSDK.adSkipCallback) CocosSDK.adSkipCallback(AdType.RewardAd, Number(type));
            break;
        case CallJsType.RewardAd_Task_Reward_Skip:
            console.log("type=" + String(type) + "的视频观看失败");
            if (CocosSDK.adSkipCallback) CocosSDK.adSkipCallback(AdType.RewardAd, Number(type));
            break;
        case CallJsType.RewardAd_Task_Skip:
            console.log("type=" + String(type) + "的视频观看失败");
            if (CocosSDK.adSkipCallback) CocosSDK.adSkipCallback(AdType.RewardAd, Number(type));
            break;

        case CallJsType.InfoAd_Passlevel_Fail_Type:
            console.log("type=" + String(type) + "的信息流预加载成功");
            break;
        case CallJsType.InfoAd_Passlevel_Fail_PreloadFail:
            console.log("type=" + String(type) + "的信息流预加载失败");
            break;
        case CallJsType.InfoAd_Passlevel_Fail_Show_Success:
            console.log("type=" + String(type) + "的信息流展示成功");
            CocosSDK.infoShowResultCallback(true, Number(type));
            break;
        case CallJsType.InfoAd_Passlevel_Fail_Close:
            console.log("type=" + String(type) + "的信息流关闭");
            CocosSDK.infoShowResultCallback(false, Number(type));
            break;
        case CallJsType.InfoAd_Task_Reward_Type:
            console.log("type=" + String(type) + "的信息流预加载成功");
            break;
        case CallJsType.InfoAd_Task_Reward_PreloadFail:
            console.log("type=" + String(type) + "的信息流预加载失败");
            break;
        case CallJsType.InfoAd_Task_Reward_Show_Success:
            console.log("type=" + String(type) + "的信息流展示成功");
            CocosSDK.infoShowResultCallback(true, Number(type));
            break;
        case CallJsType.InfoAd_Task_Reward_Close:
            console.log("type=" + String(type) + "的信息流关闭");
            CocosSDK.infoShowResultCallback(false, Number(type));
            break;
        default:
            break;
    }
}