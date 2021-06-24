package org.cocos2dx.javascript.ads;

import android.content.Context;
import android.os.Bundle;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;

import com.common.theone.interfaces.common.admodel.AdInfoVos;
import com.facebook.appevents.AppEventsConstants;
import com.facebook.appevents.AppEventsLogger;
import com.google.android.gms.ads.AdError;
import com.google.android.gms.ads.AdListener;
import com.google.android.gms.ads.AdLoader;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.InterstitialAd;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.RequestConfiguration;
import com.google.android.gms.ads.formats.MediaView;
import com.google.android.gms.ads.formats.NativeAdOptions;
import com.google.android.gms.ads.formats.UnifiedNativeAd;
import com.google.android.gms.ads.formats.UnifiedNativeAdView;
import com.google.android.gms.ads.initialization.InitializationStatus;
import com.google.android.gms.ads.initialization.OnInitializationCompleteListener;
import com.google.android.gms.ads.rewarded.RewardItem;
import com.google.android.gms.ads.rewarded.RewardedAd;
import com.google.android.gms.ads.rewarded.RewardedAdCallback;
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback;
import com.tilecraft.matchgame.R;

import org.cocos2dx.javascript.AppActivity;
import org.cocos2dx.javascript.logger.FireBaseLog;
import org.cocos2dx.javascript.utils.ToastUtil;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;

import java.util.Arrays;
import java.util.List;

/**
 * AdMob广告管理类
 */
public class AdMobAds {

    private static final String TAG = "Logger";
    // todo 测试id，发布前注销掉
//    private static final String AD_UNIT_INTERSTITIAL_ID = "ca-app-pub-3940256099942544/1033173712";
//    private static final String AD_UNIT_REWARDED_ID = "ca-app-pub-3940256099942544/5224354917";
//    private static final String AD_UNIT_NATIVE_ID = "ca-app-pub-3940256099942544/2247696110";
//    private static final String AD_UNIT_BANNER_ID = "ca-app-pub-3940256099942544/6300978111";

    private static final String AD_UNIT_INTERSTITIAL_ID =
            AdInfoVos.getInstance().getAdInfoValue("admob_sub_interstitial_ad_id", "55");
    private static final String AD_UNIT_REWARDED_ID =
            AdInfoVos.getInstance().getAdInfoValue("admob_sub_rewarded_ad_id", "55");
    private static final String AD_UNIT_NATIVE_ID =
            AdInfoVos.getInstance().getAdInfoValue("admob_native_ad_id", "55");

    private static AdMobAds instance;
    private Context mContext;
    private RewardedAd mRewardedAd;
    private InterstitialAd mInterstitialAd;
    private AdLoader mNativeAdLoader;
    private FrameLayout mNativeAdLayout;
    private UnifiedNativeAd mNativeAd;
    private boolean mHasReward = false;
    private boolean mIsRewardedAdLoading = false;
    private int mNativeAdShowCount = 1;

    private AppEventsLogger mLogger;

    public static AdMobAds getInstance() {
        if (instance == null) {
            instance = new AdMobAds();
        }
        return instance;
    }

