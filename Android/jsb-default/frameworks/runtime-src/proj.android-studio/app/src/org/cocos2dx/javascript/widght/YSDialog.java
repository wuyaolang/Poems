package org.cocos2dx.javascript.widght;

import android.app.Activity;
import android.app.Dialog;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.text.SpannableString;
import android.text.Spanned;
import android.text.TextPaint;
import android.text.TextUtils;
import android.text.method.LinkMovementMethod;
import android.text.style.ClickableSpan;
import android.view.View;
import android.widget.TextView;


import com.tilecraft.matchgame.R;
import com.common.theone.interfaces.common.admodel.AdConfigRecommends;
import com.common.theone.interfaces.common.admodel.AdInfoVos;

import org.cocos2dx.javascript.ui.MyWebViewActivity;
import org.cocos2dx.javascript.utils.MyConfigs;
import org.cocos2dx.javascript.utils.SpUtils;
import org.cocos2dx.javascript.utils.ToastView;


/**
 * created by ang
 * on ${DATA}
 * 隐私弹窗
 */
public class YSDialog extends Dialog implements View.OnClickListener {
    private TextView tv_desc;
    private TextView tv_unagree;
    private TextView tv_agree;
    private TextView content;
    private AgreeListener listener;
    private Activity activity;

    public YSDialog getIntance(Context context, AgreeListener listener) {
        return new YSDialog(context, listener);
    }

    public YSDialog(Context context, AgreeListener listener) {
        super(context, R.style.Dialog);
        this.activity = (Activity) context;
        this.listener = listener;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.dialog_ys);
        setCancelable(false);
        tv_desc = (TextView) findViewById(R.id.tv_desc);
        tv_unagree = (TextView) findViewById(R.id.tv_unagree);
        tv_agree = (TextView) findViewById(R.id.tv_agree);
        content = (TextView) findViewById(R.id.content);
        String contentTx = "1、我们会申请允许程序读取或写入外部存储，仅用于获取APP的使用状态。\n" +
                "2、我们会申请您的设备信息，仅用于用户的标识。\n" +
                "3、我们会申请允许一个程序获取其他应用占用空间容量，仅用于您手机垃圾数据的维护与清理。\n" +
                "4、允许应用跟踪正在使用其他应用和使用频率，以及缓存信息，运营商，仅用于您手机垃圾数据的维护与清理。\n" +
                "5、我们保证您的权限不会用于其他用途，且通讯录，GPS、摄像头、麦克风、相册等敏感权限均不会默认开启，只有经过明示授权才会为实现功能或服务时使用，你均可以拒绝并不影响你继续使用本应用。";

        String intro = AdConfigRecommends.getInstance().getRecommendModel("private_introduce").getMemo();
        if (!TextUtils.isEmpty(intro)) {
            contentTx = intro;
        }
        content.setText(contentTx);
        tv_unagree.setOnClickListener(this);
        tv_agree.setOnClickListener(this);
        SpannableString spanString = new SpannableString("《用户协议》");
        MyClickableSpan clickableSpan = new MyClickableSpan("《用户协议》");
        spanString.setSpan(clickableSpan, 0, spanString.length(), Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);

        SpannableString spanString2 = new SpannableString("《隐私政策》");
        MyClickableSpan clickableSpan2 = new MyClickableSpan("《隐私政策》");
        spanString2.setSpan(clickableSpan2, 0, spanString2.length(), Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);

        tv_desc.setText("请充分阅读并理解");
        tv_desc.append(spanString);
        tv_desc.append(" 和 ");
        tv_desc.append(spanString2);
        tv_desc.setMovementMethod(LinkMovementMethod.getInstance());
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.tv_unagree:
                ToastView.showSystemText("请您同意授权，否则将无法使用本APP", 1500);
                break;
            case R.id.tv_agree:
                if (listener != null) listener.onAgree();
                SpUtils.setPrivacy();
                dismiss();
                break;
        }
    }

    public interface AgreeListener {
        void onAgree();
    }


    class MyClickableSpan extends ClickableSpan {

        private String content;

        public MyClickableSpan(String content) {
            this.content = content;
        }

        @Override
        public void updateDrawState(TextPaint ds) {
            ds.setUnderlineText(false);
            ds.setColor(getContext().getResources().getColor(R.color.colorFont1));
        }

        @Override
        public void onClick(View widget) {
            if (TextUtils.isEmpty(content)) {
                return;
            }
            if (content.equals("《隐私政策》")) {
                Intent intent = new Intent(getContext(), MyWebViewActivity.class);
                intent.putExtra("url", TextUtils.isEmpty(SpUtils.getPrivacyUrl()) ?
                        MyConfigs.PRIVACY_URL
                        : SpUtils.getPrivacyUrl());
                getContext().startActivity(intent);
            } else {
                Intent intent = new Intent(getContext(), MyWebViewActivity.class);
                intent.putExtra("url", TextUtils.isEmpty(SpUtils.getAgreementUrl()) ?
                        MyConfigs.USER_AGREEMENT_URL
                        : SpUtils.getAgreementUrl());
                getContext().startActivity(intent);
            }

        }
    }
}
