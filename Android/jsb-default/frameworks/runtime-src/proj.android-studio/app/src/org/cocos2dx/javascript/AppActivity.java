/****************************************************************************
 Copyright (c) 2015-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
package org.cocos2dx.javascript;

import android.app.ActionBar;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.res.Configuration;
import android.graphics.Color;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.text.TextUtils;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.WindowManager;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.Toast;

import androidx.annotation.Nullable;

import com.android.billingclient.api.BillingClient;
import com.android.billingclient.api.BillingResult;
import com.android.billingclient.api.ConsumeResponseListener;
import com.android.billingclient.api.Purchase;
import com.android.billingclient.api.PurchaseHistoryRecord;
import com.android.billingclient.api.PurchaseHistoryResponseListener;
import com.common.theone.https.ApiSecretParamFactory;
import com.common.theone.interfaces.common.admodel.AdConfigRecommends;
import com.common.theone.interfaces.common.admodel.AdConfigs;
import com.common.theone.interfaces.common.factory.ConfigFactory;
import com.common.theone.interfaces.common.factory.FactoryCallBack;
import com.common.theone.utils.ConfigUtils;
import com.facebook.appevents.AppEventsConstants;
import com.facebook.appevents.AppEventsLogger;
import com.ironsource.mediationsdk.IronSource;
import com.tilecraft.matchgame.R;

import org.cocos2dx.javascript.ads.AdCallBack;
import org.cocos2dx.javascript.ads.AdMobAds;
import org.cocos2dx.javascript.ads.FacebookAds;
import org.cocos2dx.javascript.ads.IronSourceAds;
import org.cocos2dx.javascript.gp.NativeBillingClientManager;
import org.cocos2dx.javascript.gp.OnPurchaseCallBack;
import org.cocos2dx.javascript.logger.FireBaseLog;
import org.cocos2dx.javascript.ui.MyWebViewActivity;
import org.cocos2dx.javascript.utils.CommonUtil;
import org.cocos2dx.javascript.utils.Logger;
import org.cocos2dx.javascript.utils.MyConfigs;
import org.cocos2dx.javascript.utils.SpUtils;
import org.cocos2dx.javascript.utils.ToastUtil;
import org.cocos2dx.javascript.utils.Toasts;
import org.cocos2dx.javascript.utils.UrlConfig;
import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;
import org.json.JSONObject;

import java.util.List;

import io.branch.referral.Branch;
import io.branch.referral.BranchError;

public class AppActivity extends Cocos2dxActivity {
    private static final String TAG = "Logger";
    private static AppActivity sAppActivity;
    private static AppEventsLogger mLogger;
    private static ImageView sBgImageView = null;
    public static boolean canShowAd;//插屏开关
    public static boolean canShowVideo;//视频开关
    public static boolean canShowNatived;//原生开关
    public static boolean canShowBanner;//banner开关
    private Purchase curPurchase;
    private String mProductId = "fk01";
    private String mPurchaseToken;
    private boolean isServerAvaliable = false;
    private  SharedPreferences userInfo = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Workaround in
        // https://stackoverflow.com/questions/16283079/re-launch-of-activity-on-home-button-but-only-the-first-time/16447508
        if (!isTaskRoot()) {
            // Android launched another instance of the root activity into an existing task
            // so just quietly finish and go away, dropping the user back into the activity
            // at the top of the stack (ie: the last state of this task)
            // Don't need to finish it again since it's finished in super.onCreate .
            return;
        }
        // DO OTHER INITIALIZATION BELOW
        SDKWrapper.getInstance().init(this);
        sAppActivity = this;
        userInfo = sAppActivity.getSharedPreferences("user_pay", MODE_PRIVATE);
        // 在竖屏模式和横屏模式下，内容都会呈现到刘海区域中。
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            WindowManager.LayoutParams lp = getWindow().getAttributes();
            lp.layoutInDisplayCutoutMode =
                    WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
            getWindow().setAttributes(lp);
        }

        //初始化统计
        FireBaseLog.getInstance().init(this);
        //启动页埋点
        sendCommon("show_start_page");
        //初始化计费
        initPay();
        showBackground();
        requestAdConfig();
    }

    /**
     * firebase通关卡一级事件
     */
    public static void sendLevelLog(int level){
        Log.i(TAG,"sendLevelLog");
        new Thread(){
            @Override
            public void run() {
                String data = getCommonParams(String.valueOf(level));
                String msg = CommonUtil.sendPostServer(UrlConfig.getLevelUrl(),data);
                Log.d(TAG,msg);
            }
        }.start();
    }


    private void initPay() {
        //1, 初始化 支付
        NativeBillingClientManager.init(this, new OnPurchaseCallBack() {
            @Override
            public void responseCode(int code) {
                Logger.i( "responseCode:  code = " + code);
            }

            @Override
            public void onPaySuccess(List<Purchase> purchaseList) {
                Logger.i( "onPaySuccess: " + purchaseList.toString());
                if (purchaseList != null && purchaseList.size() != 0) {
                    curPurchase = purchaseList.get(0);
                    mProductId = purchaseList.get(0).getSku();
                    mPurchaseToken = purchaseList.get(0).getPurchaseToken();
                    //消费掉计费点
                    NativeBillingClientManager.consumeAsync(curPurchase, new ConsumeResponseListener() {
                        @Override
                        public void onConsumeResponse(BillingResult billingResult, String purchaseToken) {
                            if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                                Logger.i( "消费成功！");
                                SharedPreferences.Editor editor = userInfo.edit();//获取Editor
                                //得到Editor后，写入需要保存的数据
                                editor.putString("pay_result", "success");
                                editor.commit();//提交修改
                                //游戏设置vip状态
                                openVip();
                            } else {
                                Logger.i( "消费失败！");
                            }
                        }
                    });
//                    SharedPreferences.Editor editor = userInfo.edit();//获取Editor
//                    //得到Editor后，写入需要保存的数据
//                    editor.putString("pay_result", "success");
//                    editor.commit();//提交修改
//                    //游戏设置vip状态
//                    openVip();
                }
            }

            @Override
            public void onUserCancel() {
                Logger.i( "onUserCancel");
            }
        });


        //判断Pay服务是否可用(连接是异步，所以推迟1s才去判断)
        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                isServerAvaliable = NativeBillingClientManager.getServiceConnected();

                //服务可用，先调用一次,获取token
                if ((isServerAvaliable)) {
                    Logger.i( "------服务链接成功-------- ");
                    //新用户是否查看购买记录
                    checkCharge(mProductId);
                }
            }
        }, 1000);
    }

    @Override
    public Cocos2dxGLSurfaceView onCreateView() {
        Cocos2dxGLSurfaceView glSurfaceView = new Cocos2dxGLSurfaceView(this);
        // TestCpp should create stencil buffer
        glSurfaceView.setEGLConfigChooser(5, 6, 5, 0, 16, 8);
        SDKWrapper.getInstance().setGLSurfaceView(glSurfaceView, this);

        return glSurfaceView;
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            View decorView = getWindow().getDecorView();
            decorView.setSystemUiVisibility(
                    View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                            | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                            | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                            | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                            | View.SYSTEM_UI_FLAG_FULLSCREEN
                            | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
        }
    }

    /**
     * 请求广告配置
     */
    private void requestAdConfig() {
        ConfigFactory.getInstance().requestData(new FactoryCallBack() {
            @Override
            public void onSuccess() {
                SpUtils.setAgreementUrl(AdConfigRecommends.getInstance()
                        .getRecommendModel("index_agreement_txt").getUrl()); // 用户协议
                SpUtils.setPrivacyUrl(AdConfigRecommends.getInstance()
                        .getRecommendModel("index_private_txt").getUrl()); // 隐私政策
                SpUtils.setLoginToken(ConfigUtils.getUserToken());

                initAds();
            }

            @Override
            public void onError() {
                initAds();
            }
        });
    }

    /**
     * 初始化广告
     */
    private void initAds() {
        // 创建 Facebook AppEventsLogger 记录事件
        Logger.i( "initAds");
        mLogger = AppEventsLogger.newLogger(this);
        canShowBanner =  AdConfigs.getInstance().isAdConfigsDisplay("banner_ad",false);
        canShowAd = AdConfigs.getInstance().isAdConfigsDisplay("interstitial_ad",false);
        canShowNatived = AdConfigs.getInstance().isAdConfigsDisplay("native_ad",false);
        canShowVideo = AdConfigs.getInstance().isAdConfigsDisplay("rewarded_ad",false);
        // todo 初始化 IronSource
        IronSourceAds.getInstance().init(this);

        // todo 初始化 AdMob
        AdMobAds.getInstance().init(this);

        // todo 初始化 Facebook
//        FacebookAds.getInstance().init(this);
    }

    /**
     * 显示原生开屏背景
     */
    private static void showBackground() {
        if (sBgImageView == null) {
            sBgImageView = new ImageView(sAppActivity);
            sBgImageView.setImageResource(R.drawable.bg_appactivity);
            sBgImageView.setScaleType(ImageView.ScaleType.FIT_XY);
            sAppActivity.addContentView(sBgImageView,
                    new WindowManager.LayoutParams(
                            FrameLayout.LayoutParams.MATCH_PARENT,
                            FrameLayout.LayoutParams.MATCH_PARENT
                    )
            );
        }
    }

    /**
     * 隐藏原生开屏背景
     */
    public static void hideBackground() {
        Logger.i( "隐藏背景图");
        sAppActivity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (sBgImageView != null) {
                    sBgImageView.setVisibility(View.GONE);
                    sBgImageView = null;
                }
            }
        });
    }

    public static void jumpActivity(String type) {
        Logger.i( "jumpActivity: " + type);
        switch (type) {
            case "0":
                // 评价
                Intent intent = new Intent(Intent.ACTION_VIEW);
                intent.setData(Uri.parse(
                        "https://play.google.com/store/apps/details?id="
                                + sAppActivity.getPackageName()));
                intent.setPackage("com.android.vending");
                if (intent.resolveActivity(sAppActivity.getPackageManager()) != null) {
                    sAppActivity.startActivity(intent);
                } else {
                    Logger.i( "手机内没有安装Google Play");
                }
                break;
            case "1":
                // 隐私政策
                Intent intent1 = MyWebViewActivity.newIntent(
                        sAppActivity
                        , sAppActivity.getString(R.string.privacy_policy)
                        , TextUtils.isEmpty(SpUtils.getPrivacyUrl())
                                ? MyConfigs.PRIVACY_URL
                                : SpUtils.getPrivacyUrl());
                sAppActivity.startActivity(intent1);
                break;
            case "2":
                // 用户协议
                Intent intent2 = MyWebViewActivity.newIntent(
                        sAppActivity
                        , sAppActivity.getString(R.string.terms_conditions)
                        , TextUtils.isEmpty(SpUtils.getAgreementUrl())
                                ? MyConfigs.USER_AGREEMENT_URL
                                : SpUtils.getAgreementUrl());
                sAppActivity.startActivity(intent2);
                break;
            default:
                break;
        }
    }

    //网络类型相关  cocos
    public static String getNetWorkIntensity() {
        //Log.e("Mahjiong", "获取网络状态");
        ConnectivityManager connectMgr = (ConnectivityManager) sAppActivity.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo info = connectMgr.getActiveNetworkInfo();
        if (info == null) {
            return "0#-100";//无网络
        }
        if (info.getType() == ConnectivityManager.TYPE_WIFI) {
            WifiManager wifiManager = (WifiManager) sAppActivity.getApplicationContext().getSystemService(Context.WIFI_SERVICE);
            WifiInfo wifiInfo = wifiManager.getConnectionInfo();
            int data = wifiInfo.getRssi();
            return "1#" + data;//WiFi
        } else if (info.getType() == ConnectivityManager.TYPE_MOBILE) {
            return "2#" + 0;//手机流量
        }
        return "0#-100";
    }

    /**
     * 公参
     *
     * @return
     */
    public static String getParams() {
        String params =
                "channel=" + ConfigUtils.getChannel() + "&" +
                        "vestId=" + ConfigUtils.getVestId() + "&" +
                        "productId=" + ConfigUtils.getProductId() + "&" +
                        "version=" + ConfigUtils.getVersionCode() + "&" +
                        "udid=" + ConfigUtils.getIMEI() + "&" +
                        "token=" + SpUtils.getLoginToken() + "&" +
                        "osType=" + ConfigUtils.getPhoneType();
        Logger.e( "获取公参为========"+params);
        return params;
    }
    /**
     * 公参关卡埋点所用
     *
     * @return
     */
    public static String getCommonParams(String level) {
        String params =
                "channel=" + ConfigUtils.getChannel() + "&" +
                        "vestId=" + ConfigUtils.getVestId() + "&" +
                        "productId=" + ConfigUtils.getProductId() + "&" +
                        "version=" + ConfigUtils.getVersionCode() + "&" +
                        "udid=" + ConfigUtils.getIMEI() + "&" +
                        "osType=" + ConfigUtils.getPhoneType() + "&"+
                        "level=" + level;
        Logger.e( "获取公参为========"+params);
        return params;
    }
    /**
     * 加密参数
     *
     * @return
     */
    public static String getEncryptParams(String params) {
        Logger.i( "getEncryptParams: " + params);
        return ApiSecretParamFactory.encryptRequestUrl(params);
    }

    public static String getVersionName() {
        return ConfigUtils.getVersionName();
    }

    /**
     * 是否登录
     */
    public static boolean isLogin() {
        return SpUtils.getLogin();
    }

    /**
     * 是否第一次登录
     */
    public static boolean isFirstLogin() {
        return SpUtils.getFirstLogin();
    }

    /**
     * 微信登陆
     *
     * @param type
     */
    public static void wxLogin(String type) {
        Cocos2dxGLSurfaceView.getInstance().queueEvent(new Runnable() {
            @Override
            public void run() {
                Cocos2dxJavascriptJavaBridge.evalString("cc.SynSdk.loginSucceeded(0)");
            }
        });
    }
    /**
     * 微信登陆
     *
     */
    public static void openVip() {
        Cocos2dxGLSurfaceView.getInstance().queueEvent(new Runnable() {
            @Override
            public void run() {
                Cocos2dxJavascriptJavaBridge.evalString("window.openVipServerce()");
            }
        });
    }

    /**
     * 用户退出登录  cocos
     */
    public static void outLogin() {
        SpUtils.setLoginToken("");
        Cocos2dxGLSurfaceView.getInstance().queueEvent(new Runnable() {
            @Override
            public void run() {
                Cocos2dxJavascriptJavaBridge.evalString("cc.SynSdk.outloginFali(0)");
            }
        });
    }

    public static void clipBoard(String content) {
        //获取剪贴板管理器：
        ClipboardManager cm = (ClipboardManager) sAppActivity.getSystemService(Context.CLIPBOARD_SERVICE);
        // 创建普通字符型ClipData
        ClipData mClipData = ClipData.newPlainText("Label", content);
        // 将ClipData内容放到系统剪贴板里。
        cm.setPrimaryClip(mClipData);
        Toasts.showToast("复制成功：" + content);
    }

    /**
     * 显示插屏广告
     *
     * @param type 0暂停，1下一关
     */
    public static void showInterstitial(String type) {
        Logger.i( "showInterstitial: " + type);
        Logger.i( "interstitial_ad: "
                + AdConfigs.getInstance().isAdConfigsDisplay("interstitial_ad", false));
        // todo 用于无广告测试功能，发布前注销掉
        startCocosFromInterstitialAd(type);


//        if (canShowAd) {
//            sAppActivity.runOnUiThread(new Runnable() {
//                @Override
//                public void run() {
//                    IronSourceAds.getInstance().showInterstitialAd(type);
//                }
//            });
//        } else {
//            startCocosFromInterstitialAd(type);
//        }
    }

    /**
     * 从插屏广告回调中进入游戏对应界面
     */
    private static void startCocosFromInterstitialAd(String type) {
        // 下一关
        Cocos2dxGLSurfaceView.getInstance().queueEvent(new Runnable() {
            @Override
            public void run() {

                Cocos2dxJavascriptJavaBridge.evalString(" window.showInterstitialCallJs (" + type + ")");
            }
        });
    }


    /**
     * 显示激励广告
     *
     * @param type 1重置关卡，2下一关，3查找/获得次数，4时间回滚,返回上一步/获得次数/道具，
     *             5解锁皮肤，6解锁主题，7获取宝箱，8换一批，9双倍奖励
     */
    public static void showRewardVideoAD(String type) {
        Logger.d( "showRewardVideoAD: " + type);
        Logger.d( "rewarded_ad: "
                + AdConfigs.getInstance().isAdConfigsDisplay("rewarded_ad", false));
        // todo 用于无广告测试功能，发布前注销掉
        startCocosFromRewardedAd(type,true);

//        if (canShowVideo) {
//            sAppActivity.runOnUiThread(new Runnable() {
//                @Override
//                public void run() {
//                    IronSourceAds.getInstance().showRewardedAd(type);
//                }
//            });
//        } else {
//            startCocosFromRewardedAd(type,true);
//        }
    }
    public static AdCallBack callBack = new AdCallBack() {
        @Override
        public void videoLoadSuccess() {

        }

        @Override
        public void adLoadSuccess() {

        }

        @Override
        public void videoShowSuccess(String type) {
            startCocosFromRewardedAd(type, true);
        }

        @Override
        public void videoShowFailed(String type) {
            startCocosFromRewardedAd(type, false);
        }

        @Override
        public void adShowSuccess(String type) {
            Log.d(TAG, "插屏广告：" + type);
            startCocosFromInterstitialAd(type);
        }
    };
    /**
     * 从激励广告回调中进入游戏对应界面
     */
    private static void startCocosFromRewardedAd(String type,boolean available) {
        Log.d(TAG, "激励广告可用：" + available);
        if (available) {
            Cocos2dxGLSurfaceView.getInstance().queueEvent(new Runnable() {
                @Override
                public void run() {
                    Cocos2dxJavascriptJavaBridge
                            .evalString("window.showRewardedVideoCallJs(" + type + ")");
                }
            });
        } else {
            switch (type) {
                case "1":
                case "2":
                    // 重置关卡、下一关
                    Cocos2dxGLSurfaceView.getInstance().queueEvent(new Runnable() {
                        @Override
                        public void run() {
                            Cocos2dxJavascriptJavaBridge
                                    .evalString("window.showRewardedVideoCallJs(" + type + ")");
                        }
                    });
                    break;
                default:
                    ((AppActivity) sAppActivity).runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            ToastUtil.show(sAppActivity, R.string.no_video);
                        }
                    });
                    break;
            }
        }
    }

    /**
     * 展示底部横幅广告
     */
    public static void showBanner() {
        if (canShowBanner) {
            sAppActivity.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    IronSourceAds.getInstance().showBannerAd();
                }
            });
        }
    }

    /**
     * 关闭底部横幅广告
     */
    public static void closeBanner() {
        sAppActivity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                IronSourceAds.getInstance().hideBannerAd();
            }
        });
    }

    /**
     * 展示过关原生广告
     */
    public static void showNativeAD() {
        Log.d(TAG, "展示原生广告");
        if (canShowNatived) {
            sAppActivity.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    AdMobAds.getInstance().showNativeAd();
                }
            });
        }
    }

    /**
     * 关闭原生广告
     */
    public static void closeNativeAD() {
        Logger.d( "关闭原生广告");
        sAppActivity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                AdMobAds.getInstance().hideNativeAd();
            }
        });
    }


    /**
     * firebase通用一级事件
     */
    public static void sendCommon(String key){
        FireBaseLog.getInstance().sendCommonEvent(key);
    }


    /**
     * 支付
     */
    public static void doCharge(String productId){
        NativeBillingClientManager.startInAppPurchase(productId);
    }

    /**
     * 检测是否已经购买
     */
    private void checkCharge(String productId){
        String result = userInfo.getString("pay_result","");
        if(!"".equals(result)){
            return;
        }
        NativeBillingClientManager.queryPurchaseHistoryAsync(BillingClient.SkuType.INAPP, new PurchaseHistoryResponseListener() {
            @Override
            public void onPurchaseHistoryResponse(BillingResult billingResult, List<PurchaseHistoryRecord> purchaseHistoryRecordList) {
                if(purchaseHistoryRecordList==null){
                    return;
                }
                for (int i = 0; i < purchaseHistoryRecordList.size(); i++) {
                    Logger.i( "购买记录：" + purchaseHistoryRecordList.get(i).getSku());
                    if(productId.equals(purchaseHistoryRecordList.get(i).getSku())){
                        SharedPreferences.Editor editor = userInfo.edit();//获取Editor
                        //得到Editor后，写入需要保存的数据
                        editor.putString("pay_result", "success");
                        editor.commit();//提交修改
                        return;
                    }else {
                        SharedPreferences.Editor editor = userInfo.edit();//获取Editor
                        //得到Editor后，写入需要保存的数据
                        editor.putString("pay_result", "failed");
                        editor.commit();//提交修改
                    }
                }
            }
        });
    }

    /**
     * 是否是会员
     * @return
     */
    public static boolean isUserVIP(){
        SharedPreferences userInfo = sAppActivity.getSharedPreferences("user_pay", MODE_PRIVATE);
        String result = userInfo.getString("pay_result","");
        Logger.i( "是否是会员："+result);
        if("success".equals(result)){
            return true;
        }
        return false;
    }

    public static void networkStatus() {
        Logger.i( "getnetworkStatus");
        ConnectivityManager connectivityManager = (ConnectivityManager) sAppActivity.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo networkInfo = connectivityManager.getActiveNetworkInfo();
        if (networkInfo != null && networkInfo.isAvailable()) {
            Cocos2dxGLSurfaceView.getInstance().queueEvent(new Runnable() {
                @Override
                public void run() {
                    Cocos2dxJavascriptJavaBridge
                            .evalString("window.showDailyGift()");
                }
            });
        } else {
            Cocos2dxGLSurfaceView.getInstance().queueEvent(new Runnable() {
                @Override
                public void run() {
                    Cocos2dxJavascriptJavaBridge
                            .evalString("window.showNoNetwork()");
                }
            });

        }
    }

