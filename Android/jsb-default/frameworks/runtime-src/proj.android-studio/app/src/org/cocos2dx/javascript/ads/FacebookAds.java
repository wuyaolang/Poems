package org.cocos2dx.javascript.ads;

import android.content.Context;
import android.os.Bundle;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.LinearLayout;

import com.common.theone.interfaces.common.admodel.AdInfoVos;
import com.facebook.ads.Ad;
import com.facebook.ads.AdError;
import com.facebook.ads.AdListener;
import com.facebook.ads.AdOptionsView;
import com.facebook.ads.AdSize;
import com.facebook.ads.AdView;
import com.facebook.ads.InterstitialAd;
import com.facebook.ads.InterstitialAdListener;
import com.facebook.ads.MediaView;
import com.facebook.ads.NativeAd;
import com.facebook.ads.NativeAdLayout;
import com.facebook.ads.NativeAdListener;
import com.facebook.ads.RewardedVideoAd;
import com.facebook.ads.RewardedVideoAdListener;
import com.facebook.appevents.AppEventsConstants;
import com.facebook.appevents.AppEventsLogger;
import com.tilecraft.matchgame.R;

import org.cocos2dx.javascript.AppActivity;
import org.cocos2dx.javascript.utils.ToastUtil;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;

import java.util.ArrayList;
import java.util.List;

/**
 * Facebook广告管理类
 */
public class FacebookAds {

    private static final String TAG = "FacebookAds";
    private static FacebookAds instance;
    private Context mContext;
    private RewardedVideoAd mRewardedAd;
    private InterstitialAd mInterstitialAd;
    private NativeAd mNativeAd;
    private AdView mAdView;
    private boolean mHasReward = false;
    private String mRewardedAdType = "";
    private String mInterstitialAdType = "";
    private FrameLayout mNativeAdLayout;
    private FrameLayout mBannerAdLayout;
    private AppEventsLogger mLogger;

