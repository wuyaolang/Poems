package org.cocos2dx.javascript;

import android.app.Application;
import android.content.Context;

import com.common.theone.base.TheoneSDKApplication;
import com.facebook.ads.AdSettings;
import com.facebook.ads.AudienceNetworkAds;

import io.branch.referral.Branch;

public class MyApplication extends Application {
    private static final String TAG = "Myapplication";
    public static MyApplication myApplication;

    @Override
    public void onCreate() {
        super.onCreate();
        myApplication = this;
        /**
         * 注意: 即使您已经在AndroidManifest.xml中配置过appkey和channel值，也需要在App代码中调
         * 用初始化接口（如需要使用AndroidManifest.xml中配置好的appkey和channel值，
         * UMConfigure.init调用中appkey和channel参数请置为null）。
         */
        //公共服务初始化
        TheoneSDKApplication.initSdk(this);

        // Facebook 广告初始化
//        AudienceNetworkAds.initialize(this);
        // todo Facebook 广告打开测试模式，发布前注销掉
//        AdSettings.setTestMode(true);

        // todo Branch 开启debug日志，发布前注销掉
//        Branch.enableLogging();
//        Branch.enableTestMode();

        // Branch 初始化
        Branch.getAutoInstance(this);

    }

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
//        JLibrary.InitEntry(base);
    }
}
