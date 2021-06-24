package org.cocos2dx.javascript.ui;

import android.Manifest;
import android.app.Activity;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.WindowManager;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.core.app.ActivityCompat;

import com.common.theone.interfaces.common.admodel.AdConfigRecommends;
import com.common.theone.interfaces.common.factory.ConfigFactory;
import com.common.theone.interfaces.common.factory.FactoryCallBack;
import com.common.theone.utils.ConfigUtils;
import com.tilecraft.matchgame.R;
import com.trello.rxlifecycle3.components.support.RxAppCompatActivity;

import org.cocos2dx.javascript.AppActivity;
import org.cocos2dx.javascript.utils.SpUtils;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

import io.branch.referral.Branch;
import io.branch.referral.BranchError;

public class SplashActivity extends RxAppCompatActivity {

    /**
     * 权限请求码
     */
    private static final int PERMISSION_REQUEST_CODE = 0;

    /**
     * 应用详情设置界面请求码
     */
    private static final int DETAILS_SETTINGS_REQUEST_CODE = 0;

    /**
     * 所要请求的权限组，不能为空
     */
    private String[] mPermissions = {Manifest.permission.WRITE_EXTERNAL_STORAGE};

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);

        // 在竖屏模式和横屏模式下，内容都会呈现到刘海区域中。
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            WindowManager.LayoutParams lp = getWindow().getAttributes();
            lp.layoutInDisplayCutoutMode =
                    WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
            getWindow().setAttributes(lp);
        }

//        SpUtils.setIsExit(0);

//        requestPermissions();
//        requestAdConfig();
    }


    @Override
    protected void onStart() {
        super.onStart();
//        Branch.sessionBuilder(this)
//                .withCallback(branchReferralInitListener)
//                .withData(getIntent() != null ? getIntent().getData() : null)
//                .init();
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
//        Branch.sessionBuilder(this)
//                .withCallback(branchReferralInitListener)
//                .reInit();
    }

//    private Branch.BranchReferralInitListener branchReferralInitListener = new Branch.BranchReferralInitListener() {
//        @Override
//        public void onInitFinished(@Nullable JSONObject referringParams, @Nullable BranchError error) {
//            Log.d("Branch", "onInitFinished: " +"error: " + (error == null ? "yes" : "no"));
//            Log.d("Branch", "onInitFinished: " +referringParams.toString());
//        }
//    };

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
                startAppActivity();
            }

            @Override
            public void onError() {
                startAppActivity();
            }
        });
    }

    /**
     * 请求权限组
     */
    private void requestPermissions() {
        ActivityCompat.requestPermissions(this, mPermissions, PERMISSION_REQUEST_CODE);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == PERMISSION_REQUEST_CODE) {
            List<String> denied = new ArrayList<>(); // 被拒绝的权限组
            List<String> deniedAndNeverAskAgain = new ArrayList<>(); // 被拒绝并且不再询问的权限组
            int length = grantResults.length;
            for (int i = 0; i < length; i++) {
                if (grantResults[i] != PackageManager.PERMISSION_GRANTED) {
                    if (ActivityCompat.shouldShowRequestPermissionRationale(this, permissions[i])) {
                        denied.add(permissions[i]);
                    } else {
                        deniedAndNeverAskAgain.add(permissions[i]);
                    }
                }
            }

            if (denied.isEmpty() && deniedAndNeverAskAgain.isEmpty()) {
                // 必要权限均已授予
                requestAdConfig();
            } else if (denied.size() > 0) {
                // 必要权限有被拒绝，向用户说明使用这些权限的理由
                AlertDialog.Builder builder = new AlertDialog.Builder(this);
                builder.setMessage(R.string.dialog_permission_message_request_rationale)
                        .setCancelable(false)
                        .setPositiveButton(R.string.dialog_permission_positive_button,
                                new DialogInterface.OnClickListener() {
                                    @Override
                                    public void onClick(DialogInterface dialogInterface, int i) {
                                        requestPermissions();
                                    }
                                })
                        .show();
            } else {
                // 必要权限有被拒绝并且不再询问，提示用户去应用信息里自行授予权限
                AlertDialog.Builder builder = new AlertDialog.Builder(this);
                builder.setMessage(R.string.dialog_permission_message_app_details_settings)
                        .setCancelable(false)
                        .setPositiveButton(R.string.dialog_permission_positive_button,
                                new DialogInterface.OnClickListener() {
                                    @Override
                                    public void onClick(DialogInterface dialogInterface, int i) {
                                        startApplicationDetailsSettings();
                                    }
                                })
                        .show();
            }
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == DETAILS_SETTINGS_REQUEST_CODE) {
            requestPermissions();
        }
    }

    /**
     * 跳转到 AppActivity
     */
    private void startAppActivity() {
        startActivity(new Intent(SplashActivity.this, AppActivity.class));
        SplashActivity.this.finish();
    }

    /**
     * 跳转到 ApplicationDetailsSettings，该应用信息界面
     */
    private void startApplicationDetailsSettings() {
        Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
        intent.setData(Uri.fromParts("package", getPackageName(), null));
        startActivityForResult(intent, DETAILS_SETTINGS_REQUEST_CODE);
    }

    /**
     * 跳转到应用详情界面
     */
    public static void gotoAppDetailIntent(Activity activity) {
        Intent intent = new Intent();
        intent.setAction(android.provider.Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
        intent.setData(Uri.parse("package:" + activity.getPackageName()));
        activity.startActivity(intent);
    }

    /**
     * 开屏页一定要禁止用户对返回按钮的控制，否则将可能导致用户手动退出了 App 而广告无法正常
     * 曝光和计费。
     */
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK || keyCode == KeyEvent.KEYCODE_HOME) {
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            // 沉浸式（隐藏状态栏和导航栏）
            View decorView = getWindow().getDecorView();
            decorView.setSystemUiVisibility(
                    View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                            | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                            | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                            | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                            | View.SYSTEM_UI_FLAG_FULLSCREEN
                            | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
            );
        }
    }
}