    public static FacebookAds getInstance() {
        if (instance == null) {
            instance = new FacebookAds();
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

        loadRewardedAd();
        loadInterstitialAd();

        initNativeAdLayout(context);
        loadNativeAd();

        initBannerAdLayout(context);
        loadBannerAd();
    }

    /**
     * 获取当前手机屏幕的宽高值（像素），
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

        if (mRewardedAd != null) {
            mRewardedAd.destroy();
            mRewardedAd = null;
        }

        mRewardedAd = new RewardedVideoAd(mContext
                , AdInfoVos.getInstance().getAdInfoValue("rewarded_ad_id", "55"));

        mRewardedAd.loadAd(mRewardedAd.buildLoadAdConfig()
                .withAdListener(new RewardedVideoAdListener() {
                    @Override
                    public void onRewardedVideoCompleted() {
                        Log.d(TAG, "激励广告：可奖励");
                        mHasReward = true;
                    }

                    @Override
                    public void onLoggingImpression(Ad ad) {
                        logAdImpressionEvent(Ads.REWARDED_AD);
                    }

                    @Override
                    public void onRewardedVideoClosed() {
                        Log.d(TAG, "激励广告：已关闭，奖励：" + mHasReward);

                        if (mHasReward) {
//                            startCocosFromRewardedAd(true);
                            AppActivity.callBack.videoShowSuccess(mRewardedAdType);
                        }

                        loadRewardedAd();
                        mHasReward = false;
                    }

                    @Override
                    public void onError(Ad ad, AdError adError) {
                        Log.e(TAG, "激励广告：加载失败-" + adError.getErrorMessage());
                        mHasReward = false;
                    }

                    @Override
                    public void onAdLoaded(Ad ad) {
                        Log.d(TAG, "激励广告：已加载");
                    }

                    @Override
                    public void onAdClicked(Ad ad) {
                        Log.d(TAG, "激励广告：点击");
                        logAdClickEvent(Ads.REWARDED_AD);
                    }
                }).build());
    }

    /**
     * 加载插页广告
     */
    private void loadInterstitialAd() {
        Log.d(TAG, "插页广告：开始加载");

        if (mInterstitialAd != null) {
            mInterstitialAd.destroy();
            mInterstitialAd = null;
        }

        mInterstitialAd = new InterstitialAd(mContext
                , AdInfoVos.getInstance().getAdInfoValue("interstitial_ad_id", "55"));

        mInterstitialAd.loadAd(mInterstitialAd.buildLoadAdConfig()
                .withAdListener(new InterstitialAdListener() {
                    @Override
                    public void onInterstitialDisplayed(Ad ad) {
                        Log.d(TAG, "插页广告：显示");
                    }

                    @Override
                    public void onInterstitialDismissed(Ad ad) {
                        Log.d(TAG, "插页广告：关闭");
//                        startCocosFromInterstitialAd();
                        AppActivity.callBack.adShowSuccess(mInterstitialAdType);

                        loadInterstitialAd();
                    }

                    @Override
                    public void onError(Ad ad, AdError adError) {
                        Log.e(TAG, "插页广告：加载失败-" + adError.getErrorMessage());
                    }

                    @Override
                    public void onAdLoaded(Ad ad) {
                        Log.d(TAG, "插页广告：已加载");
                    }

                    @Override
                    public void onAdClicked(Ad ad) {
                        Log.d(TAG, "插页广告：点击");
                        logAdClickEvent(Ads.INTERSTITIAL_AD);
                    }

                    @Override
                    public void onLoggingImpression(Ad ad) {
                        logAdImpressionEvent(Ads.INTERSTITIAL_AD);
                    }
                }).build());
    }

    /**
     * 加载底部横幅广告
     */
    private void loadBannerAd() {
        Log.d(TAG, "横幅广告：开始加载");

        if (mAdView != null) {
            mAdView.destroy();
            mAdView = null;
        }

        mAdView = new AdView(mContext
                , AdInfoVos.getInstance().getAdInfoValue("banner_ad_id", "55")
                , AdSize.BANNER_HEIGHT_50);

        mBannerAdLayout.removeAllViews();
        mBannerAdLayout.addView(mAdView);
        mBannerAdLayout.setVisibility(View.GONE);

        mAdView.loadAd(mAdView.buildLoadAdConfig()
                .withAdListener(new AdListener() {
                    @Override
                    public void onError(Ad ad, AdError adError) {
                        Log.e(TAG, "横幅广告：加载失败-" + adError.getErrorMessage());
                    }

                    @Override
                    public void onAdLoaded(Ad ad) {
                        Log.d(TAG, "横幅广告：已加载");
                    }

                    @Override
                    public void onAdClicked(Ad ad) {
                        Log.d(TAG, "横幅广告：点击");
                        logAdClickEvent(Ads.BANNER_AD);
                    }

                    @Override
                    public void onLoggingImpression(Ad ad) {
                        logAdImpressionEvent(Ads.BANNER_AD);
                    }
                }).build());
    }

    /**
     * 加载原生广告
     */
    private void loadNativeAd() {
        Log.d(TAG, "原生广告：开始加载");
        if (mNativeAd != null) {
            mNativeAd.destroy();
            mNativeAd = null;
        }

        mNativeAd = new NativeAd(mContext
                , AdInfoVos.getInstance().getAdInfoValue("native_ad_id", "55"));

        mNativeAd.loadAd(mNativeAd.buildLoadAdConfig()
                .withAdListener(new NativeAdListener() {
                    @Override
                    public void onMediaDownloaded(Ad ad) {
                        Log.d(TAG, "原生广告：已完成所有资源的下载");
                    }

                    @Override
                    public void onError(Ad ad, AdError adError) {
                        Log.e(TAG, "原生广告：加载失败-" + adError.getErrorMessage());
                    }

                    @Override
                    public void onAdLoaded(Ad ad) {
                        Log.d(TAG, "原生广告：已加载");
                        populateNativeAd();
                    }

                    @Override
                    public void onAdClicked(Ad ad) {
                        Log.d(TAG, "原生广告：点击");
                        logAdClickEvent(Ads.NATIVE_AD);
                    }

                    @Override
                    public void onLoggingImpression(Ad ad) {
                        logAdImpressionEvent(Ads.NATIVE_AD);
                    }
                }).build());
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
        mRewardedAdType = type;
        if (mRewardedAd == null
                || !mRewardedAd.isAdLoaded()
                || mRewardedAd.isAdInvalidated()) {
            Log.d(TAG, "激励广告：不可用");
            loadRewardedAd();
//            startCocosFromRewardedAd(false);
            AppActivity.callBack.videoShowFailed(mRewardedAdType);

        } else {
            mRewardedAd.show();
        }
    }

    /**
     * 显示插页广告
     *
     * @param type 将要执行Cocos对应操作的类型
     */
    public void showInterstitialAd(String type) {
        mInterstitialAdType = type;
        if (mInterstitialAd == null
                || !mInterstitialAd.isAdLoaded()
                || mInterstitialAd.isAdInvalidated()) {
            Log.d(TAG, "插页广告：不可用");
            loadInterstitialAd();
//            startCocosFromInterstitialAd();
            AppActivity.callBack.adShowSuccess(mInterstitialAdType);


        } else {
            mInterstitialAd.show();
        }
    }

    /**
     * 显示横幅广告
     */
    public void showBannerAd() {
        if (mAdView == null || mAdView.isAdInvalidated()) {
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
     * 显示原生广告
     */
    public void showNativeAd() {
        if (mNativeAd == null
                || !mNativeAd.isAdLoaded()
                || mNativeAd.isAdInvalidated()
                || mNativeAdLayout == null) {
            Log.d(TAG, "原生广告：不可用");
            loadNativeAd();
        } else {
            mNativeAdLayout.setVisibility(View.VISIBLE);
        }
    }

    /**
     * 隐藏原生广告
     */
    public void hideNativeAd() {
        if (mNativeAdLayout != null) {
            mNativeAdLayout.setVisibility(View.GONE);
        }
    }

    /**
     * 填充原生广告视图
     */
    private void populateNativeAd() {
        Log.d(TAG, "原生广告：开始填充");
        mNativeAd.unregisterView();

        LayoutInflater inflater = (LayoutInflater) mContext
                .getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        NativeAdLayout nativeAdLayout = (NativeAdLayout) inflater
                .inflate(R.layout.native_ad_custom, null);

        LinearLayout adChoicesContainer = nativeAdLayout.findViewById(R.id.ad_choices_container);
        AdOptionsView adOptionsView = new AdOptionsView(mContext, mNativeAd, nativeAdLayout);
        adChoicesContainer.removeAllViews();
        adChoicesContainer.addView(adOptionsView, 0);

        MediaView nativeAdMedia = nativeAdLayout.findViewById(R.id.native_ad_media);
        List<View> clickableViews = new ArrayList<>();
        clickableViews.add(nativeAdMedia);

        mNativeAdLayout.removeAllViews();
        mNativeAdLayout.addView(nativeAdLayout);
        mNativeAdLayout.setVisibility(View.GONE);

        mNativeAd.registerViewForInteraction(
                nativeAdLayout,
                nativeAdMedia,
                clickableViews);
        Log.d(TAG, "原生广告：已填充");
    }

    /**
     * 释放 RewardedAd 使用的资源
     */
    public void destroyRewardedAd() {
        if (mRewardedAd != null) {
            mRewardedAd.destroy();
            mRewardedAd = null;
            Log.d(TAG, "激励广告：释放");
        }
    }

    /**
     * 释放 InterstitialAd 使用的资源
     */
    public void destroyInterstitialAd() {
        if (mInterstitialAd != null) {
            mInterstitialAd.destroy();
            mInterstitialAd = null;
            Log.d(TAG, "插页广告：释放");
        }
    }

    /**
     * 释放 NativeAd 使用的资源
     */
    public void destroyNativeAd() {
        if (mNativeAd != null) {
            mNativeAd.destroy();
            mNativeAd = null;
            Log.d(TAG, "原生广告：释放");
        }
    }

    /**
     * 释放 BannerAd 使用的资源
     */
    public void destroyBannerAd() {
        if (mAdView != null) {
            mAdView.destroy();
            mAdView = null;
            Log.d(TAG, "横幅广告：释放");
        }
    }

    /**
     * 释放广告使用的所有资源
     */
    public void destroyAds() {
        destroyNativeAd();
        destroyBannerAd();
        destroyInterstitialAd();
        destroyRewardedAd();
    }

}
