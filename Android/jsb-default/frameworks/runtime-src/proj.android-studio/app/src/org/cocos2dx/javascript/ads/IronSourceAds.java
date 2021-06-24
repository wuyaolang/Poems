package org.cocos2dx.javascript.ads;

import android.content.Context;
import android.os.Bundle;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.widget.FrameLayout;

import com.common.theone.interfaces.common.admodel.AdConfigs;
import com.common.theone.interfaces.common.admodel.AdInfoVos;
import com.facebook.appevents.AppEventsConstants;
import com.facebook.appevents.AppEventsLogger;
import com.ironsource.mediationsdk.ISBannerSize;
import com.ironsource.mediationsdk.IronSource;
import com.ironsource.mediationsdk.IronSourceBannerLayout;
import com.ironsource.mediationsdk.logger.IronSourceError;
import com.ironsource.mediationsdk.model.Placement;
import com.ironsource.mediationsdk.sdk.BannerListener;
import com.ironsource.mediationsdk.sdk.InterstitialListener;
import com.ironsource.mediationsdk.sdk.RewardedVideoListener;
import com.tilecraft.matchgame.R;

import org.cocos2dx.javascript.AppActivity;
import org.cocos2dx.javascript.logger.FireBaseLog;
import org.cocos2dx.javascript.utils.ToastUtil;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;

/**
 * IronSource广告管理类
 */
public class IronSourceAds {

    private static final String TAG = "IronSourceAds";
    private static IronSourceAds instance;
    private Context mContext;
    private boolean mHasReward = false;
    private FrameLayout mBannerAdLayout;
    private IronSourceBannerLayout mBannerAdView;
    private String mRewardedAdType = "";
    private String mInterstitialAdType = "";
    private AppEventsLogger mLogger;

    private RewardedVideoListener mRewardedAdListener = new RewardedVideoListener() {
        @Override
        public void onRewardedVideoAdOpened() {
            logAdImpressionEvent(Ads.REWARDED_AD);
        }

        @Override
        public void onRewardedVideoAdClosed() {
            Log.d(TAG, "激励广告：已关闭，奖励：" + mHasReward);

            if (mHasReward) {
//                startCocosFromRewardedAd(true);
                AppActivity.callBack.videoShowSuccess(mRewardedAdType);
            }

            loadRewardedAd();
            mHasReward = false;
        }

        @Override
        public void onRewardedVideoAvailabilityChanged(boolean b) {
            if (b) {
                Log.d(TAG, "激励广告：已加载");
                FireBaseLog.getInstance().sendCommonEvent("init_video_success");
            }else{
                FireBaseLog.getInstance().sendCommonEvent("init_video_failed");
            }
        }

        @Override
        public void onRewardedVideoAdStarted() {

        }

        @Override
        public void onRewardedVideoAdEnded() {

        }

        @Override
        public void onRewardedVideoAdRewarded(Placement placement) {
            Log.d(TAG, "激励广告：可奖励");
            mHasReward = true;
            FireBaseLog.getInstance().sendCommonEvent("show_video_success");
        }

        @Override
        public void onRewardedVideoAdShowFailed(IronSourceError ironSourceError) {
            Log.e(TAG, "激励广告：展示失败："
                    + ironSourceError.getErrorCode() +
                    ", " + ironSourceError.getErrorMessage());
            mHasReward = false;
//            startCocosFromRewardedAd(false);
            AppActivity.callBack.videoShowFailed(mRewardedAdType);

        }

        @Override
        public void onRewardedVideoAdClicked(Placement placement) {
            Log.d(TAG, "激励广告：点击");
            logAdClickEvent(Ads.REWARDED_AD);
        }
    };

