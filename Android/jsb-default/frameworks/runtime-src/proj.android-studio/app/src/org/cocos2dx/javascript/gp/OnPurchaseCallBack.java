package org.cocos2dx.javascript.gp;

import com.android.billingclient.api.BillingClient;
import com.android.billingclient.api.Purchase;

import java.util.List;


public interface OnPurchaseCallBack {
    //Google Pay 返回码
    void responseCode(@BillingClient.BillingResponseCode int code);

    // 成功直接返回该集合
    void onPaySuccess(List<Purchase> purchaseList);

    //用户取消，直接回调该方法
    void onUserCancel();

}