    /**
     * 初始化广告资源
     *
     * @param context
     */
    public void init(Context context) {
        mContext = context;

        // 创建 AppEventsLogger 记录事件
        mLogger = AppEventsLogger.newLogger(context);
        // 启用调试日志以从客户端验证App Event的使用情况。
//        FacebookSdk.setIsDebugEnabled(true);
//        FacebookSdk.addLoggingBehavior(LoggingBehavior.APP_EVENTS);

        // todo 将OPPO A79设备设置为测试模式（可用创建的广告单元 ID测试真实广告）,发布前注释掉
        List<String> testDeviceIds = Arrays.asList("385199968C674FC28296153411520CC1");
        RequestConfiguration configuration = new RequestConfiguration.Builder()
                .setTestDeviceIds(testDeviceIds).build();
        MobileAds.setRequestConfiguration(configuration);

        // 初始化 IronSource
        MobileAds.initialize(context, new OnInitializationCompleteListener() {
            @Override
            public void onInitializationComplete(InitializationStatus initializationStatus) {
                Log.d(TAG, "AdMob：初始化完成");
            }
        });

        // 激励广告
        mRewardedAd = createAndLoadRewardedAd(AD_UNIT_REWARDED_ID);

        // 插页广告
        mInterstitialAd = new InterstitialAd(mContext);
        mInterstitialAd.setAdUnitId(AD_UNIT_INTERSTITIAL_ID);
        loadInterstitialAd();

        // 原生广告
        initNativeAdLayout(context);
        mNativeAdLoader = new AdLoader.Builder(context, AD_UNIT_NATIVE_ID)
                .forUnifiedNativeAd(new UnifiedNativeAd.OnUnifiedNativeAdLoadedListener() {
                    @Override
                    public void onUnifiedNativeAdLoaded(UnifiedNativeAd unifiedNativeAd) {
                        if (mNativeAd != null) {
                            mNativeAd.destroy();
                        }
                        mNativeAd = unifiedNativeAd;
                        populateUnifiedNativeAd(mNativeAdLayout, mNativeAd);
                    }
                })
                .withAdListener(new AdListener() {
                    @Override
                    public void onAdLoaded() {
                        // 广告加载完成后。
                        Log.d(TAG, "原生广告：已加载");
                    }

                    @Override
                    public void onAdFailedToLoad(LoadAdError loadAdError) {
                        // 广告请求失败时。
                        Log.d(TAG, "原生广告：请求失败");
                        logLoadAdErrorMessage(loadAdError.getCode());
                    }

                    @Override
                    public void onAdOpened() {
                        // 广告打开覆盖屏幕的覆盖层时。
                        Log.d(TAG, "原生广告：打开");
                    }

                    @Override
                    public void onAdClicked() {
                        // 用户点击广告时。
                        Log.d(TAG, "原生广告：点击");
                    }

                    @Override
                    public void onAdLeftApplication() {
                        // 用户离开应用程序后。
                        Log.d(TAG, "原生广告：离开APP");
                    }

                    @Override
                    public void onAdClosed() {
                        // 用户点击广告后将要返回到应用程序时。
                        Log.d(TAG, "原生广告：关闭");
                    }
                })
                .withNativeAdOptions(new NativeAdOptions.Builder().build())
                .build();
        loadNativeAd();

//        loadRewardedAd();
//        loadBannerAd();
    }

    /**
     * 获取当前手机屏幕的宽值（像素），
     * 用于设置原生广告视图的宽高。
     */
    private int getDisplayWidthPixels(Context context) {
        DisplayMetrics metric = new DisplayMetrics();
        AppActivity appActivity = (AppActivity) context;
        appActivity.getWindowManager().getDefaultDisplay().getMetrics(metric);
        Log.d(TAG, "当前屏幕宽)：" + metric.widthPixels + ", 当前屏幕高：" + metric.heightPixels);
        // 屏幕宽度（像素）
        return metric.widthPixels;
    }

    /**
     * 初始化原生广告布局
     *
     * @param context
     */
    private void initNativeAdLayout(Context context) {
        int displayWidth = getDisplayWidthPixels(context);
        int adViewWidth = displayWidth * 60 / 100;
        int adViewHeight = adViewWidth * 70 / 100;
        Log.d(TAG, "原生View宽度: " + adViewWidth + ", 原生View高度: " + adViewHeight);
        mNativeAdLayout = new FrameLayout(context);
        FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(adViewWidth, adViewHeight);
        params.gravity = Gravity.CENTER;
        AppActivity activity = (AppActivity) mContext;
        activity.addContentView(mNativeAdLayout, params);
    }

    private RewardedAd createAndLoadRewardedAd(String adUnitId) {
        RewardedAd rewardedAd = new RewardedAd(mContext, adUnitId);
        mIsRewardedAdLoading = true;
        rewardedAd.loadAd(new AdRequest.Builder().build(), new RewardedAdLoadCallback() {
            @Override
            public void onRewardedAdLoaded() {
                Log.d(TAG, "激励广告：已加载");
                mIsRewardedAdLoading = false;
                FireBaseLog.getInstance().sendCommonEvent("init_video_success");
            }

            @Override
            public void onRewardedAdFailedToLoad(LoadAdError loadAdError) {
                Log.d(TAG, "激励广告：加载失败");
                logLoadAdErrorMessage(loadAdError.getCode());
                mIsRewardedAdLoading = false;
                FireBaseLog.getInstance().sendCommonEvent("init_video_failed");

            }
        });
        return rewardedAd;
    }