    private InterstitialListener mInterstitialAdListener = new InterstitialListener() {
        @Override
        public void onInterstitialAdReady() {
            Log.d(TAG, "插页广告：已加载");
            FireBaseLog.getInstance().sendCommonEvent("init_full_success");
        }

        @Override
        public void onInterstitialAdLoadFailed(IronSourceError ironSourceError) {
            Log.e(TAG, "插页广告：加载失败-"
                    + ironSourceError.getErrorCode() +
                    ", " + ironSourceError.getErrorMessage());
            FireBaseLog.getInstance().sendCommonEvent("init_full_failed");

        }

        @Override
        public void onInterstitialAdOpened() {
            logAdImpressionEvent(Ads.INTERSTITIAL_AD);
        }

        @Override
        public void onInterstitialAdClosed() {
            Log.d(TAG, "插页广告：关闭");
//            startCocosFromInterstitialAd();
            AppActivity.callBack.adShowSuccess(mInterstitialAdType);
            loadInterstitialAd();
            FireBaseLog.getInstance().sendCommonEvent("show_full_success");
        }

        @Override
        public void onInterstitialAdShowSucceeded() {

        }

        @Override
        public void onInterstitialAdShowFailed(IronSourceError ironSourceError) {
            Log.d(TAG, "插页广告：展示失败");

        }

        @Override
        public void onInterstitialAdClicked() {
            Log.d(TAG, "插页广告：点击");
            logAdClickEvent(Ads.INTERSTITIAL_AD);
        }
    };

