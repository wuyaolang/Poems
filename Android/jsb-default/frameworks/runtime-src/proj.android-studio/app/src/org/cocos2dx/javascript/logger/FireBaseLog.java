package org.cocos2dx.javascript.logger;

import android.content.Context;
import android.os.Bundle;
import android.util.Log;

import com.google.firebase.analytics.FirebaseAnalytics;

public class FireBaseLog {

    private FirebaseAnalytics mFirebaseAnalytics;

    private static FireBaseLog instance = null;
    private FireBaseLog(){}
    public static FireBaseLog getInstance(){
        if(instance == null){
            instance = new FireBaseLog();
        }
        return instance;
    }

    public void init(Context context){
        mFirebaseAnalytics = FirebaseAnalytics.getInstance(context);
    }


    public void sendCommonEvent(String keyValue){
        Log.i("Logger","eventName:"+keyValue);
        if(mFirebaseAnalytics!=null) {
            Bundle bundle = new Bundle();
            mFirebaseAnalytics.logEvent(keyValue, bundle);
        }
    }

}