    /**
     * 填充原生广告
     *
     * @param parent
     * @param ad
     */
    private void populateUnifiedNativeAd(ViewGroup parent, UnifiedNativeAd ad) {
        Log.d(TAG, "原生广告：开始填充");
        LayoutInflater inflater = (LayoutInflater) parent.getContext()
                .getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        UnifiedNativeAdView adView = (UnifiedNativeAdView) inflater
                .inflate(R.layout.native_ad_custom_admob, null);

        TextView headlineView = adView.findViewById(R.id.ad_headline);
        headlineView.setText(ad.getHeadline());
        adView.setHeadlineView(headlineView);

        MediaView mediaView = adView.findViewById(R.id.ad_media);
        adView.setMediaView(mediaView);

        adView.setNativeAd(ad);

        parent.removeAllViews();
        parent.addView(adView);
        parent.setVisibility(View.GONE);
    }

    /**
     * 记录广告加载错误信息
     *
     * @param code
     */
    private void logLoadAdErrorMessage(int code) {
        switch (code) {
            case AdRequest.ERROR_CODE_INTERNAL_ERROR:
                Log.e(TAG, "内部出现问题；例如，收到广告服务器的无效响应。");
                break;
            case AdRequest.ERROR_CODE_INVALID_REQUEST:
                Log.e(TAG, "广告请求无效；例如，广告单元 ID 不正确。");
                break;
            case AdRequest.ERROR_CODE_NETWORK_ERROR:
                Log.e(TAG, "由于网络连接问题，广告请求失败。");
                break;
            case AdRequest.ERROR_CODE_NO_FILL:
                Log.e(TAG, "广告请求成功，但由于缺少广告资源，未返回广告。 ");
                break;
            case AdRequest.ERROR_CODE_APP_ID_MISSING:
                Log.e(TAG, "由于缺少应用ID，因此未发出广告请求。");
                break;
        }
    }

    /**
     * 记录广告点击
     *
     * @param adType 广告类型
     */
    private void logAdClickEvent(String adType) {
        Bundle params = new Bundle();
        params.putString(AppEventsConstants.EVENT_PARAM_AD_TYPE, adType);
        mLogger.logEvent(AppEventsConstants.EVENT_NAME_AD_CLICK, params);
    }

    /**
     * 记录广告展示
     *
     * @param adType 广告类型
     */
    private void logAdImpressionEvent(String adType) {
        Bundle params = new Bundle();
        params.putString(AppEventsConstants.EVENT_PARAM_AD_TYPE, adType);
        mLogger.logEvent(AppEventsConstants.EVENT_NAME_AD_IMPRESSION, params);
    }

    /**
     * 加载插页广告
     */
    private void loadInterstitialAd() {
        Log.d(TAG, "插页广告：开始加载");
        mInterstitialAd.loadAd(new AdRequest.Builder().build());
    }

    /**
     * 加载底部横幅广告
     */
    private void loadBannerAd() {
        Log.d(TAG, "横幅广告：开始加载");
    }

    /**
     * 加载原生广告
     */
    private void loadNativeAd() {
        Log.d(TAG, "原生广告：开始加载");
        mNativeAdLoader.loadAd(new AdRequest.Builder().build());
    }

