package org.cocos2dx.javascript.ui;

import android.os.Bundle;
import android.text.Editable;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import com.common.theone.interfaces.common.factory.FactoryCallBack;
import com.common.theone.interfaces.common.factory.FeedbackFactory;
import com.tilecraft.matchgame.R;

import org.cocos2dx.javascript.utils.Toasts;

import java.util.regex.Pattern;

public class FeedbackActivity extends AppCompatActivity implements View.OnClickListener {
    private EditText mMessageEdit;
    private TextView mMessageTextCount;
    private EditText mQQEdit;
    private TextView mSubmit;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_feedback);
        initView();
    }

    public void initView() {
        mMessageEdit = findViewById(R.id.msg);
        mMessageTextCount = findViewById(R.id.msg_num);
        mQQEdit = findViewById(R.id.msg_qq);
        mSubmit = findViewById(R.id.submit);

        mMessageEdit.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {

            }

            @Override
            public void afterTextChanged(Editable s) {
                if (s != null) {
                    int l = s.length();
                    mMessageTextCount.setText(l + "/300");
                    submitState();
                }
            }
        });

        mQQEdit.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {

            }

            @Override
            public void afterTextChanged(Editable s) {
                if (s != null) {
                    submitState();
                }
            }
        });

        mSubmit.setOnClickListener(this);
        findViewById(R.id.back_ll).setOnClickListener(this);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.back_ll:
                finish();
                break;
            case R.id.submit:
                String content = mMessageEdit.getText().toString();
                if (TextUtils.isEmpty(content)) {
                    Toasts.showToast("请输入内容");
                    return;
                }
                String qqContent = mQQEdit.getText().toString();
                if (TextUtils.isEmpty(qqContent) || !isTelCode(qqContent)) {
                    Toasts.showToast("请输入qq或电话号码");
                    return;
                }
                FeedbackFactory.getInstance().requestData(content + ";" + qqContent, new FactoryCallBack() {
                    @Override
                    public void onSuccess() {
                        finish();
                    }

                    @Override
                    public void onError() {

                    }
                });
                break;
        }
    }

    public void submitState() {
        mSubmit.setEnabled(false);
        String content = mMessageEdit.getText().toString();
        if (TextUtils.isEmpty(content)) {
            Toasts.showToast("请输入内容");
            return;
        }
        String qqContent = mQQEdit.getText().toString();
        if (TextUtils.isEmpty(qqContent) || !isTelCode(qqContent)) {
            Toasts.showToast("请输入qq或电话号码");
            return;
        }
        mSubmit.setBackground(getResources().getDrawable(R.drawable.feedback_btn_bg));
        mSubmit.setEnabled(true);
    }

    private boolean isTelCode(String str) {

        String pattern = "^[0-9]*$";
        Pattern p = Pattern.compile(pattern);

        return p.matcher(str).matches();
    }

}
