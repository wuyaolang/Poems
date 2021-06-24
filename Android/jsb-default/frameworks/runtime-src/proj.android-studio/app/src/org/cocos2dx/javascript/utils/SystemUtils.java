package org.cocos2dx.javascript.utils;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.pm.PackageManager;
import androidx.core.app.ActivityCompat;
import android.telephony.TelephonyManager;
import android.text.TextUtils;
import android.util.Log;

import java.util.Locale;

public class SystemUtils {
    /**
     * 获取当前手机系统语言。
     *
     * @return 返回当前系统语言。例如：当前设置的是“中文-中国”，则返回“zh-CN”
     */
    public static String getSystemLanguage() {
        return Locale.getDefault().getLanguage();
    }

    /**
     * 获取当前系统上的语言列表(Locale列表)
     *
     * @return 语言列表
     */
    public static Locale[] getSystemLanguageList() {
        return Locale.getAvailableLocales();
    }

    /**
     * 获取当前手机系统版本号
     *
     * @return 系统版本号
     */
    public static String getSystemVersion() {
        return android.os.Build.VERSION.RELEASE;
    }

    /**
     * 获取手机型号
     *
     * @return 手机型号
     */
    public static String getSystemModel() {
        return android.os.Build.MODEL;
    }

    /**
     * 获取手机厂商
     * @return 手机厂商
     */
    public static String getDeviceBrand() {
        return android.os.Build.BRAND;
    }

    /**
     * 产品制造商  MANUFACTURER
     * @return 手机厂商
     */

    public static String getManufacturer() {
        String m=android.os.Build.MANUFACTURER;
        return (TextUtils.isDigitsOnly(m)?"":m).toLowerCase();

    }

    public static void getManufacturer(PhoneStyle style) {
        String m=android.os.Build.MANUFACTURER;
        m=(TextUtils.isDigitsOnly(m)?"":m).toLowerCase();
        Log.e("MyApplication", "当前手机厂商: "+m);
        if (style==null)return;
        if (m.equals("huawei")){
            style.huawei();
        }else if (m.equals("xiaomi")){
            style.xiaomi();
        }else if (m.equals("oppo")){
            style.oppo();
        }else if (m.equals("vivo")){
            style.vivo();
        }else if (m.equals("meizu")){
            style.meizu();
        }else {
            style.other();
        }
    }

    public interface PhoneStyle{
        void huawei();
        void xiaomi();
        void oppo();
        void vivo();
        void meizu();
        void other();
    }

    public static String systemInfo(){

        return SystemUtils.getDeviceBrand()+"---"+ SystemUtils.getSystemLanguage()+"---"+ SystemUtils.getSystemModel()+"---"+
                SystemUtils.getSystemVersion()+"---"+ SystemUtils.getSystemLanguageList();
    }

    /**
     * 获取手机IMEI(需要“android.permission.READ_PHONE_STATE”权限)
     * @return 手机IMEI
     */
    public static String getIMEI(Context ctx) {
        TelephonyManager tm = (TelephonyManager) ctx.getSystemService(Activity.TELEPHONY_SERVICE);
        if (tm != null) {
            if (ActivityCompat.checkSelfPermission(ctx, Manifest.permission.READ_PHONE_STATE) != PackageManager.PERMISSION_GRANTED) {
                // TODO: Consider calling
                //    ActivityCompat#requestPermissions
                // here to request the missing permissions, and then overriding
                //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
                //                                          int[] grantResults)
                // to handle the case where the user grants the permission. See the documentation
                // for ActivityCompat#requestPermissions for more details.
                return "";
            }
            return tm.getDeviceId();
        }
        return null;
    }
}
