package org.cocos2dx.javascript.utils;

import android.os.Handler;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import com.tilecraft.matchgame.R;

import org.cocos2dx.javascript.MyApplication;

public class ToastView {
    public static Toast toast;
    private static Handler mhandler =new Handler();
    private static Runnable r =new Runnable() {

        public void run() {

            if (toast!=null)
            toast.cancel();
        }

    };
//    public static  void showToast(Activity activity, String content,int lastTime){
//        if (toast != null) {
//            mhandler.removeCallbacks(r);
//        }
//            LayoutInflater layoutInflater = activity.getLayoutInflater();
//            View inflate = layoutInflater.inflate(R.layout.toast_get_gold, null);
//            TextView toast_gold_num = inflate.findViewById(R.id.toast_gold_num);
////            toast_gold_num.setText(content);
//
//            if (toast == null) {
//                //toast=Toast.makeText(activity, content, Toast.LENGTH_SHORT);
//                toast = new Toast(activity);
//                toast_gold_num.setText(content);
//                mhandler.postDelayed(r, 3500);
//            } else {
//                toast_gold_num.setText(content);
//            }
//
////            toast.setView(inflate);
////
////            toast.show();
////
////            mhandler.postDelayed(r, 2000);
//            toast.setGravity(Gravity.CENTER, 0, 0);
//            toast.setView(inflate);
//            toast.setDuration(lastTime);
//            toast.show();
//
//    }

//    public static  void showToastText(Activity activity, String content,int lastTime){
//        if (toast != null) {
//            mhandler.removeCallbacks(r);
//        }
////        LayoutInflater layoutInflater = MyApplication.myApplication.getLayoutInflater();
////        View inflate = layoutInflater.inflate(R.layout.big_toast_custom, null);
//        View inflate = LayoutInflater.from(MyApplication.myApplication).inflate(R.layout.big_toast_custom, null);
//        TextView toast_gold_num = inflate.findViewById(R.id.toast_gold_num);
//
//        if (toast == null) {
//            toast = new Toast(activity);
//            toast_gold_num.setText(content);
//            mhandler.postDelayed(r, lastTime);
//        } else {
//            toast_gold_num.setText(content);
//        }
//
//        toast.setGravity(Gravity.CENTER, 0, 0);
//        toast.setView(inflate);
//        toast.setDuration(lastTime);
//        toast.show();
//    }

    public static  void showSystemText(String content, int lastTime){
        View inflate = LayoutInflater.from(MyApplication.myApplication).inflate(R.layout.big_toast_custom, null);
        TextView toast_gold_num = inflate.findViewById(R.id.toast_gold_num);
        toast_gold_num.setText(content);
        toast = new Toast(MyApplication.myApplication);
        toast.setGravity(Gravity.CENTER, 0, 0);
        toast.setView(inflate);
        toast.setDuration(lastTime);
        toast.show();
    }
}
