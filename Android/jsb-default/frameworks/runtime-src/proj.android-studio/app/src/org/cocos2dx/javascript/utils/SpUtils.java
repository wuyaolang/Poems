package org.cocos2dx.javascript.utils;

import android.content.Context;
import android.content.SharedPreferences;
import android.text.TextUtils;

import org.cocos2dx.javascript.MyApplication;

public class SpUtils {

    /**
     * 存储是否同意隐私弹窗
     */
    public static void setPrivacy(){
        SharedPreferences sharedPreferences= MyApplication.myApplication.getSharedPreferences("game", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor=sharedPreferences.edit();
        editor.putBoolean("setPrivacy",true);
        editor.apply();
    }

    public static boolean getPrivacy(){
        SharedPreferences sharedPreferences= MyApplication.myApplication.getSharedPreferences("game", Context.MODE_PRIVATE);
        boolean b=sharedPreferences.getBoolean("setPrivacy",false);
        return b;
    }

    /**
     * 存储 用户退出情况
     * @param index
     */
    public static void setIsExit(int index){
        SharedPreferences sharedPreferences= MyApplication.myApplication.getSharedPreferences("game", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor=sharedPreferences.edit();
        editor.putInt("setIsExit",index);
        editor.apply();
    }
    public static int getIsExit(){
        SharedPreferences sharedPreferences= MyApplication.myApplication.getSharedPreferences("game", Context.MODE_PRIVATE);
        int b=sharedPreferences.getInt("setIsExit",0);
        return b;
    }

    /**
     * 存储 隐私政策
     * @param str
     */
    public static void setPrivacyUrl(String str){
        SharedPreferences sharedPreferences= MyApplication.myApplication.getSharedPreferences("game", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor=sharedPreferences.edit();
        editor.putString("setPrivacyUrl",str);
        editor.apply();
    }
    public static String getPrivacyUrl(){
        SharedPreferences sharedPreferences= MyApplication.myApplication.getSharedPreferences("game", Context.MODE_PRIVATE);
        String b=sharedPreferences.getString("setPrivacyUrl","");
        return b;
    }

    /**
     * 存储 用户协议
     * @param str
     */
    public static void setAgreementUrl(String str){
        SharedPreferences sharedPreferences= MyApplication.myApplication.getSharedPreferences("game", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor=sharedPreferences.edit();
        editor.putString("setAgreementUrl",str);
        editor.apply();
    }
    public static String getAgreementUrl(){
        SharedPreferences sharedPreferences= MyApplication.myApplication.getSharedPreferences("game", Context.MODE_PRIVATE);
        String b=sharedPreferences.getString("setAgreementUrl","");
        return b;
    }
	
	/**
     * 存储token
     * @param str
     */
    public static void setLoginToken(String str){
        SharedPreferences preferences= MyApplication.myApplication.getSharedPreferences("game", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor=preferences.edit();
        editor.putString("setLoginToken",str);
        editor.commit();

    }

    public static String getLoginToken(){
        SharedPreferences preferences= MyApplication.myApplication.getSharedPreferences("game", Context.MODE_PRIVATE);
        String str=preferences.getString("setLoginToken","");
        if (TextUtils.isEmpty(str)){
            str=getToken();
        }
        return str;
    }

    /**
     * 存储sdk中token
     * @param str
     */
    public static void setToken(String str){
        SharedPreferences preferences= MyApplication.myApplication.getSharedPreferences("game", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor=preferences.edit();
        editor.putString("setToken",str);
        editor.commit();

    }

    public static String getToken(){
        SharedPreferences preferences= MyApplication.myApplication.getSharedPreferences("game", Context.MODE_PRIVATE);
        String str=preferences.getString("setToken","");
        return str;

    }

    /**
     * 存储用户微信登录信息
     * @param str
     */
    public static void setWxInfo(String str){
        SharedPreferences preferences= MyApplication.myApplication.getSharedPreferences("game", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor=preferences.edit();
        editor.putString("setWxInfo",str);
        editor.apply();

    }

    public static String getWxInfo(){
        SharedPreferences preferences= MyApplication.myApplication.getSharedPreferences("game", Context.MODE_PRIVATE);
        String str=preferences.getString("setWxInfo","");
        return str;
    }


    /**
     * 用户是否登录
     *
     * @return
     */
    public static boolean getLogin() {
        SharedPreferences preferences = MyApplication.myApplication.getSharedPreferences("game", Context.MODE_PRIVATE);
        boolean str = preferences.getBoolean("getLogin", false);
        return str;
    }

    /**
     * 设置用户是否登录
     */

    public static void setLogin(boolean login){
        SharedPreferences preferences = MyApplication.myApplication.getSharedPreferences("game", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = preferences.edit();
        editor.putBoolean("getLogin", login);
        editor.commit();
    }
    /**
     * 用户是否第一次登录
     *
     * @return
     */
    public static boolean getFirstLogin() {
        SharedPreferences preferences = MyApplication.myApplication.getSharedPreferences("game", Context.MODE_PRIVATE);
        boolean str = preferences.getBoolean("getFirstLogin", false);
        return str;
    }

    /**
     * 设置用户是否第一次登录
     */

    public static void setFirstLogin(boolean login){
        SharedPreferences preferences = MyApplication.myApplication.getSharedPreferences("game", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = preferences.edit();
        editor.putBoolean("getFirstLogin", login);
        editor.commit();
    }
}
