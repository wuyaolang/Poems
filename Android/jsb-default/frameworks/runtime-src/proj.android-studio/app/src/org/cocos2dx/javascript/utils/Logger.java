package org.cocos2dx.javascript.utils;

import android.util.Log;

public class Logger {
    private  static final String TAG = "Logger";

    private static boolean openLogger = true;

    public static void i(String info){
        if(!openLogger){
            return;
        }
        Log.i(TAG,info);
    }
    public static void e(String info){
        if(!openLogger){
            return;
        }
        Log.e(TAG,info);
    }
    public static void d(String info){
        if(!openLogger){
            return;
        }
        Log.d(TAG,info);
    }


}