//    /**
//     * 开始新手教程
//     */
//    public void logCompleteTutorial(String level){
//
//    }

    /**
     * 完成新手指南
     *
     * @param level 关卡
     */
    public static void logCompleteTutorial(String level) {
        Logger.i( "完成新手指南：" + level);
        switch (level) {
            case "1":
                logCompleteTutorialEvent("完成第一关新手指南", "1", true);
                break;
            case "2":
                logCompleteTutorialEvent("完成第二关新手指南", "2", true);
                break;
            case "3":
                logCompleteTutorialEvent("完成第三关新手指南", "3", true);
                break;
            case "4":
                logCompleteTutorialEvent("完成第四关新手指南", "4", true);
                break;
            default:
                break;
        }
    }


    private static void logCompleteTutorialEvent(String contentData, String contentId, boolean success) {
        Bundle params = new Bundle();
        params.putString(AppEventsConstants.EVENT_PARAM_CONTENT, contentData);
        params.putString(AppEventsConstants.EVENT_PARAM_CONTENT_ID, contentId);
        params.putInt(AppEventsConstants.EVENT_PARAM_SUCCESS, success ? 1 : 0);
        mLogger.logEvent(AppEventsConstants.EVENT_NAME_COMPLETED_TUTORIAL, params);
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK) {
            finish();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }

    @Override
    protected void onResume() {
        super.onResume();
        SDKWrapper.getInstance().onResume();
        IronSource.onResume(this);
    }

    @Override
    protected void onPause() {
        super.onPause();
        SDKWrapper.getInstance().onPause();
        IronSource.onPause(this);
    }

    @Override
    protected void onDestroy() {
//        FacebookAds.getInstance().destroyAds();
        AdMobAds.getInstance().destroyAds();
        super.onDestroy();
        SDKWrapper.getInstance().onDestroy();
        NativeBillingClientManager.endConnection();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        SDKWrapper.getInstance().onActivityResult(requestCode, resultCode, data);
    }

    @Override
    protected void onRestart() {
        super.onRestart();
        SDKWrapper.getInstance().onRestart();
    }

    @Override
    protected void onStop() {
        super.onStop();
        SDKWrapper.getInstance().onStop();
    }

    @Override
    public void onBackPressed() {
        SDKWrapper.getInstance().onBackPressed();
        super.onBackPressed();
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        SDKWrapper.getInstance().onConfigurationChanged(newConfig);
        super.onConfigurationChanged(newConfig);
    }

    @Override
    protected void onRestoreInstanceState(Bundle savedInstanceState) {
        SDKWrapper.getInstance().onRestoreInstanceState(savedInstanceState);
        super.onRestoreInstanceState(savedInstanceState);
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        SDKWrapper.getInstance().onSaveInstanceState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        SDKWrapper.getInstance().onNewIntent(intent);

        Branch.sessionBuilder(this)
                .withCallback(branchReferralInitListener)
                .reInit();
    }

    @Override
    protected void onStart() {
        SDKWrapper.getInstance().onStart();
        super.onStart();
        // todo 验证 Branch SDK，发布前注销掉
//        IntegrationValidator.validate(AppActivity.this);

        Branch.sessionBuilder(this)
                .withCallback(branchReferralInitListener)
                .withData(getIntent() != null ? getIntent().getData() : null)
                .init();
    }

    private Branch.BranchReferralInitListener branchReferralInitListener = new Branch.BranchReferralInitListener() {
        @Override
        public void onInitFinished(@Nullable JSONObject referringParams, @Nullable BranchError error) {
            Logger.d( "onInitFinished: " + "error: " + (error == null ? "yes" : "no"));
            Logger.d( "onInitFinished: " + (referringParams == null ? "null" : referringParams.toString()));
        }
    };

}
