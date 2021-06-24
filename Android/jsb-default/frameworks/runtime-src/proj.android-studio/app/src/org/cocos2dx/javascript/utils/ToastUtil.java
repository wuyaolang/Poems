package org.cocos2dx.javascript.utils;

import android.content.Context;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.StringRes;

import org.cocos2dx.javascript.MyApplication;

import static org.cocos2dx.javascript.MyApplication.myApplication;

public class ToastUtil {

    private static Toast sToast;

    public static void show(@NonNull CharSequence text) {
        if (sToast == null) {
            sToast = Toast.makeText(myApplication, text, Toast.LENGTH_SHORT);
        } else {
            sToast.setText(text);
        }
        sToast.show();
    }

    public static void show(@StringRes int resId) {
        show(myApplication.getResources().getText(resId));
    }

    public static void show(Context context, @NonNull CharSequence text) {
        if (sToast == null) {
            sToast = Toast.makeText(context.getApplicationContext(), text, Toast.LENGTH_SHORT);
        } else {
            sToast.setText(text);
        }
        sToast.show();
    }

    public static void show(Context context, @StringRes int resId) {
        show(context, context.getResources().getText(resId));
    }

}