    /**
     * 从激励广告回调中进入游戏对应界面
     */
    private void startCocosFromRewardedAd(String type, boolean available) {
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
                    ((AppActivity) mContext).runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            ToastUtil.show(mContext, R.string.no_video);
                        }
                    });
                    break;
            }
        }
    }

    /**
     * 从插页广告回调中进入游戏对应界面
     */
    private void startCocosFromInterstitialAd(String type) {
        switch (type) {
            case "0":
                // 无操作
                break;
            case "1":
                // 下一关
                Cocos2dxGLSurfaceView.getInstance().queueEvent(new Runnable() {
                    @Override
                    public void run() {
                        Cocos2dxJavascriptJavaBridge.evalString(" window.startNextLevel()");
                    }
                });
                break;
            default:
                break;
        }
    }

    /**
     * 显示激励广告
     *
     * @param type 将要执行Cocos对应操作的类型
     */
    public void showRewardedAd(String type) {
        Log.d(TAG, "激励广告类型：" + type);
        if (mRewardedAd != null && mRewardedAd.isLoaded()) {
            mRewardedAd.show((AppActivity) mContext
                    , new RewardedAdCallback() {
                        @Override
                        public void onUserEarnedReward(@NonNull RewardItem rewardItem) {
                            Log.d(TAG, "激励广告：获取奖励");
                            mHasReward = true;
                        }

                        @Override
                        public void onRewardedAdFailedToShow(AdError adError) {
                            Log.d(TAG, "激励广告：无法显示");
                            logLoadAdErrorMessage(adError.getCode());
                            mHasReward = false;
//                            startCocosFromRewardedAd(type, false);
                            AppActivity.callBack.videoShowFailed(type);
                        }

                        @Override
                        public void onRewardedAdClosed() {
                            if (mHasReward) {
//                                startCocosFromRewardedAd(type, true);
                                AppActivity.callBack.videoShowSuccess(type);

                            }
                            mHasReward = false;
                            mRewardedAd = createAndLoadRewardedAd(AD_UNIT_REWARDED_ID);
                            FireBaseLog.getInstance().sendCommonEvent("show_video_success");
                        }
                    });
        } else if (mIsRewardedAdLoading) {
            Log.d(TAG, "激励广告：加载中");
//            startCocosFromRewardedAd(type, false);
            AppActivity.callBack.videoShowFailed(type);

        } else {
            Log.d(TAG, "激励广告：未加载");
//            startCocosFromRewardedAd(type, false);
            AppActivity.callBack.videoShowFailed(type);

            mRewardedAd = createAndLoadRewardedAd(AD_UNIT_REWARDED_ID);
        }

    }

    /**
     * 显示插页广告
     *
     * @param type 将要执行Cocos对应操作的类型
     */
    public void showInterstitialAd(String type) {
        Log.d(TAG, "插页广告类型：" + type);
        mInterstitialAd.setAdListener(new AdListener() {
            @Override
            public void onAdLoaded() {
                Log.d(TAG, "插页广告：已加载");
                FireBaseLog.getInstance().sendCommonEvent("init_full_success");
            }

            @Override
            public void onAdFailedToLoad(LoadAdError loadAdError) {
                Log.d(TAG, "插页广告：请求失败");
                logLoadAdErrorMessage(loadAdError.getCode());
                FireBaseLog.getInstance().sendCommonEvent("init_full_failed");
            }

            @Override
            public void onAdOpened() {
                Log.d(TAG, "插页广告：打开");
                FireBaseLog.getInstance().sendCommonEvent("show_full_success");
            }

            @Override
            public void onAdClicked() {
                Log.d(TAG, "插页广告：点击");
            }

            @Override
            public void onAdLeftApplication() {
                Log.d(TAG, "插页广告：离开APP");
            }

            @Override
            public void onAdClosed() {
                Log.d(TAG, "插页广告：关闭");
//                startCocosFromInterstitialAd(type);
                AppActivity.callBack.adShowSuccess(type);

                // 加载下一个插页式广告。
                loadInterstitialAd();
            }
        });

        if (mInterstitialAd != null && mInterstitialAd.isLoaded()) {
            mInterstitialAd.show();
        } else if (mInterstitialAd.isLoading()) {
            Log.d(TAG, "插页广告：加载中");
//            startCocosFromInterstitialAd(type);
            AppActivity.callBack.adShowSuccess(type);

        } else {
            Log.d(TAG, "插页广告：未加载");
            loadInterstitialAd();
//            startCocosFromInterstitialAd(type);
            AppActivity.callBack.adShowSuccess(type);

        }
    }

    /**
     * 显示横幅广告
     */
    public void showBannerAd() {
    }

    /**
     * 隐藏横幅广告
     */
    public void hideBannerAd() {
    }

    /**
     * 显示原生广告
     */
    public void showNativeAd() {
        Log.d(TAG, "原生广告：显示次数-" + mNativeAdShowCount);
        if (mNativeAdLayout != null) {
            mNativeAdLayout.setVisibility(View.VISIBLE);
        }
    }

    /**
     * 隐藏原生广告
     */
    public void hideNativeAd() {
        if (mNativeAdLayout != null) {
            mNativeAdLayout.setVisibility(View.GONE);

            // 每显示5次，重新加载一次原生广告
            if (mNativeAdShowCount % 5 == 0) {
                loadNativeAd();
            }
            mNativeAdShowCount++;
        }
    }

    /**
     * 释放 RewardedAd 使用的资源
     */
    public void destroyRewardedAd() {
        Log.d(TAG, "激励广告：释放");
    }

    /**
     * 释放 InterstitialAd 使用的资源
     */
    public void destroyInterstitialAd() {
        Log.d(TAG, "插页广告：释放");
    }

    /**
     * 释放 BannerAd 使用的资源
     */
    public void destroyBannerAd() {
        if (mNativeAd != null) {
            mNativeAd.destroy();
        }
        Log.d(TAG, "横幅广告：释放");
    }

    /**
     * 释放广告使用的所有资源
     */
    public void destroyAds() {
        destroyBannerAd();
        destroyInterstitialAd();
        destroyRewardedAd();
    }


    public static void testCocosFromRewardedAd(String type) {
        switch (type) {
            case "1":
                // 重置关卡
                Cocos2dxGLSurfaceView.getInstance().queueEvent(new Runnable() {
                    @Override
                    public void run() {
                        Cocos2dxJavascriptJavaBridge.evalString("window.restartCurLevel()");
                    }
                });
                break;
            case "2":
                // 下一关
                Cocos2dxGLSurfaceView.getInstance().queueEvent(new Runnable() {
                    @Override
                    public void run() {
                        Cocos2dxJavascriptJavaBridge.evalString("window.startNextLevel()");
                    }
                });
                break;
            case "3":
                // 查找/获得次数
                Cocos2dxGLSurfaceView.getInstance().queueEvent(new Runnable() {
                    @Override
                    public void run() {
                        Cocos2dxJavascriptJavaBridge.evalString("window.AutoPlace()");
                    }
                });
                break;
            case "4":
                // 时间回滚,返回上一步/获得次数/道具
                Cocos2dxGLSurfaceView.getInstance().queueEvent(new Runnable() {
                    @Override
                    public void run() {
                        Cocos2dxJavascriptJavaBridge.evalString("window.rollBackRemoveItem()");
                    }
                });
                break;
            case "5":
                // 解锁皮肤
                Cocos2dxGLSurfaceView.getInstance().queueEvent(new Runnable() {
                    @Override
                    public void run() {
                        Cocos2dxJavascriptJavaBridge.evalString("window.unlockSkin()");
                    }
                });
                break;
            case "6":
                // 解锁主题
                Cocos2dxGLSurfaceView.getInstance().queueEvent(new Runnable() {
                    @Override
                    public void run() {
                        Cocos2dxJavascriptJavaBridge.evalString("window.unlockTheme()");
                    }
                });
                break;
            case "7":
                // 获取宝箱
                Cocos2dxGLSurfaceView.getInstance().queueEvent(new Runnable() {
                    @Override
                    public void run() {
                        Cocos2dxJavascriptJavaBridge.evalString("window.baoXiang()");
                    }
                });
                break;
            case "8":
                // 换一批
                Cocos2dxGLSurfaceView.getInstance().queueEvent(new Runnable() {
                    @Override
                    public void run() {
                        Cocos2dxJavascriptJavaBridge.evalString("window.refreshCurLevel()");
                    }
                });
                break;
            case "9":
                // 双倍奖励
                Cocos2dxGLSurfaceView.getInstance().queueEvent(new Runnable() {
                    @Override
                    public void run() {
                        Cocos2dxJavascriptJavaBridge.evalString("window.doubleReward()");
                    }
                });
                break;
            default:
                break;
        }
    }

    public static void testCocosFromInterstitialAd(String type) {
        switch (type) {
            case "0":
                // 无操作
                break;
            case "1":
                // 下一关
                Cocos2dxGLSurfaceView.getInstance().queueEvent(new Runnable() {
                    @Override
                    public void run() {
                        Cocos2dxJavascriptJavaBridge.evalString(" window.startNextLevel()");
                    }
                });
                break;
            default:
                break;
        }
    }


}