    public static IronSourceAds getInstance() {
        if (instance == null) {
            instance = new IronSourceAds();
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

        // 初始化 IronSource
        // todo 验证 AdMob 广告补充，发布前修改回原 ironsource_app_key
        IronSource.init(
                (AppActivity) context
                , AdInfoVos.getInstance().getAdInfoValue("ironsource_app_key", "55")
        );

        IronSource.setRewardedVideoListener(mRewardedAdListener);
        IronSource.setInterstitialListener(mInterstitialAdListener);

        IronSource.shouldTrackNetworkState(mContext, true);

        // todo 验证 ironSource SDK，发布前注销掉
//        IntegrationHelper.validateIntegration((AppActivity) context);

//        loadRewardedAd();
        if(AppActivity.canShowAd){
            loadInterstitialAd();
        }

        initBannerAdLayout(context);
        if(AppActivity.canShowBanner) {
            loadBannerAd();
        }
    }

    /**
     * 初始化横幅广告布局
     *
     * @param context
     */
    private void initBannerAdLayout(Context context) {
        mBannerAdLayout = new FrameLayout(context);
        FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.WRAP_CONTENT);
        params.gravity = Gravity.BOTTOM;
        AppActivity activity = (AppActivity) context;
        activity.addContentView(mBannerAdLayout, params);
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
     * 加载激励广告
     */
    private void loadRewardedAd() {
        Log.d(TAG, "激励广告：开始加载");
    }

    /**
     * 加载插页广告
     */
    private void loadInterstitialAd() {
        Log.d(TAG, "插页广告：开始加载");
        IronSource.loadInterstitial();
    }

    /**
     * 加载底部横幅广告
     */
    private void loadBannerAd() {
        Log.d(TAG, "横幅广告：开始加载");

        if (mBannerAdView != null && !mBannerAdView.isDestroyed()) {
            IronSource.destroyBanner(mBannerAdView);
            mBannerAdView = null;
        }
        mBannerAdView = IronSource.createBanner((AppActivity) mContext, ISBannerSize.BANNER);

        mBannerAdLayout.removeAllViews();
        mBannerAdLayout.addView(mBannerAdView);
        mBannerAdLayout.setVisibility(View.GONE);

        mBannerAdView.setBannerListener(new BannerListener() {
            @Override
            public void onBannerAdLoaded() {
                Log.d(TAG, "横幅广告：已加载");
            }

            @Override
            public void onBannerAdLoadFailed(IronSourceError ironSourceError) {
                Log.e(TAG, "横幅广告：加载失败-" + ironSourceError.getErrorMessage());
            }

            @Override
            public void onBannerAdClicked() {
                Log.d(TAG, "横幅广告：点击");
                logAdClickEvent(Ads.BANNER_AD);
            }

            @Override
            public void onBannerAdScreenPresented() {
                logAdImpressionEvent(Ads.BANNER_AD);
            }

            @Override
            public void onBannerAdScreenDismissed() {

            }

            @Override
            public void onBannerAdLeftApplication() {

            }
        });

        IronSource.loadBanner(mBannerAdView);
    }


    /**
     * 从激励广告回调中进入游戏对应界面
     */
    private void startCocosFromRewardedAd(boolean available) {
        Log.d(TAG, "激励广告可用：" + available);
        if (available) {
            Cocos2dxGLSurfaceView.getInstance().queueEvent(new Runnable() {
                @Override
                public void run() {
                    Cocos2dxJavascriptJavaBridge
                            .evalString("window.showRewardedVideoCallJs(" + mRewardedAdType + ")");
                }
            });
        } else {
            switch (mRewardedAdType) {
                case "1":
                case "2":
                    // 重置关卡、下一关
                    Cocos2dxGLSurfaceView.getInstance().queueEvent(new Runnable() {
                        @Override
                        public void run() {
                            Cocos2dxJavascriptJavaBridge
                                    .evalString("window.showRewardedVideoCallJs(" + mRewardedAdType + ")");
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
    private void startCocosFromInterstitialAd() {
        switch (mInterstitialAdType) {
            case "0":
                // 无操作
                break;
            case "1":
                // 下一关
                Cocos2dxGLSurfaceView.getInstance().queueEvent(new Runnable() {
                    @Override
                    public void run() {
                        Cocos2dxJavascriptJavaBridge.evalString(" window.showInterstitialCallJs (" + mInterstitialAdType +")");
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
        mRewardedAdType = type;
        if (IronSource.isRewardedVideoAvailable()) {
            IronSource.showRewardedVideo();
        } else {
            Log.d(TAG, "激励广告：不可用");
            loadRewardedAd();

            // 保底，IronSource不可用时，尝试请求AdMob广告
            AdMobAds.getInstance().showRewardedAd(type);
//            startCocosFromRewardedAd(false);
            AppActivity.callBack.videoShowFailed(mRewardedAdType);

        }
    }

    /**
     * 显示插页广告
     *
     * @param type 将要执行Cocos对应操作的类型
     */
    public void showInterstitialAd(String type) {
        Log.d(TAG, "插页广告类型：" + type);
        mInterstitialAdType = type;
        if (IronSource.isInterstitialReady()) {
            IronSource.showInterstitial();
        } else {
            Log.d(TAG, "插页广告：不可用");
            loadInterstitialAd();

            // 保底，IronSource不可用时，尝试请求AdMob广告
            AdMobAds.getInstance().showInterstitialAd(type);
            AppActivity.callBack.adShowSuccess(mInterstitialAdType);

//            startCocosFromInterstitialAd();
        }
    }

    /**
     * 显示横幅广告
     */
    public void showBannerAd() {
        if (mBannerAdView == null || mBannerAdView.isDestroyed()) {
            Log.d(TAG, "横幅广告：不可用");
            loadBannerAd();
        } else {
            mBannerAdLayout.setVisibility(View.VISIBLE);
        }
    }

    /**
     * 隐藏横幅广告
     */
    public void hideBannerAd() {
        if (mBannerAdLayout != null) {
            mBannerAdLayout.setVisibility(View.GONE);
        }
    }

    /**
     * 释放 RewardedAd 使用的资源
     */
    public void destroyRewardedAd() {
        IronSource.removeRewardedVideoListener();
        Log.d(TAG, "激励广告：释放");
    }

    /**
     * 释放 InterstitialAd 使用的资源
     */
    public void destroyInterstitialAd() {
        IronSource.removeInterstitialListener();
        Log.d(TAG, "插页广告：释放");
    }

    /**
     * 释放 BannerAd 使用的资源
     */
    public void destroyBannerAd() {
        if (mBannerAdView != null && !mBannerAdView.isDestroyed()) {
            IronSource.destroyBanner(mBannerAdView);
            mBannerAdView = null;
            Log.d(TAG, "横幅广告：释放");
        }
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
        Cocos2dxGLSurfaceView.getInstance().queueEvent(new Runnable() {
            @Override
            public void run() {
                Cocos2dxJavascriptJavaBridge
                        .evalString("window.showRewardedVideoCallJs(" + type + ")");
            }
        });
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
