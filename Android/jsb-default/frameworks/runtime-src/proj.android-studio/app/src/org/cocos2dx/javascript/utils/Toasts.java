package org.cocos2dx.javascript.utils;

import android.widget.Toast;

import org.cocos2dx.javascript.MyApplication;

public class Toasts {
    public static Toast toast;

    public static void showToast(String content) {
        if (toast == null) {
            toast = Toast.makeText(MyApplication.myApplication, content, Toast.LENGTH_SHORT);
        } else {
            toast.setText(content);
        }
        toast.show();
    }
}
